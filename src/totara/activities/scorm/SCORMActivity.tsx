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
 * @author Tharaka Dushmantha <tharaka.dushmantha@totaralearning.com
 */

import React, { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View, Alert } from "react-native";
import { useQuery } from "@apollo/react-hooks";
import moment from "moment";
import { useNetInfo } from "@react-native-community/netinfo";
import * as RNFS from "react-native-fs";

import { Activity, ActivityType } from "@totara/types";
import { AuthContext } from "@totara/core";
import { scormQuery } from "@totara/activities/scorm/api";
import { OfflineScormPackage, Scorm } from "@totara/types/Scorm";
import { MoreText, PrimaryButton, SecondaryButton, LinkText } from "@totara/components"
import { gutter, ThemeContext } from "@totara/theme";
import {
  OfflineScormActivity,
  getSCORMData,
  setSCORMPackageData,
  getOfflineSCORMPackageName, OfflineSCORMServerRoot
} from "./offline";
import GradeDetails from "./GradeDetails";
import OnlineScormActivity from "./online/OnlineScormActivity";
import { Log } from "@totara/lib";
import ResourceManager , { ResourceObserver} from "@totara/core/ResourceManager/ResourceManager";
import ResourceDownloader from "@totara/components/ResourceDownloader"
import { IResource, ResourceState } from "@totara/core/ResourceManager/Resource"
import { ActivitySheetContext } from "../ActivitySheet";
import { translate } from "@totara/locale";
import { DATE_FORMAT } from "@totara/lib/Constant";
import { AuthenticatedWebView } from "@totara/auth";

const SCORMActivityAPI = (props: {activity: Activity}) => {
  const { loading, error, data } = useQuery(scormQuery, {
    variables: { scormid: props.activity.instanceid },
  });
  if (loading) { return <Text>Loading...</Text>; }
  if (error) { return <Text>Something went wrong, please try again later.</Text>; }
  if (data && data.scorm) {
    return <SCORMActivity activity={props.activity} scorm={data.scorm} />;
  } else { return <Text>Something went wrong, please try again later.</Text>; }
};

type SCORMActivityProps = {
  activity: Activity,
  scorm: Scorm,
};

type SCORMAction = {
  mode: SCORMType,
  attempt?: number,
  scoId?: string,
  url?: string
};

enum SCORMType {
  None,
  Offline,
  Online
};

