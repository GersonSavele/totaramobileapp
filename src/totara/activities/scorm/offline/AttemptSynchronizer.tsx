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
};

const AttemptSynchronizer = () => {
  const [unSyncData, setUnsyncData] = useState<[SyncData] | undefined>(undefined);
  const [saveAttempt] = useMutation(SaveAttemptMutation);
  const netInfo = useNetInfo();
  
  useEffect(()=> {
    if (netInfo.type !== "unknown" && (netInfo.isInternetReachable !== undefined && netInfo.isInternetReachable !== null && netInfo.isInternetReachable)) {
      if (unSyncData && unSyncData.length &&  unSyncData.length > 0) {
        syncScormRecord(unSyncData[0]).then(updatedUnsyncData => {
          if (updatedUnsyncData && updatedUnsyncData.length > 0) {
            setUnsyncData(updatedUnsyncData);
          } else {
            setUnsyncData(undefined);
          }
        }).catch(e=> {
          Log.error("Data sync error: ", e);
        });
      } else {
        getOfflineSCORMCommits().then(data => {
          if (data && data.length > 0) {
            const syncDataSet = data as [SyncData];
            setUnsyncData(syncDataSet);
          } 
        });
      }
    }
  }, [unSyncData, netInfo]);

  const syncScormRecord = (syncData: SyncData) => {
    return syncAttemptForScorm(syncData.scormId, syncData.tracks)
      .then(isSynced => {
        if (isSynced) {
          return clearSyncedSCORMCommit(syncData.scormId, syncData.attempt);
        } else {
          throw new Error("Data sync failed.");
        }
      })
      .then(() => {
        let newUnsyncData = unSyncData;
        if (newUnsyncData) {
          newUnsyncData.shift();
        }
        return newUnsyncData;
      });
  };

  const syncAttemptForScorm = (scormId: number, tracks: [any]) => {
    return saveAttempt({
      variables: {
        scormid: scormId,
        attempts: tracks
      }
    }).then(value => {
      if(value) {
        for(let result in value) {
          if(!result) {
            return false;
          }
        }
        return true;
      } else {
        return false
      }
    });
  };
 
  return null; 
 
};

export default AttemptSynchronizer;