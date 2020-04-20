/**
 * This file is part of Totara Mobile
 *
 * Copyright (C) 2019 onwards Totara Learning Solutions LTD
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @author: Kamala Tennakoon <kamala.tennakoon@totaralearning.com>
 */

import React, { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View, Modal } from "react-native";
import moment from "moment";
import * as RNFS from "react-native-fs";

import { Activity } from "@totara/types";
import { AuthContext } from "@totara/core";
import { ScormBundle, AttemptGrade, Grade } from "@totara/types/Scorm";
import { MoreText, PrimaryButton, SecondaryButton, NotificationView } from "@totara/components"
import { gutter, ThemeContext } from "@totara/theme";
import { getOfflineScormPackageName, OfflineScormServerRoot } from "./offline";
import { Log } from "@totara/lib";
import ResourceManager , { ResourceObserver} from "@totara/core/ResourceManager/ResourceManager";
import ResourceDownloader from "@totara/components/ResourceDownloader"
import { IResource, ResourceState } from "@totara/core/ResourceManager/Resource"
import { translate } from "@totara/locale";
import { DATE_FORMAT, DATE_FORMAT_FULL, SECONDS_FORMAT } from "@totara/lib/Constant";
import { getOfflineScormBundle, calculatedAttemptsGrade, syncOfflineScormBundle } from "./offline/OfflineSCORMController";
import { SCORMActivityType } from "./SCORMActivity";
import SCORMAttempts from "./SCORMAttempts";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { AppliedTheme } from "@totara/theme/Theme";


type Props = {
  activity: Activity,
  data?: ScormBundle,
  isUserOnline: boolean,
  setActionWithData: (action: SCORMActivityType, bundle: ScormBundle, data: any) => void
};

enum Section {
  None,
  Attempts
}

const gridStyle = (theme: AppliedTheme) => ([theme.textB1, {color: theme.textColorSubdued}]);

type GridLabelProps = {
  theme: AppliedTheme,
  textId: string,
  value: string,
  children?: Element,
};

const GridLabelValue = ({theme, textId, value, children}: GridLabelProps ) => (
  <View style={styles.sectionField} >
    <Text style={theme.textB1}>{translate(textId)}</Text>
    <View style={{flexDirection: "row"}}>
      <Text style={gridStyle(theme)}>{value}</Text>
      {children}
    </View>
  </View>
);

