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
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useQuery } from "@apollo/react-hooks";
import { faCloudDownloadAlt } from "@fortawesome/free-solid-svg-icons";
import { useNetInfo } from "@react-native-community/netinfo"; //TO continue

import { Activity } from "@totara/types";
import { AuthContext } from "@totara/core";
import { scormQuery } from "@totara/activities/scorm/api";
import { OfflineScormPackage, Scorm } from "@totara/types/Scorm";
import { PrimaryButton, ProgressCircle, SecondaryButton, TertiaryButton, TouchableIcon, MoreText, ContentIcon } from "@totara/components"
import { gutter, ThemeContext } from "@totara/theme";
import { AttemptSynchronizer, OfflineScormActivity, downloadSCORMPackage, getSCORMData, setSCORMPackageData, getUnsyncedData } from "./offline";
import GradeDetails from "./GradeDetails";
import OnlineScormActivity from "./online/OnlineScormActivity";
import { Log } from "@totara/lib";

const SCORMActivityAPI = (props: {activity: Activity}) => {
  const { loading, error, data } = useQuery(scormQuery, {
    variables: { scormid: props.activity.instanceid },
  });
  if (loading) { return <Text>Loading...</Text>; }
  if (error) { return <Text>Something went wrong, please try again later.</Text>; }
  if (data) {
    return <SCORMActivity activity={props.activity} scorm={data ? data.scorm : null} />;
  } else { return <Text>Something went wrong, please try again later.</Text>; }
};

type SCORMActivityProps = {
  activity: Activity,
  scorm: Scorm,
};

