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
import { useMutation, useApolloClient } from "@apollo/react-hooks";
import { useNetInfo } from "@react-native-community/netinfo";

import { showMessage, Log } from "@totara/lib";
import { translate } from "@totara/locale";
import {
  getOfflineScormCommits,
  setCleanScormCommit,
  retrieveAllData,
  saveInTheCache
} from "./storageUtils";
import { mutationAttempts } from "./api";

type SyncData = {
  scormId: string;
  attempt: number;
  tracks: [any];
};

type NetInfoEffectProps = {
  type?: string;
  isInternetReachable?: boolean | null;
  unSyncData?: [SyncData];
  client: any;
  saveAttempt: Function;
  setUnsyncData: Function;
};

type SyncScormAttemptProps = {
  syncData: SyncData;
  client: any;
  unSyncData: [SyncData];
  saveAttempt: Function;
};

type PropsSyncSeverScormAttempt = {
  scormId: string;
  tracks: [any];
  saveAttempt: Function;
};

const syncScormAttempt = ({
  syncData,
  unSyncData,
  client,
  saveAttempt
}: SyncScormAttemptProps) =>
  syncServerWithScormAttempt({ ...syncData, saveAttempt })
    .then((isSynced) => {
      if (isSynced) {
        const scormBundles = retrieveAllData({ client });
        const newData = setCleanScormCommit({
          scormBundles,
          scormId: syncData.scormId,
          attempt: syncData.attempt
        });
        return saveInTheCache({ client, scormBundles: newData });
      } else {
        throw new Error("Data sync failed.");
      }
    })
    .then(() => {
      let newUnsyncData = [...unSyncData];
      if (newUnsyncData) {
        newUnsyncData.shift();
      }
      return newUnsyncData;
    });

const syncServerWithScormAttempt = ({
  scormId,
  tracks,
  saveAttempt
}: PropsSyncSeverScormAttempt) =>
  saveAttempt({
    variables: {
      scormid: scormId,
      attempts: tracks
    }
  }).then((value) => {
    if (value) {
      for (let result in value) {
        if (!result) {
          return false;
        }
      }
      return true;
    } else {
      return false;
    }
  });

const netInfoEffect = ({
  type,
  isInternetReachable,
  unSyncData,
  client,
  saveAttempt,
  setUnsyncData
}: NetInfoEffectProps) => () => {
  if (type && type !== "unknown" && isInternetReachable) {
    if (unSyncData && unSyncData.length && unSyncData.length > 0) {
      // Send the attempt through the API and remove the attempt from the cache
      syncScormAttempt({
        syncData: unSyncData[0],
        client,
        unSyncData,
        saveAttempt
      })
        .then((updatedUnsyncData) => {
          // remove the same attempt from the react state
          setUnsyncData(updatedUnsyncData);
        })
        .catch((e) => {
          showMessage({ text: `${translate("general.error_unknown")}` });
          Log.warn(e);
        });
    } else {
      const syncDataSet = getOfflineScormCommits({ client });
      // update the attempt from the react state
      setUnsyncData(syncDataSet as [SyncData]);
    }
  }
};

const AttemptSynchronizer = () => {
  const [unSyncData, setUnsyncData] = useState<[SyncData]>();

  const [saveAttempt] = useMutation(mutationAttempts);
  const netInfo = useNetInfo();
  const client = useApolloClient();

  const { type, isInternetReachable } = netInfo;
  useEffect(
    netInfoEffect({
      type,
      isInternetReachable,
      unSyncData,
      client,
      saveAttempt,
      setUnsyncData
    }),
    [unSyncData, netInfo]
  );

  return null;
};

export default AttemptSynchronizer;