const SCORMSummary = ({activity, data, isUserOnline, setActionWithData}: Props) => {
  const {authContextState: { appState }} = useContext(AuthContext);
  const [scormBundle, setScormBundle] = useState<ScormBundle | undefined>(data);
  const [section, setSection] = useState(Section.None);
  const [theme] = useContext(ThemeContext);
  
  
  //====== Download ==========
  const [resource, setResource] = useState<IResource>();
  const downloadingFile = resource && resource!.state === ResourceState.Downloading;
  const hasFileDownloaded = resource && resource!.state === ResourceState.Completed;
  const [downloadManager] = useState<ResourceManager>(ResourceManager.getInstance());

  const onDownloadContentTap = () => {
    if(resource)
      return;
    //TODO: PREVENT DOWNLOAD CONTENT TWICE
    if (scormBundle) {
      const _url = scormBundle!.scorm.packageUrl!;
      const _scormId = scormBundle!.scorm.id;
      const _courseId = scormBundle!.scorm.courseid;
      const _name = scormBundle!.scorm.name;
  
      const SCORMPackageDownloadPath = `${RNFS.DocumentDirectoryPath}`;
      const offlineSCORMPackageName = getOfflineScormPackageName(_courseId, _scormId);
      const _targetZipFile = `${SCORMPackageDownloadPath}/${offlineSCORMPackageName}.zip`;
      const _unzipPath = `${OfflineScormServerRoot}/${offlineSCORMPackageName}`;
      const _downloadId = _scormId.toString();
      if(appState && appState.apiKey) {
        downloadManager.download(appState.apiKey, _downloadId, _name, _url, _targetZipFile, _unzipPath);
      } else {
        Log.debug("Cannot find api key");
      }  
    }
    
  };

  const onDownloadFileUpdated : ResourceObserver = (resourceFile) => {
    if(scormBundle && scormBundle.scorm) {
      setResource(resourceFile);
      if(resourceFile.state === ResourceState.Completed) {
        const offlineSCORMPackageName = getOfflineScormPackageName(scormBundle.scorm.courseid, scormBundle.scorm.id);
        const _unzipPath = `${OfflineScormServerRoot}/${offlineSCORMPackageName}`;
        if(resourceFile.unzipPath === _unzipPath) {
          const _offlineScormData = {
            scorm: scormBundle.scorm,
            scormPackage: {
              path: offlineSCORMPackageName
            },
            lastsynced: scormBundle.lastsynced
          } as ScormBundle;
          
          syncOfflineScormBundle(activity.instanceid, _offlineScormData).then(()=> {
            setScormBundle(_offlineScormData);
          });
        }
      }
    }
  }

  useEffect(()=>{
    if(!scormBundle || !scormBundle.scorm) return;

    downloadManager.attach(onDownloadFileUpdated);

    const filter = downloadManager.snapshot.filter(x=>x.id === scormBundle.scorm.id.toString());
    if(filter.length>0){
      const existingResource = filter[0];
      setResource(existingResource);
    }

    return () =>{
      downloadManager.detach(onDownloadFileUpdated);
    }
  }, [scormBundle.scorm, downloadManager]);
  //====== ======= ============

  const onTapNewAttempt = () => {
    if(scormBundle && scormBundle.scorm) {
      if (!isUserOnline) {
        let newAttempt = scormBundle.scorm && scormBundle.scorm.attemptsCurrent ? scormBundle.scorm.attemptsCurrent : 0;
        if(scormBundle.offlineActivity && scormBundle.offlineActivity.attempts) {
          newAttempt = newAttempt + scormBundle.offlineActivity.attempts.length;
        }
        newAttempt = newAttempt + 1;
        setActionWithData(SCORMActivityType.Offline, scormBundle, {attempt: newAttempt});
      } else {
        if (scormBundle.scorm && scormBundle.scorm.launchUrl) {
          setActionWithData(SCORMActivityType.Online, scormBundle, {url: scormBundle.scorm.launchUrl});
        } else {
          Log.debug("Launch url cannot find. ", scormBundle.scorm.launchUrl);
        }
      }
    } else {
      Log.debug("Scorm data could not found", scormBundle);
    }
  };

  const onTapViewAllAttempts = () => {
    if(scormBundle && scormBundle.scorm && (scormBundle.scorm.attempts || scormBundle.offlineActivity && scormBundle.offlineActivity.attempts)) {
      setSection(Section.Attempts);
    } else {
      Log.debug("Scorm data could not found", scormBundle);
    }
  };

  const onTapContinueLastAttempt = () => {
    if(isUserOnline) {
      if (scormBundle) {
        if (scormBundle.scorm && scormBundle.scorm.repeatUrl) {
          setActionWithData(SCORMActivityType.Online, scormBundle, {url: scormBundle.scorm.repeatUrl});
        } else {
          Log.debug("Repeat url cannot find. ", scormBundle.scorm.repeatUrl);
        }
      } else {
        Log.debug("Scorm data could not found", scormBundle);
      }
    }
  };
  
  useEffect(()=> {  
    if(!isUserOnline) {
      getOfflineScormBundle(activity.instanceid).then(result => {
        if (result ) {
          const storedBundle = result! as ScormBundle;
          let newBundle: ScormBundle = storedBundle;
          if (scormBundle && scormBundle.lastsynced && scormBundle.lastsynced >= storedBundle.lastsynced) {
            newBundle.scorm = scormBundle.scorm;
            newBundle.lastsynced = scormBundle.lastsynced;
            syncOfflineScormBundle(activity.instanceid, {scorm: newBundle.scorm, lastsynced: newBundle.lastsynced}).then(()=> {
              setScormBundle(newBundle);
            });
          } else {
            setScormBundle(newBundle);
          }
        } 
      });
    } else {
      setScormBundle(data);
      if(data && data.scorm && data.lastsynced) {
        syncOfflineScormBundle(activity.instanceid, {scorm: data.scorm, lastsynced: data.lastsynced});
      }
      
    }
  }, [data]);
  
  const description = scormBundle!.scorm.description && scormBundle!.scorm.description !== null ? scormBundle!.scorm.description : undefined;
  let totalAttempt = scormBundle!.scorm.attemptsCurrent ? scormBundle!.scorm.attemptsCurrent : 0;
  if (scormBundle!.offlineActivity && scormBundle!.offlineActivity.attempts) {
    totalAttempt = totalAttempt + scormBundle!.offlineActivity.attempts.length;
  }
  
  const attemptGrade = scormBundle!.scorm.whatgrade ? parseInt(scormBundle!.scorm.whatgrade) as AttemptGrade : null;
  const gradeMethod = scormBundle!.scorm.grademethod ? parseInt(scormBundle!.scorm.grademethod) as Grade : null;
  const offlineAttempts = scormBundle!.offlineActivity && scormBundle!.offlineActivity.attempts ? scormBundle!.offlineActivity.attempts : undefined;
  const calculatedGrade = calculatedAttemptsGrade(attemptGrade, gradeMethod, scormBundle!.scorm.maxgrade, scormBundle!.scorm.calculatedGrade, scormBundle!.scorm.attempts, offlineAttempts, );
  
  const isCompletedAttempts = scormBundle && scormBundle!.scorm && scormBundle!.scorm.attemptsMax && totalAttempt >= scormBundle!.scorm.attemptsMax;
  const isUpcomingActivity = scormBundle && scormBundle!.scorm && scormBundle!.scorm.timeopen && scormBundle!.scorm.timeopen > parseInt(moment().format(SECONDS_FORMAT));
  const hasStartNewAttempt = ((isUserOnline && scormBundle && scormBundle!.scorm && scormBundle!.scorm.launchUrl) || (!isUserOnline && scormBundle.scorm.offlineAttemptsAllowed && scormBundle.scormPackage && scormBundle.scormPackage.path));
  const hasRepeatAttempt = isUserOnline && scormBundle && scormBundle!.scorm && scormBundle!.scorm.repeatUrl;
  let actionPrimary = (hasStartNewAttempt) ? { title: translate("scorm.summary.new_attempt"), action: onTapNewAttempt} : undefined;
  let actionSecondary = (hasRepeatAttempt) ? { title: translate("scorm.summary.last_attempt"), action: onTapContinueLastAttempt} : undefined;
  
  const shouldShowAction = !isUpcomingActivity && !isCompletedAttempts && (hasStartNewAttempt || hasRepeatAttempt);
  
  const lastsyncText = !isUserOnline && scormBundle ? `${translate("scorm.last_synced")}: ${moment.unix(scormBundle.lastsynced).toNow(true)} ${translate("scorm.ago")} (${moment.unix(scormBundle.lastsynced).format(DATE_FORMAT)})` : null;
  const completedAttemptsText = isCompletedAttempts ? translate("scorm.info_completed_attempts") : null;
  const upcommingActivityText = !isCompletedAttempts && isUpcomingActivity ? `${translate("scorm.info_upcoming_activity")} ${moment.unix(scormBundle!.scorm.timeopen).format(DATE_FORMAT_FULL)}` : null;
  
  return (
  <>
  <View style={styles.expanded}>  
  { shouldShowAction && lastsyncText && <NotificationView mode={"info"} text={lastsyncText} icon={"bolt"} /> }
  { completedAttemptsText && <NotificationView mode={"alert"} text={completedAttemptsText} icon={"exclamation-circle"}  /> }
  { upcommingActivityText && <NotificationView mode={"alert"} text={upcommingActivityText} icon={"exclamation-circle"}  /> }
   <View style={{flex: 1}}>
      <ScrollView>
        <View style={{ padding: gutter }}>
          <View style={[styles.sectionBreak, {paddingTop: 0}]}>
            { description && <Text style={[theme.textH2, {alignSelf: "center", flex: 1}]}>{translate("scorm.summary.summary")}</Text> }
            { isUserOnline && <ResourceDownloader downloading={downloadingFile!} onDownloadTap={onDownloadContentTap} progress={resource && resource.percentCompleted ? resource.percentCompleted! : 0} downloadOK={hasFileDownloaded}/> }
          </View>
          { description && <MoreText longText={description} />}
          <View style={styles.sectionField}>
            <Text style={[theme.textH2, {alignSelf: "center", flex: 1}]}>{translate("scorm.summary.grade.title")}</Text>
          </View>
          <GridLabelValue
            theme={theme}
            textId={"scorm.summary.grade.method"} 
            value={attemptGrade !=  null ? translate(`scorm.grading_method.${attemptGrade}`) : translate("scorm.summary.attempt.unlimited")} 
          />
          <TouchableOpacity onPress={onTapViewAllAttempts}>
            <GridLabelValue
              theme={theme}
              textId={"scorm.summary.grade.reported"} 
              value={calculatedGrade} >
              <FontAwesomeIcon icon="chevron-right" size={theme.textB1.fontSize} style={{alignSelf: "center", marginLeft: 8}} color={theme.textColorSubdued} />
            </GridLabelValue>
          </TouchableOpacity>
          <Text style={[theme.textH2, styles.sectionBreak]}>{translate("scorm.summary.attempt.title")}</Text>
          <GridLabelValue
            theme={theme}
            textId={"scorm.summary.attempt.total_attempts"} 
            value={scormBundle!.scorm.attemptsMax ? scormBundle!.scorm.attemptsMax.toString() : translate("scorm.summary.attempt.unlimited")} 
          />
          <GridLabelValue
            theme={theme}
            textId={"scorm.summary.attempt.completed_attempts"} 
            value={totalAttempt.toString()} 
          />
        </View>
      </ScrollView>
    </View>
    {shouldShowAction && <AttemptController primary={actionPrimary} secondary={actionSecondary} /> }
  </View>
  { scormBundle &&
  <Modal visible={section === Section.Attempts}>
    <SCORMAttempts scormBundle={scormBundle} onExit={()=> setSection(Section.None)} />
  </Modal> }
  </>
  );
};