type SCORMAction = {
  mode: SCORMType,
  attempt?: number,
  scoId?: string
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

  // const [netInfo, setNetInfo] = useState<boolean>(false);
  const [isUserOnline, setIsUserOnline] = useState<boolean>(false);//TODO: need to set default true
  const [mustDownloadContent, setMustDownloadContent] = useState<boolean>(false);
  const [scormResultData, setScormResultData] = useState<OfflineScormPackage>();
  const netInfo = useNetInfo();

  useEffect(()=> {
    if (netInfo.type !== "unknown" && (netInfo.isInternetReachable !== undefined && netInfo.isInternetReachable !== null)) {
      // setIsUserOnline(netInfo.isInternetReachable); //TODO - need to enable
    }
  }, [netInfo]);

  useEffect(() => {
      console.log("isUserOnline: ", isUserOnline);
      if (isUserOnline) {
        setScormResultData({scorm: scorm});
      } else {
        getSCORMData(activity.instanceid).then(result => {
          let apiSyncedData: OfflineScormPackage = {scorm: scorm}; //TODO have to reset
          if (result) {
            if (result.offlineActivity) {
              apiSyncedData.offlineActivity = result.offlineActivity;
            }
            if (result.package) {
              apiSyncedData.package = result.package;
            }
          }
          setScormResultData(apiSyncedData);
        });
      }
  }, [scorm, isUserOnline]);


  useEffect(() => {
    if (scormResultData && scormResultData.scorm) {
      setSCORMPackageData(activity.instanceid, scormResultData);
    }
  }, [scormResultData, isUserOnline]);

  //DOWNLOAD CONTENT - BEGIN
  const onDownloadContentTap = () => {
    setMustDownloadContent(true);
  };

  useEffect(() => {
    if (!mustDownloadContent) return;

    const _url = scorm.packageUrl!;
    const _scormId = scorm.id;
    const _courseId = scorm.courseid;
    downloadSCORMPackage(apiKey!, _courseId, _scormId, _url).then(
      packagePath => {
        const _offlineScormData = {
          scorm: scorm,
          package: {
            path: packagePath
          }
        } as OfflineScormPackage;
        setScormResultData(_offlineScormData);
      }
    );
  }, [mustDownloadContent]);
  //DOWNLOAD CONTENT - END

  //START NEW ATTEMPT
  const onStartAttemptTap = () => {
    if(scormResultData) {
      if (!isUserOnline) {
        const offlineLastAttempt = scormResultData.offlineActivity && scormResultData.offlineActivity.last.attempt ? scormResultData.offlineActivity.last.attempt : 0;
        const newOfflineAttempt = !scormResultData.scorm.attemptsCurrent || scormResultData.scorm.attemptsCurrent < offlineLastAttempt ? offlineLastAttempt + 1 : scormResultData.scorm.attemptsCurrent + 1;
        setScormAction({mode: SCORMType.Offline, attempt: newOfflineAttempt})
      } else {
        setScormAction({mode: SCORMType.Online});
      }
    }
  };

  //START Continue ATTEMPT
  const onContinueAttemptTap = () => {
    if(scormResultData) {
      if (!isUserOnline) {
        if (scormResultData.offlineActivity && scormResultData.offlineActivity.last.attempt) {
          setScormAction({mode: SCORMType.Offline, attempt: scormResultData.offlineActivity.last.attempt})
        } else {
          Log.debug("No pending offline attempt to complete"); //TODO handle this
        }
      } else {
        setScormAction({mode: SCORMType.Online});
      }
    }
  };

  const MainContent = () => {
    const [theme] = useContext(ThemeContext);

    const hasFileDownloaded = scormResultData && scormResultData.package && (scormResultData.package.path !== undefined || scormResultData.package.path !== "") ? true : false;
    const downloadingFile = mustDownloadContent && !hasFileDownloaded;
    let totalAttempt = scormResultData && scormResultData.scorm && scormResultData.scorm.attemptsCurrent ? scormResultData.scorm.attemptsCurrent : 0;
    if (!isUserOnline && scormResultData && scormResultData.offlineActivity && scormResultData.offlineActivity.last.attempt) {
      totalAttempt = scormResultData.offlineActivity.last.attempt;
    }
    return (
      <View style={styles.expanded}>
        <View style={{flex: 1}}>
          <ScrollView >
            <View style={{ padding: gutter }}>
              <View style={[styles.sectionBreak, {marginTop: 0}]}>
                { scormResultData && scormResultData.scorm && scormResultData.scorm.description !== undefined && scormResultData.scorm.description !== null && <Text style={[theme.textH2, {alignSelf: "center", flex: 1}]}>Summary</Text> }
                { downloadingFile ? 
                  <ProgressCircle indeterminate size={25} /> : 
                  <TouchableIcon size={25} icon={faCloudDownloadAlt} disabled={hasFileDownloaded!} onPress={()=> {onDownloadContentTap()}} /> 
                }
              </View>
              { scormResultData && scormResultData.scorm && scormResultData.scorm.description !== undefined && scormResultData.scorm.description !== null && <MoreText longText={scormResultData.scorm.description} /> }
              
              <View style={styles.sectionBreak}>
                <Text style={[theme.textH2, {alignSelf: "center", flex: 1}]}>Grade details</Text>
                {totalAttempt > 6 && <TertiaryButton text={"View all"} />}
              </View>
              { scormResultData && totalAttempt > 0 && <GradeDetails scorm={scormResultData.scorm} /> }
              <View style={styles.sectionField} >
                <Text style={theme.textB1}>Grading method</Text>
                {/* TODO */}
                <Text style={[theme.textB1, {color: theme.textColorSubdued}]}>{ scormResultData  && scormResultData.scorm && scormResultData.scorm.attemptsCurrent ? scormResultData!.scorm.attemptsCurrent.toString() : "0"}</Text>
              </View>
              <View style={styles.sectionField} >
                <Text style={theme.textB1}>Grading reported</Text>
                {/* TODO */}
                <Text style={[theme.textB1, {color: theme.textColorSubdued}]}>{ scormResultData  && scormResultData.scorm && scormResultData.scorm.calculatedGrade ? scormResultData.scorm.calculatedGrade : "0"}</Text>
              </View>
              
              <Text style={[theme.textH2, styles.sectionBreak]}>Attempt details</Text>
              <View style={styles.sectionField} >
                <Text style={theme.textB1}>Total attempts allowed</Text>
                <Text style={[theme.textB1, {color: theme.textColorSubdued}]}>{ scormResultData  && scormResultData.scorm && scormResultData.scorm.attemptsMax ? scormResultData.scorm.attemptsMax.toString() : "Unlimited"}</Text>
              </View>
              <View style={styles.sectionField} >
                <Text style={theme.textB1}>Total attempts done</Text>
                <Text style={[theme.textB1, {color: theme.textColorSubdued}]}>{ totalAttempt}</Text>
              </View>
            </View>
          </ScrollView>
        </View>
        {(scormResultData && scormResultData.scorm && (isUserOnline || (scormResultData.scorm.offlineAttemptsAllowed && scormResultData.package && scormResultData.package.path)) && 
          <AttemptController isOnline={isUserOnline} maxAttempt={scormResultData.scorm.attemptsMax} currentAttempt={scormResultData.scorm.attemptsCurrent} offlineLastAttempt={scormResultData.offlineActivity && scormResultData.offlineActivity.last.attempt} offlineStartedAttempt={scormResultData.offlineActivity && scormResultData.offlineActivity.start.attempt} actionPrimary={onStartAttemptTap} actionSecondary={onContinueAttemptTap} />
        )}
        <AttemptSynchronizer />
      </View>
    );
  };

  return (
    <View style={styles.expanded}>
      {scormAction.mode === SCORMType.None && <MainContent />}
      {scormAction.mode === SCORMType.Online && (<OnlineScormActivity activity={activity} />)}
      {scormAction.mode === SCORMType.Offline && (<OfflineScormActivity storedPackageData={scormResultData!} attempt={scormAction.attempt!} scoid={scormAction.scoId} />)}
    </View>
  );
};

