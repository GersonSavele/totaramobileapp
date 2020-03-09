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
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useQuery } from "@apollo/react-hooks";

import { scormQuery } from "@totara/activities/scorm/api";
import { downloadSCORMPackage } from "@totara/activities/scorm/offline/SCORMFileHandler";
import { getSCORMPackageData, setSCORMPackageData } from "@totara/activities/scorm/offline/StorageHelper";
import { AuthContext } from "@totara/core";
import { OfflineScormPackage, Scorm } from "@totara/types/Scorm";
import { Activity } from "@totara/types";
import OnlineScormActivity from "@totara/activities/scorm/online/OnlineScormActivity";
import OfflineScormActivity from "@totara/activities/scorm/offline/OfflineScormActivity";
import { PrimaryButton, SecondaryButton, TouchableIcon } from "@totara/components"
import { faCloudDownloadAlt } from "@fortawesome/free-solid-svg-icons";
import { ThemeContext } from "@totara/theme";

const SCORMActivityAPI = (props: {activity: Activity, scormId: string}) => {
  console.log(props);

  const { loading, error, data } = useQuery(scormQuery, {
    variables: { scormid: props.scormId },
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

  const scorm = props.scorm;
  const [mustDownloadContent, setMustDownloadContent] = useState<boolean>(false);
  const [scormOfflineData, setScormOfflineData] = useState<OfflineScormPackage>();
  const [userIsOnline] = useState<boolean>(true);

  //DOWNLOAD CONTENT - BEGIN
  const onDownloadContentTap = () => {
    setMustDownloadContent(true);
  }

  useEffect(()=>{
    if(!mustDownloadContent)
      return;



    console.log('onDownloadContentTap');
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
      setScormOfflineData(_offlineScormData);
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
      getSCORMPackageData(props.scorm.id).then(scormdata => {
        if(scormdata) {
          setScormOfflineData(scormdata);
          setSCORMType(SCORMType.Offline);
        }else {
          console.log("Cannot find data");
        }
      })
    } else {
      setSCORMType(SCORMType.Online);
    }
  }
  //START NEW ATTEMPT

  const MainContent = () =>{
    const [ theme ] = useContext(ThemeContext);

    console.log(scormOfflineData);

    const hasFileDownloaded = scormOfflineData && scormOfflineData.offlinePackageData.packageLocation!==undefined;
    const downloadingFile = mustDownloadContent && !hasFileDownloaded;

    return (
        <View style={styles.expanded}>
          <View style={{flex: 1, flexDirection:"row"}}>
            <View style={{flex: 1, padding: 15}}>
              <Text style={[theme.textH3]}>Summary</Text>
            </View>
            <View style={{flex: 1, alignItems:'flex-end'}}>
              {downloadingFile && <ActivityIndicator />}
              {!downloadingFile && <TouchableIcon size={25} icon={faCloudDownloadAlt} disabled={hasFileDownloaded!} onPress={onDownloadContentTap} />}
            </View>
          </View>

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
    {scormType === SCORMType.Online && <OnlineScormActivity activity={props.activity} />}
    {scormType === SCORMType.Offline &&  <OfflineScormActivity storedPackageData={scormOfflineData!} />}
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


