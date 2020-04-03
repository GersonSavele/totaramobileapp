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

import { useEffect, useState } from "react";
import { gql } from "apollo-boost";
import { useMutation } from '@apollo/react-hooks';
import { useNetInfo } from "@react-native-community/netinfo";

import { getUnsyncedData, getSCORMLastActivity, setSyncedScormActivity } from "./StorageHelper";
import { Log } from "@totara/lib";

const SaveAttemptMutation = gql`
  mutation mod_scorm_save_offline_attempts(
    $scormid: core_id!
    $attempts: [mod_scorm_attempt!]!
  ) {
    attempts: mod_scorm_save_offline_attempts(
      scormid: $scormid
      attempts: $attempts
    )
  }
`;

const AttemptSynchronizer = () => {
  const [unSyncData, setUnsyncData] = useState<[any]>();
  const [syncData, setSyncData] = useState();
  const [saveAttempt] = useMutation(SaveAttemptMutation);
  const netInfo = useNetInfo();
  
  useEffect(()=> {
    
    if (netInfo.type !== "unknown" && (netInfo.isInternetReachable !== undefined && netInfo.isInternetReachable !== null && netInfo.isInternetReachable)) {
      if (!unSyncData) {
        getUnsyncedData().then(data => {
          if (data && data.length > 0) {
            setUnsyncData(data as [any]);
          } 
        });
      } else {
        if (unSyncData && unSyncData!.length > 0) {
          const syncIndex = {index: 0};
          const unsyncScormData = unSyncData[syncIndex.index];
          getSCORMLastActivity(unsyncScormData.scormid).then(storedLastActivityData => {
            if (storedLastActivityData) {
              setSyncData({...unsyncScormData, ...storedLastActivityData, ...syncIndex});
            }
          })
        }
        
      }
    }
    
  }, [unSyncData, netInfo]);

  useEffect(()=> {
    if(syncData && syncData !== undefined) {
      const tmpSyncScormId = syncData!.scormid;
      const tmpSyncStartAttempt = syncData!.start? syncData!.start!.attempt : 0;
      const tmpSyncAttemptScos= syncData!.attempts[tmpSyncStartAttempt];

      let unsavedAttemptTracks: any = [];
      for (let scoId in tmpSyncAttemptScos) {
        if(tmpSyncAttemptScos[scoId] && tmpSyncAttemptScos[scoId] ) {
          unsavedAttemptTracks = unsavedAttemptTracks.concat(tmpSyncAttemptScos[scoId]);
        }
      }

      saveAttempt({
        variables: {
          scormid: tmpSyncScormId,
          attempts: unsavedAttemptTracks
        }
      }).then(value => {
        let isSaveSuccess = true;
        for(let result in value) {
          if(!result) {
            isSaveSuccess = false;
            break;
          }
        }
        if(isSaveSuccess) {
          setSyncedScormActivity(tmpSyncScormId, tmpSyncStartAttempt).then(() => {
            let tmpUnSyncData = unSyncData;
            delete tmpUnSyncData[syncData.index].attempts[syncData.start.attempt];
            if (!(tmpUnSyncData[syncData.index].attempts && tmpUnSyncData[syncData.index].attempts.length > 0)) {
              delete tmpUnSyncData[syncData.index]
            }
            if(!(tmpUnSyncData && tmpUnSyncData.length > 0)) {
              tmpUnSyncData = undefined;
            }
            setUnsyncData(tmpUnSyncData);
          });
        } else {
          setSyncData(undefined);
          throw new Error("Data sync failed.")
        }
      }).catch(e => {
        Log.debug("Data synchronizing failed. ", e);
      })
    }
    
  }, [syncData]);
 
  return null; 
 
};

export default AttemptSynchronizer;