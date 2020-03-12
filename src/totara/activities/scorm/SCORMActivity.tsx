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
import { scormQuery } from "@totara/activities/scorm/api";
import { downloadSCORMPackage } from "@totara/activities/scorm/offline/SCORMFileHandler";
import { getSCORMPackageData, setSCORMPackageData } from "@totara/activities/scorm/offline/StorageHelper";
import { AuthContext } from "@totara/core";
import { OfflineScormPackage, Scorm } from "@totara/types/Scorm";
import { Activity } from "@totara/types";
import { PrimaryButton, ProgressCircle, SecondaryButton, TertiaryButton, TouchableIcon, MoreText } from "@totara/components"
import { faCloudDownloadAlt } from "@fortawesome/free-solid-svg-icons";
import { gutter, ThemeContext } from "@totara/theme";
import OnlineScormActivity from "@totara/activities/scorm/online/OnlineScormActivity";
import OfflineScormActivity from "@totara/activities/scorm/offline/OfflineScormActivity";

const SCORMActivityAPI = (props: {activity: Activity}) => {
  const { loading, error, data } = useQuery(scormQuery, {
    variables: { scormid: props.activity.instanceid },
  });
  if (loading) return <Text>loading...</Text>;
  if (error) return <Text>error, go back</Text>;

  return <SCORMActivity activity={props.activity} scorm={data.scorm} />;
};

type SCORMActivityProps = {
  activity: Activity,
  scorm: Scorm,
}

enum SCORMType {
  None,
  Offline,
  Online
}

const SCORMActivity = (props: SCORMActivityProps) => {
  const { authContextState: {appState} } = useContext(AuthContext);
  const apiKey = appState && appState.apiKey ? appState.apiKey : null;

  const [scormType, setSCORMType] = useState<SCORMType>(SCORMType.None);
  const { scorm, activity } = props

  const [mustDownloadContent, setMustDownloadContent] = useState<boolean>(false);
  const [scormStoredData, setScormStoredData] = useState<OfflineScormPackage>();
  // const [userIsOnline] = useState<boolean>(true);

  //DOWNLOAD CONTENT - BEGIN
  const onDownloadContentTap = () => {
    setMustDownloadContent(true);
  }

  useEffect(()=>{
    if(!mustDownloadContent)
      return;



    const _url = scorm.packageUrl!;
    const _scormId = scorm.id;
    const _courseId = scorm.courseid;
    downloadSCORMPackage(apiKey!, _courseId, _scormId, _url).then(packagePath =>{
      const _offlineScormData = {
        scorm : scorm,
        offlinePackageData: {
          packageLocation: packagePath
        }
      } as OfflineScormPackage;
      setScormStoredData(_offlineScormData);
      return setSCORMPackageData(_scormId, _offlineScormData);
    });
  }, [mustDownloadContent]);
  //DOWNLOAD CONTENT - END



  //START NEW ATTEMPT
  const onStartAttemptTap = () => {
    //TODO: CHECK IS USER IS ONLINE
    //TODO: CHECK IS CONTENT IS DOWNLOADED

    const goOnline = false;

    if(!goOnline) {
      getSCORMPackageData(scorm.id).then(scormdata => {
        if (scormdata) {
          setScormStoredData(scormdata);
          setSCORMType(SCORMType.Offline);
        }
      })
    } else {
      setSCORMType(SCORMType.Online);
    }
  }
  //START NEW ATTEMPT



  const MainContent = () =>{
    const [ theme ] = useContext(ThemeContext);

    const hasFileDownloaded = scormStoredData && scormStoredData.offlinePackageData.packageLocation!==undefined;
    const downloadingFile = mustDownloadContent && !hasFileDownloaded;

    return (
          <View style={styles.expanded}>
            <ScrollView>
            <View style={{flexDirection:"column"}}>

              <View style={{padding: gutter}}>
                <View style={{flexDirection:"row", display: 'flex', justifyContent: 'space-between'}}>
                  <View>
                    <Text style={[theme.textH2]}>Summary</Text>
                  </View>
                  <View>
                    {downloadingFile && <View style={{marginTop: 20, marginRight: 20}}><ProgressCircle indeterminate size={25} /></View>}
                    {!downloadingFile && <TouchableIcon size={25} icon={faCloudDownloadAlt} disabled={hasFileDownloaded!} onPress={onDownloadContentTap} />}
                  </View>
                </View>
                <View style={{padding: 5}}>
                  <MoreText longText={scorm!.description}/>
                </View>
              </View>

              <View style={{flexDirection:"column", padding: gutter}}>
                <View style={{flexDirection:"row", paddingTop: 10, display: 'flex', justifyContent: 'space-between'}}>
                  <View>
                    <Text style={[theme.textH2]}>Grade details</Text>
                  </View>
                  <View>
                    <TertiaryButton text={"View all"}/>
                  </View>
                </View>

                <View style={{borderRadius: 5, backgroundColor: '#eee', height: 100  }}>

                </View>

                <View style={{flexDirection:"row", paddingTop: 10, display: 'flex', justifyContent: 'space-between'}}>
                  <Text>Grading method</Text>
                  <View>
                    <Text>{"Highest attempt"}</Text>
                  </View>
                </View>
                <View style={{flexDirection:"row", paddingTop: 10, display: 'flex', justifyContent: 'space-between'}}>
                  <Text>Grading reported</Text>
                  <Text>{"3"}</Text>
                </View>
              </View>




              <View style={{flexDirection:"column", padding: gutter}}>
                <View>
                  <Text style={[theme.textH2]}>Attempt details</Text>
                </View>
                <View style={{flexDirection:"row", paddingTop: 10, display: 'flex', justifyContent: 'space-between'}}>
                  <Text>Total attempts allowed</Text>
                  <Text>{scorm!.attemptsMax ? scorm!.attemptsMax.toString() : ""}</Text>
                </View>
                <View style={{flexDirection:"row", paddingTop: 10, display: 'flex', justifyContent: 'space-between'}}>
                  <Text>Total attempts done</Text>
                  <Text>{scormStoredData && scormStoredData!.scorm.attemptsCurrent ? scormStoredData!.scorm.attemptsCurrent.toString() : (scorm!.attemptsCurrent ? scorm!.attemptsCurrent.toString() : "")}</Text>
                </View>
              </View>

            </View>


        </ScrollView>
            <View style={styles.attemptContainer}>
              <View style={styles.attemptButtons}>
                <SecondaryButton text={"Start new attempt"} mode={!hasFileDownloaded ? "disabled": undefined} onPress={onStartAttemptTap}/>
                <PrimaryButton text={"Continue last attempt"} onPress={()=>{}} />
              </View>
            </View>
          </View>

    )
  }

  return <View style={styles.expanded}>
    {scormType === SCORMType.None && <MainContent />}
    {scormType === SCORMType.Online && <OnlineScormActivity activity={activity} />}
    {scormType === SCORMType.Offline &&  <OfflineScormActivity storedPackageData={scormStoredData!} />}
  </View>

};


const styles = StyleSheet.create({
  expanded: {
    flex: 1,
  },

  attemptContainer: {
    position: 'absolute',
    bottom: 5
  },
  attemptButtons:{
    backgroundColor: '#FAFAFA',
    width: '100%',
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    display: 'flex',
  }
})

export default SCORMActivityAPI;