const styles = StyleSheet.create({
  expanded: {
    flex: 1,
    flexDirection: "column"
  },
  sectionBreak: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between" 
  },
  sectionField: {
    flexDirection: "row",
    justifyContent: "space-between"
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

  const [theme] = useContext(ThemeContext);

  const [isEnabledNewAttempt, setIsEnabledNewAttempt] = useState<boolean>(false);
  const [isEnabledLastAttempt, setIsEnabledLastAttempt] = useState<boolean>(false);
 
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
        setIsEnabledLastAttempt(attempt.offlineStartedAttempt !== undefined && attempt.offlineLastAttempt !== undefined && (attempt.offlineStartedAttempt > 0) && (attempt.offlineLastAttempt >= attempt.offlineStartedAttempt));
      }
    
  }, [attempt]);

  return (
    <View style={stylesAction.attemptContainer}>
      <View style={{flexDirection: "row", alignContent: "flex-start", paddingBottom: 8 }}>
        <View style={{paddingRight: 8}}>
          <ContentIcon icon={"check"} iconSize={15} size={30} backgroundColor={theme.colorSuccess} iconColor={theme.colorAccent} borderColor={theme.colorSuccess} isDashedCircle={false} />
        </View>
        <View style={{flexDirection: "column", flex: 1}}>
          <Text style={theme.textB1}>Mark as completed.</Text>
          <Text style={theme.textSmall}>Manually mark this activity as completed when you finish learning</Text>
        </View>
      </View>
      <View style={{flexDirection: "row", justifyContent: "space-between",  alignItems: "stretch"}}>
        <SecondaryButton text={"Start new attempt"} mode={!isEnabledNewAttempt ? "disabled" : undefined} onPress={attempt.actionPrimary} />
        <PrimaryButton text={"Continue last attempt"} mode={!isEnabledLastAttempt ? "disabled" : undefined} onPress={attempt.actionSecondary} />
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


