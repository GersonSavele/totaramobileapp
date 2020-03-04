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

import React, {  useState } from "react";
import { ScormActivity } from "@totara/types";
import OnlineScormActivity from "@totara/activities/scorm/online/OnlineScormActivity";
import OfflineScormActivity from "@totara/activities/scorm/offline/OfflineScormActivity";
import { Text, View } from "react-native"
import { downloadSCORMPackage, unzipSCORMPackageToServer } from "./offline/SCORMFileHandler";

const ScormActivityView = (props: Props) => {
  const offlineAttemptsAllowed = props.activity.offlineAttemptsAllowed; //TODO: CHANGE BACK TO offlineAttemptsAllowed







  //TEMPORARY CODE DUE WE DONT HAVE DOWNLOAD TAB YET - begin
  const [offlineApiResponse, setOfflineApiResponse] = useState<any>();
  const [downloadClomplete, setDownloadClomplete] = useState<boolean>(false);
  const [unZipPath, setUnZipPath] = useState<string>();


  if(offlineAttemptsAllowed){
    if(!offlineApiResponse){

      const _example = {
        scorm: {
          "id": "13",
          "courseid": "2",
          "name": "13-Complex SCORM",
          "description": "13-Complex SCORM [1]\n\n\n\nLinks:\n------\n[1] http://10.0.8.139/mod/scorm/view.php?id=19\n",
          "type": "local",
          "packageUrl": "http://10.0.8.139/totara/mobile/pluginfile.php/110/mod_scorm/package/0/complexscorm.zip?forcedownload=1",
          "attemptsMax": 6,
          "attemptsCurrent": 1,
          "attemptsForceNew": false,
          "attemptsLockFinal": false,
          "autoContinue": false,
          "launchUrl": "http://10.0.8.139/mod/scorm/view.php?id=24",
          "calculatedGrade": "0%",
          "offlineAttemptsAllowed": true,
          "offlinePackageUrl": "http://10.0.8.139/totara/mobile/pluginfile.php/110/mod_scorm/package/1/complexscorm.zip",
          "offlinePackageContentHash": "bfe94df9e9f98a424be4544d2d3fc59e921beff4",
          "offlinePackageScoIdentifiers": [
            "mm-ITEM-SCORMDEbugger555f231e21b982c25s01",
            "mm-ITEM-SCORMDEbugger555f231e21b982c25s02",
            "mm-ITEM-SCORMDEbugger555f231e21b982c25s04",
            "mm-ITEM-SCORMDEbugger555f231e21b982c25s05",
            "mm-ITEM-SCORMDEbugger555f231e21b982c25s06",
            "mm-ITEM-SCORMDEbugger555f231e21b982c25s07",
            "mm-ITEM-SCORMDEbugger555f231e21b982c25s08"
          ]
        }
      }

      setOfflineApiResponse(_example);
      return <View><Text>loading...</Text></View>
    }


    if(!downloadClomplete){
      const _scormActivity = offlineApiResponse!.scorm;
      const _url = _scormActivity.offlinePackageUrl;
      const _courseId = _scormActivity.courseid.toString();
      const _scormId = _scormActivity.id.toString();

      downloadSCORMPackage(_courseId, _scormId, _url).then(()=>{
        setDownloadClomplete(true);
      });
      return <View><Text>downloading zip...</Text></View>
    }

    if(!unZipPath){
      const _scormActivity = offlineApiResponse!.scorm;
      const _courseId = _scormActivity.courseid.toString();
      const _scormId = _scormActivity.id.toString();

      unzipSCORMPackageToServer(_courseId, _scormId).then((_unzipPath: string)=>{
        console.log("unzip path: ", _unzipPath);
        setUnZipPath(_unzipPath);
      });
      return <View><Text>unziping...</Text></View>
    }


    //IF unZipPath EXISTS, CONTINUE TO OfflineScormActivity
    if(unZipPath){
      return <OfflineScormActivity activity={props.activity} />
    }
    else{
      return <View><Text>loading...</Text></View>
    }
  }
  //TEMPORARY CODE DUE WE DONT HAVE DOWNLOAD TAB YET - end







  //REAL CODE
  if(offlineAttemptsAllowed){
    return <OfflineScormActivity activity={props.activity} />
  }

  return <OnlineScormActivity activity={props.activity} />;
}

type Props = {
  activity: ScormActivity
}

export default ScormActivityView;
