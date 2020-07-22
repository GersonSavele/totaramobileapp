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

import React, { useEffect, useState, useRef } from "react";
import { Text, BackHandler } from "react-native";
// @ts-ignore //TODO: THERE'S NO TYPED FOR REACT-NATIVE-STATIC-SERVER https://github.com/futurepress/react-native-static-server/issues/67
import StaticServer from "react-native-static-server";

import OfflineScormPlayer from "@totara/activities/scorm/components/OfflineScormPlayer";
import { Package, Grade, Scorm } from "@totara/types/Scorm";
import { Log } from "@totara/lib";
import { translate } from "@totara/locale";
import { useApolloClient } from "@apollo/react-hooks";
import { get } from "lodash";

import {
  setScormActivityData,
  getScormAttemptData,
  retrieveAllData,
  saveInTheCache
} from "../storageUtils";
import { useSelector } from "react-redux";
import { RootState } from "@totara/reducers";
import { ResourceType } from "@totara/types/Resource";
import { NavigationStackProp } from "react-navigation-stack";
import {
  getOfflineScormPackageName,
  getScormPlayerInitialData,
  scormDataIntoJsInitCode,
  setupOfflineScormPlayer,
  loadScormPackageData
} from "../utils";
import { scormLessonStatus } from "@totara/lib/constants";

type OfflineScormParams = {
  attempt: number;
  scorm?: Scorm;
  scoid?: string;
  backAction: () => void;
};

type OfflineScormProps = {
  navigation: NavigationStackProp<OfflineScormParams>;
};

const getResources = (state: RootState) => state.resourceReducer.resources;

const OfflineScormActivity = ({ navigation }: OfflineScormProps) => {
  const { scorm, attempt, scoid, backAction } = navigation.state
    .params as OfflineScormParams;
  if (!scorm || !scorm.id) {
    return (
      <Text testID={"test_invalid_scorm"}>
        {translate("general.error_unknown")}
      </Text>
    );
  }

  const resourcesList = useSelector(getResources);
  const targetResource = resourcesList.find(
    (resource) =>
      resource.customId === scorm.id &&
      resource.type === ResourceType.ScormActivity
  );
  if (!targetResource) {
    return (
      <Text testID={"test_non_exist_resource"}>
        {translate("general.error_unknown")}
      </Text>
    );
  }

  const server = useRef<StaticServer>(null);

  const [scormPackageData, setScormPackageData] = useState<Package>({
    path: `${getOfflineScormPackageName(scorm.id)}`
  });
  const { scos, defaultSco } = scormPackageData;

  const [url, setUrl] = useState<string>();
  const [jsCode, setJsCode] = useState<string>();

  useEffect(() => {
    setupOfflineScormPlayer()
      .then((offlineServerPath) => {
        if (offlineServerPath && offlineServerPath !== "") {
          return startServer(offlineServerPath);
        } else {
          throw new Error("Cannot fine offline server details.");
        }
      })
      .then((serverOrigin: string) => {
        setUrl(serverOrigin);
      })
      .catch((e) => {
        Log.debug(e.messageData);
      });

    loadScormPackageData(scormPackageData)
      .then((data) => {
        setScormPackageData(data);
      })
      .catch((e) => {
        Log.debug(e.messageData);
      });

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, [scorm.id]);

  useEffect(() => {
    if (url && scos) {
      const { id, newAttemptDefaults } = scorm;
      const cmiData = getScormAttemptData({
        scormId: scorm.id,
        attempt,
        client
      });
      const selectedScoId = scoid || (defaultSco && defaultSco.id!);
      const lastActivityCmi = (cmiData && cmiData[selectedScoId]) || undefined;
      const cmi = getScormPlayerInitialData({
        scormId: id,
        scos,
        scoId: selectedScoId,
        attempt,
        packageLocation: getOfflineScormPackageName(scorm.id),
        playerInitalData: {
          defaults: JSON.parse(newAttemptDefaults)
        }
      });
      setJsCode(scormDataIntoJsInitCode(cmi, lastActivityCmi));
    }
  }, [scormPackageData, url]);

  useEffect(() => {}, []);
  const stopServer = () => {
    if (server && server.current) {
      server.current!.stop();
      server.current = null;
    }
    setUrl(undefined);
  };

  const startServer = (path: string) => {
    if (server && server.current) {
      server.current.stop();
      server.current = null;
    }
    server.current = new StaticServer(0, path, {
      keepAlive: true,
      localOnly: true
    });
    return server.current.start();
  };

  const onExitPlayerHandler = () => {
    stopServer();
  };

  const client = useApolloClient();

  const onPlayerMessageHandler = (messageData: any) => {
    const { tmsevent, result } = messageData;
    if (tmsevent && tmsevent === "SCORMCOMMIT" && result) {
      const status = get(result, "cmi.core.lesson_status", undefined);
      if (status && status !== scormLessonStatus.incomplete) {
        const scormBundles = retrieveAllData({ client });
        const newData = setScormActivityData({
          scormBundles,
          data: result,
          maxGrade: scorm.maxgrade,
          gradeMethod: scorm.grademethod as Grade
        });
        saveInTheCache({
          client,
          scormBundles: newData
        });
      }
    }
  };

  return (
    <>
      {url && jsCode ? (
        <OfflineScormPlayer
          url={url}
          injectScript={jsCode}
          onExitHandler={onExitPlayerHandler}
          onMessageHandler={onPlayerMessageHandler}
        />
      ) : (
        <Text testID={"text_player_loading"}>Player loading......</Text>
      )}
    </>
  );
};

export default OfflineScormActivity;
