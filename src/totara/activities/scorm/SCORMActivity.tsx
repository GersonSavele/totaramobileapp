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
import OnlineScormActivity from "@totara/activities/scorm/online/OnlineScormActivity";
import OfflineScormActivity from "@totara/activities/scorm/offline/OfflineScormActivity";
import { Button, Text, View } from "react-native"
import { Activity, ScormActivity } from "@totara/types"
import { useQuery } from "@apollo/react-hooks";
import { scormQuery } from "@totara/activities/scorm/api"
import { downloadSCORMPackage } from "@totara/activities/scorm/offline/SCORMFileHandler"
import { DownloadResult } from "react-native-fs"
import { setSCORMPackageData } from "@totara/activities/scorm/offline/StorageHelper"
import { AuthContext } from "@totara/core"

const SCORMActivityAPI = (props: Activity) => {
  const { loading, error, data } = useQuery(scormQuery, {
    variables: { scormid: '13' }, //TODO: PUT THE CORRECT SCORMID FOR QUERY
  });
  if (loading) return <Text>loading...</Text>;
  if (error) return <Text>error, go back</Text>;

  return <SCORMActivity scormActivity={data.scorm} />;
};


type SCORMActivityProps = {
  scormActivity: ScormActivity,
}

const SCORMActivity = (props: SCORMActivityProps) => {
  const { authContextState: {appState} } = useContext(AuthContext);
  const apiKey = appState && appState.apiKey ? appState.apiKey : null;

  const scormActivity = props.scormActivity;
  const [scormAPIData, setScormAPIData] = useState<any>(scormActivity);
  const [downloadContentCompleted, setDownloadContentCompleted] = useState<boolean>(false);
  const [mustDownloadContent, setMustDownloadContent] = useState<boolean>(false);
  const [userIsOnline, setUserIsOnline] = useState<boolean>(true);

  const onStartAttemptTap = () => {
    //TODO: CHECK IS USER IS ONLINE
    //TODO: CHECK IS CONTENT IS DOWNLOADED
    if(scormActivity!.offlineAttemptsAllowed){
      return <OfflineScormActivity activity={scormActivity} />
    }
    return <OnlineScormActivity activity={scormActivity} />;
  }

  const onDownloadContentTap = () => {
    setMustDownloadContent(true);
  }

  useEffect(()=>{
    if(!mustDownloadContent)
      return;

    console.log('onDownloadContentTap');
    const _url = scormAPIData.packageUrl;
    const _scormId = scormAPIData.id;
    const _courseId = scormAPIData.courseid;

    downloadSCORMPackage(apiKey!, _courseId, _scormId, _url).then((response: DownloadResult)=>{
      if(response.statusCode == 200){
        console.log('download done');
        return setSCORMPackageData(_scormId, scormAPIData);
      }
      else {
        throw new Error('file not downloaded');
      }
    }).then(()=>{
      setDownloadContentCompleted(true);
    }).catch((error: any)=>{
      console.log(error);
      setDownloadContentCompleted(false);
    });
  }, [mustDownloadContent]);


  return <View>
    <Button disabled={!userIsOnline} title={"DOWNLOAD CONTENT"} onPress={onDownloadContentTap}></Button>

    <Button disabled={!userIsOnline && !downloadContentCompleted} title={"START NEW ATTEMPT"} onPress={onStartAttemptTap}></Button>
  </View>
};

export default SCORMActivityAPI;