const styles = StyleSheet.create({
  expanded: {
    flex: 1,
    flexDirection: "column"
  },
  sectionBreak: {
    flexDirection: "row",
    paddingTop: 8,
    paddingBottom: 8,
    justifyContent: "space-between" 
  },
  sectionField: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8
  },
  attemptContainer: {
    paddingHorizontal: gutter,
    paddingVertical: 8,
    flexDirection: "column",
    alignItems: "stretch"
  }
});

type PropsAttempt = {
  primary: PropsInfo | undefined,
  secondary: PropsInfo | undefined
};

type PropsInfo = {
  title: string,
  action: ()=>void
};

const AttemptController = ({ primary, secondary }: PropsAttempt) => {

  return (<View style={stylesAction.attemptContainer}>
    <View style={{flexDirection: "row", justifyContent: "space-between" }}>
      { secondary && <SecondaryButton text={secondary.title} onPress={secondary.action} style={{flex: 1, marginRight: primary ? 16 : 0}} /> }
      { primary && <PrimaryButton text={primary.title} onPress={primary.action} style={{flex: 1}} /> }
    </View>
  </View>);
};

const stylesAction = StyleSheet.create({
  attemptContainer: {
    paddingHorizontal: gutter,
    paddingVertical: 8,
    flexDirection: "column",
    alignItems: "stretch"
  }
});

export default SCORMSummary;