const SCORMActivity = ({ activity, scorm }: SCORMActivityProps) => {
  const {authContextState: { appState }} = useContext(AuthContext);
  const apiKey = appState && appState.apiKey ? appState.apiKey : null;
  const [scormAction, setScormAction] = useState<SCORMAction>({mode: SCORMType.None});

  const [isUserOnline, setIsUserOnline] = useState<boolean>(false);//TODO: need to set default true
  const [scormResultData, setScormResultData] = useState<OfflineScormPackage>({scorm: scorm});
  const netInfo = useNetInfo();
  const ativitySheet = useContext(ActivitySheetContext);

  useEffect(()=> {
    if(scormAction.mode === SCORMType.Offline || scormAction.mode === SCORMType.Online) {
      ativitySheet.setFeedback({activity: activity as ActivityType, data: {isOnline: isUserOnline}});
    } else {
      ativitySheet.setFeedback(undefined);
    }
  }, [scormAction])

  useEffect(()=> {
    if (netInfo.type !== "unknown" && (netInfo.isInternetReachable !== undefined && netInfo.isInternetReachable !== null)) {
      setIsUserOnline(netInfo.isInternetReachable); //TODO - need to enable
    }
  }, [netInfo]);

  useEffect(() => {
      if (isUserOnline) {
        setScormResultData({scorm: scorm, lastsynced: moment.now()});
      } else {
        getSCORMData(activity.instanceid, scorm).then(result => {
          if (result) {
            // const offlineData: OfflineScormPackage =  {...result, ...{scorm: scorm}};
            const offlineData =  result as OfflineScormPackage;
            setScormResultData(offlineData);
          } 
        });
      }
  }, [scorm, isUserOnline]);


  useEffect(() => {
    if (scormResultData && scormResultData.scorm) { //TODO - add checking whether online 
      setSCORMPackageData(activity.instanceid, {scorm: scormResultData.scorm, package: scormResultData.package, lastsynced: scormResultData.lastsynced});
    }
  }, [scormResultData, isUserOnline]);

  //DOWNLOAD CONTENT - BEGIN
  const onDownloadContentTap = () => {
    if(resource)
      return;

    //TODO: PREVENT DOWNLOAD CONTENT TWICE
    const _url = scorm.packageUrl!;
    const _scormId = scorm.id;
    const _courseId = scorm.courseid;

    const SCORMPackageDownloadPath = `${RNFS.DocumentDirectoryPath}`;
    const offlineSCORMPackageName = getOfflineSCORMPackageName(_courseId, _scormId);
    const _targetZipFile = `${SCORMPackageDownloadPath}/${offlineSCORMPackageName}.zip`;
    const _unzipPath = `${OfflineSCORMServerRoot}/${offlineSCORMPackageName}`;
    const _downloadId = _scormId.toString();
    const _name = activity.name;

    downloadManager.download(
        apiKey!,
        _downloadId,
        _name,
        _url,
        _targetZipFile,
        _unzipPath);
  };

  const [resource, setResource] = useState<IResource>();
  const onDownloadFileUpdated : ResourceObserver = (resourceFile) => {
    setResource(resourceFile);
    if(resourceFile.state === ResourceState.Completed) {
      const offlineSCORMPackageName = getOfflineSCORMPackageName(scorm.courseid, scorm.id);
      const _unzipPath = `${OfflineSCORMServerRoot}/${offlineSCORMPackageName}`;
      if(resourceFile.unzipPath === _unzipPath) {
        const _offlineScormData = {
          scorm: scorm,
          package: {
            path: offlineSCORMPackageName
          }
        } as OfflineScormPackage;
        setScormResultData(_offlineScormData);
      }
    }
  }

  const [downloadManager] = useState<ResourceManager>(ResourceManager.getInstance());
  useEffect(()=>{
    if(!scorm) return;

    downloadManager.attach(onDownloadFileUpdated);

    const filter = downloadManager.snapshot.filter(x=>x.id === scorm.id.toString());
    if(filter.length>0){
      const existingResource = filter[0];
      setResource(existingResource);
    }

    return () =>{
      downloadManager.detach(onDownloadFileUpdated);
    }
  }, [scorm, downloadManager]);
  //DOWNLOAD CONTENT - END


  //START NEW ATTEMPT
  const onStartAttemptTap = () => {
    if(scormResultData) {
      if (!isUserOnline) {
        const offlineLastAttempt = scormResultData.offlineActivity && scormResultData.offlineActivity.last.attempt ? scormResultData.offlineActivity.last.attempt : 0;
        const newOfflineAttempt = !scormResultData.scorm.attemptsCurrent || scormResultData.scorm.attemptsCurrent < offlineLastAttempt ? offlineLastAttempt + 1 : scormResultData.scorm.attemptsCurrent + 1;
        setScormAction({mode: SCORMType.Offline, attempt: newOfflineAttempt});
      } else {
        setScormAction({mode: SCORMType.Online, url: scormResultData.scorm.launchUrl});
      }
    }
  };

  //START Continue ATTEMPT
  const onContinueAttemptTap = () => {
    if(scormResultData) {
      if (isUserOnline) {
        // TODO - need to set corrent url for continue last attmept
        setScormAction({mode: SCORMType.Online, url: scormResultData.scorm.launchUrl});
      } else {
        // if (scormResultData.offlineActivity && scormResultData.offlineActivity.last.attempt) {
        //   setScormAction({mode: SCORMType.Offline, attempt: scormResultData.offlineActivity.last.attempt});
        // } else {
        //   Log.debug("No pending offline attempt to complete"); //TODO handle this
        // }
      }
    }
  };

  const MainContent = () => {
    const [theme] = useContext(ThemeContext);

    const downloadingFile = resource && resource!.state === ResourceState.Downloading;
    const hasFileDownloaded = resource && resource!.state === ResourceState.Completed;

    let totalAttempt = scormResultData && scormResultData.scorm && scormResultData.scorm.attemptsCurrent ? scormResultData.scorm.attemptsCurrent : 0;
    if (!isUserOnline && scormResultData && scormResultData.offlineActivity && scormResultData.offlineActivity.last.attempt) {
      totalAttempt = scormResultData.offlineActivity.last.attempt;
    }

    const shouldShowAction = (scormResultData && scormResultData.scorm  && (isUserOnline || (scormResultData.scorm.offlineAttemptsAllowed && scormResultData.package  && scormResultData.package.path)));
    
    return (
      <View style={styles.expanded}>
        {!isUserOnline && scormResultData && <Text style={[theme.textSmall,{ backgroundColor: theme.colorLink, color: theme.colorNeutral1, padding: 8}]}>⚡︎ {translate("scorm.last_synced")}: {moment(scormResultData.lastsynced).toNow(true)} {translate("scorm.ago")} ({moment(scormResultData.lastsynced).format(DATE_FORMAT)})</Text> }
        <View style={{flex: 1}}>
          <ScrollView >
            <View style={{ padding: gutter }}>
              <View style={[styles.sectionBreak, {paddingTop: 0}]}>
                { scormResultData && scormResultData.scorm && scormResultData.scorm.description !== undefined && scormResultData.scorm.description !== null && <Text style={[theme.textH2, {alignSelf: "center", flex: 1}]}>{translate("scorm.summary.summary")}</Text> }
                <ResourceDownloader downloading={downloadingFile!} onDownloadTap={onDownloadContentTap} progress={resource && resource.percentCompleted ? resource.percentCompleted! : 0} downloadOK={hasFileDownloaded}/>
              </View>
              { scormResultData && scormResultData.scorm && scormResultData.scorm.description !== undefined && scormResultData.scorm.description !== null && <MoreText longText={scormResultData.scorm.description} /> }
              
              <View style={styles.sectionField}>
                <Text style={[theme.textH2, {alignSelf: "center", flex: 1}]}>{translate("scorm.summary.grade.title")}</Text>
                {totalAttempt > 6 && <LinkText text={translate("scorm.summary.grade.view_all")} onPress={()=> {Alert.alert("All the grading screen should be shown.")}} style={{lineHeight: theme.textH2.lineHeight}}/>}
              </View>
              { scormResultData && scormResultData.scorm && <GradeDetails scorm={scormResultData.scorm} limit={6} /> }
              <View style={styles.sectionField} >
                <Text style={theme.textB1}>{translate("scorm.summary.grade.method")}</Text>
                {/* TODO */}
                <Text style={[theme.textB1, {color: theme.textColorSubdued}]}>{ scormResultData  && scormResultData.scorm && scormResultData.scorm.attemptsCurrent ? scormResultData!.scorm.attemptsCurrent.toString() : "0"}</Text>
              </View>
              <Text style={[theme.textH2, styles.sectionBreak]}>{translate("scorm.summary.attempt.title")}</Text>
              <View style={styles.sectionField} >
                <Text style={theme.textB1}>{translate("scorm.summary.attempt.total_attempts")}</Text>
                <Text style={[theme.textB1, {color: theme.textColorSubdued}]}>{ scormResultData  && scormResultData.scorm && scormResultData.scorm.attemptsMax ? scormResultData.scorm.attemptsMax.toString() : "Unlimited"}</Text>
              </View>
              <View style={styles.sectionField} >
                <Text style={theme.textB1}>{translate("scorm.summary.attempt.completed_attempts")}</Text>
                <Text style={[theme.textB1, {color: theme.textColorSubdued}]}>{ totalAttempt}</Text>
              </View>
            </View>
          </ScrollView>
        </View>
        {shouldShowAction && <AttemptController isOnline={isUserOnline} maxAttempt={scormResultData.scorm.attemptsMax} currentAttempt={scormResultData.scorm.attemptsCurrent} offlineLastAttempt={scormResultData.offlineActivity && scormResultData.offlineActivity.last.attempt} offlineStartedAttempt={scormResultData.offlineActivity && scormResultData.offlineActivity.start.attempt} actionPrimary={onStartAttemptTap} actionSecondary={onContinueAttemptTap} /> }
      </View>
    );
  };

  return (
    <View style={styles.expanded}>
      { scormAction.mode === SCORMType.None && <MainContent /> }
      { scormAction.mode === SCORMType.Online && <AuthenticatedWebView uri={scormAction.url!} /> }
      {/* {scormAction.mode === SCORMType.Online && (<OnlineScormActivity activity={activity} />)} */ }
      { scormAction.mode === SCORMType.Offline && <OfflineScormActivity storedPackageData={scormResultData!} attempt={scormAction.attempt!} scoid={scormAction.scoId} /> }
    </View>
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
  isOnline: boolean,
  maxAttempt: number | null,
  currentAttempt: number | null,
  offlineStartedAttempt?: number,
  offlineLastAttempt?: number,
  actionPrimary: ()=>void,
  actionSecondary: ()=>void
};

const AttemptController = (attempt: PropsAttempt) => {

  const [isEnabledNewAttempt, setIsEnabledNewAttempt] = useState(false);
  const [isEnabledLastAttempt, setIsEnabledLastAttempt] = useState(false);
 
  useEffect(()=> {
      const isCompletedAllAttempt = attempt.maxAttempt && attempt.currentAttempt && attempt.currentAttempt >= attempt.maxAttempt;
      if (attempt.isOnline) {
        setIsEnabledNewAttempt(!isCompletedAllAttempt);
        // TODO check offline attempt count for Continue last attempt
        setIsEnabledLastAttempt(attempt.currentAttempt !== null && attempt.currentAttempt > 0);
      } else {
        const isCompletedOfflineAttempt = (attempt.maxAttempt && attempt.offlineLastAttempt !== undefined && attempt.offlineLastAttempt >= attempt.maxAttempt)
        setIsEnabledNewAttempt(!(isCompletedAllAttempt || isCompletedOfflineAttempt));
        // TODO check offline attempt count for Continue last attempt
        // setIsEnabledLastAttempt(attempt.offlineStartedAttempt !== undefined && attempt.offlineLastAttempt !== undefined && (attempt.offlineStartedAttempt > 0) && (attempt.offlineLastAttempt >= attempt.offlineStartedAttempt));
      }
    
  }, [attempt]);

  return (
    <View style={stylesAction.attemptContainer}>
      <View style={{flexDirection: "row", justifyContent: "space-between" }}>
        { isEnabledNewAttempt && isEnabledLastAttempt && <SecondaryButton text={translate("scorm.summary.last_attempt")} mode={!isEnabledLastAttempt ? "disabled" : undefined} onPress={attempt.actionSecondary} style={{flex: 1}} /> }
        { !isEnabledNewAttempt && isEnabledLastAttempt && <PrimaryButton text={translate("scorm.summary.last_attempt")} mode={!isEnabledLastAttempt ? "disabled" : undefined} onPress={attempt.actionSecondary} style={{flex: 1}}/> }
        { isEnabledNewAttempt && isEnabledLastAttempt && <View style={{ width: 16 }}></View> }
        { isEnabledNewAttempt && <PrimaryButton text={translate("scorm.summary.new_attempt")} mode={!isEnabledNewAttempt ? "disabled" : undefined} onPress={attempt.actionPrimary} style={{flex: 1}} /> }
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

export default SCORMActivityAPI;


