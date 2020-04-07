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

import { getOfflineSCORMCommits, clearSyncedSCORMCommit } from "./OfflineSCORMController";
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

type SyncData = {
  scormId: number,
  attempt: number,
  tracks: [any]
}

const AttemptSynchronizer = () => {
  const [unSyncData, setUnsyncData] = useState<[any] | undefined>(undefined);
  const [syncData, setSyncData] = useState<SyncData | undefined>(undefined);
  const [saveAttempt] = useMutation(SaveAttemptMutation);
  const netInfo = useNetInfo();
  
  useEffect(()=> {
    if (netInfo.type !== "unknown" && (netInfo.isInternetReachable !== undefined && netInfo.isInternetReachable !== null && netInfo.isInternetReachable)) {
      if (!unSyncData) {
        getOfflineSCORMCommits().then(data => {
          if (data && Object.keys(data).length > 0) {
            setUnsyncData(data as [any]);
          } 
        });
      } else {              
        if(Object.keys(unSyncData).length === 0 && unSyncData.constructor === Object) {
          setUnsyncData(undefined);
        } else {
          const syncScormId = parseInt(Object.keys(unSyncData)[0]);
          const pendingAttempts = unSyncData[syncScormId];
          if(Object.keys(pendingAttempts).length === 0 && pendingAttempts.constructor === Object) {
            let newUnsyncData = unSyncData;
            delete newUnsyncData[syncScormId];
            setUnsyncData(newUnsyncData);
          } else {
            const syncAttempt = parseInt(Object.keys(pendingAttempts)[0]);
            const syncTracks = pendingAttempts[syncAttempt];
            const syncingData = {scormId: syncScormId, attempt: syncAttempt, tracks: syncTracks};
            setSyncData(syncingData);
          }
        }
      }
    }
  }, [unSyncData, netInfo]);

  useEffect(()=> {
    if(syncData && syncData.scormId && syncData.attempt && syncData.tracks) {
      let unsavedAttemptTracks: any = [];
      for (let scoId in syncData.tracks) {
        if(syncData.tracks[scoId] && syncData.tracks[scoId] ) {
          unsavedAttemptTracks = unsavedAttemptTracks.concat(syncData.tracks[scoId]);
        }
      }
      syncAttemptForScorm(syncData.scormId, unsavedAttemptTracks)
        .then(isSynced => {
          if (isSynced) {
            return clearSyncedSCORMCommit(syncData.scormId, syncData.attempt);
          } else {
            throw new Error("Data sync failed.");
          }
        })
        .then(() => getUpdatedUnsyncData(syncData.scormId, syncData.attempt, unSyncData))
        .then(updatedUnsyncData => {
          setUnsyncData(updatedUnsyncData);
        }).catch(e=> {
          Log.error("Data sync error: ", e);
        });
    }
  }, [syncData]);

  const syncAttemptForScorm = (scormId: number, tracks: [any]) => {
    return saveAttempt({
      variables: {
        scormid: scormId,
        attempts: tracks
      }
    }).then(value => {
      //TODO - need to test
      /*
      let isSaveSuccess = true;
      for(let result in value) {
        if(!result) {
          return false;
        }
      }
      */
      return true;
    });
  }
  const getUpdatedUnsyncData = (scormId: number, attempt: number, unsyncdata: any) => {
    let newUnsyncData = unsyncdata;
    if (newUnsyncData) {
      delete newUnsyncData[scormId][attempt];
      if(Object.keys(newUnsyncData[scormId]).length === 0 && newUnsyncData[scormId].constructor === Object) {
        delete newUnsyncData[scormId];
      }
      if(Object.keys(newUnsyncData).length === 0 && newUnsyncData.constructor === Object) {
        newUnsyncData = undefined;
      }
    }
    return newUnsyncData;
  }
 
  return null; 
 
};

export default AttemptSynchronizer;