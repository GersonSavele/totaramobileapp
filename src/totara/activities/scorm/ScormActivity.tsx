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

import React, { useEffect, useContext, useState } from "react";
import {
  NavigationStackProp,
  createStackNavigator
} from "react-navigation-stack";
import { NavigationActions } from "react-navigation";
import { useSelector } from "react-redux";
import { useQuery } from "@apollo/react-hooks";

import { AppState } from "@totara/types";
import ScormSummary from "./ScormSummary";
import { AuthContext } from "@totara/core";
import { OfflineScormActivity } from "./offline";
import ResourceDownloader from "@totara/components/ResourceDownloader";
import { TouchableIcon } from "@totara/components";
import { ResourceState } from "@totara/types/Resource";
import { RootState } from "@totara/reducers";
import { scormQuery } from "./api";
import { NAVIGATION_SCORM_STACK_ROOT } from "@totara/lib/constants";

import ResourceManager from "@totara/lib/resourceManager";
import {
  getOfflinePackageUnzipPath,
  getTargetZipFile,
  formatAttempts
} from "@totara/lib/scorm";
import { humanReadablePercentage, showMessage } from "@totara/lib/tools";
import { Resource } from "@totara/types/Resource";
import ScormAttempts from "./ScormAttempts";
import Loading from "@totara/components/Loading";
import { TotaraTheme } from "@totara/theme/Theme";
import { ScormBundle, ScormActivityParams } from "@totara/types/Scorm";
import { useNetInfo } from "@react-native-community/netinfo";
import { translate } from "@totara/locale";
import { SafeAreaView } from "react-native";
import { fullFlex } from "@totara/lib/styles/base";

const { download } = ResourceManager;

type ScormActivityProps = {
  navigation: NavigationStackProp<ScormActivityParams>;
};

const ScormActivity = (props: ScormActivityProps) => {
  const { navigation } = props;
  const { id, title = "" } = navigation.state.params as ScormActivityParams;

  const { loading, error, data, refetch, networkStatus } = useQuery(
    scormQuery,
    {
      variables: { scormid: id },
      notifyOnNetworkStatusChange: true
    }
  );

  const { isInternetReachable } = useNetInfo();

  // FIXME: This is a temporary hack because the server is not returning correct data
  const [scormBundle, setScormBundle] = useState<ScormBundle | undefined>(data);

  const {
    authContextState: { appState }
  } = useContext(AuthContext);

  const { apiKey } = appState as AppState;

  const resourcesList: Resource[] = useSelector(
    (state: RootState) => state.resourceReducer.resources
  );

  useEffect(() => {
    if (scormBundle) {
      const targetResource: Resource | undefined = resourcesList.find(
        (resource) => resource.id === id
      );
      const {
        bytesDownloaded: writtenBytes = 0,
        sizeInBytes = 1,
        state = ResourceState.Empty
      } = targetResource || {};

      const { packageUrl } = scormBundle.scorm;

      headerDispatch({
        downloadProgress: humanReadablePercentage({
          writtenBytes,
          sizeInBytes
        }),
        downloadState: state,
        // if there's no existing scorm resource, a null function will serve disabling the action
        onDownloadPress: targetResource
          ? () => null
          : ({ id, title }) => {
              if (isInternetReachable) {
                download(
                  apiKey,
                  id,
                  title,
                  packageUrl,
                  getTargetZipFile(id),
                  getOfflinePackageUnzipPath(id)
                );
              } else {
                showMessage({ text: translate("general.no_internet") });
              }
            }
      });
    }
  }, [resourcesList, scormBundle]);

  useEffect(() => {
    if (data) {
      // FIXME: This is a temporary hack because the server is not returning correct data
      setScormBundle({
        ...scormBundle,
        scorm: formatAttempts(data.scorm)
        //TODO: remove timestamp if the user is online
        //lastsynced: 0
      });
    }
  }, [data]);

  const headerDispatch = (params) => {
    const setParamsAction = NavigationActions.setParams({
      params,
      key: NAVIGATION_SCORM_STACK_ROOT
    });
    navigation.dispatch(setParamsAction);
  };

  if (loading && !(scormBundle && scormBundle.scorm)) {
    return <Loading />;
  }
  return (
    <SafeAreaView style={fullFlex}>
      <ScormSummary
        id={id}
        navigation={navigation}
        name={title}
        loading={loading}
        refetch={refetch}
        error={error}
        networkStatus={networkStatus}
        scormBundle={scormBundle}
      />
    </SafeAreaView>
  );
};

const scormStack = createStackNavigator(
  {
    ScormActivity: {
      screen: ScormActivity,

      navigationOptions: ({ navigation }) => {
        const { title = "" } = navigation.state.params as ScormActivityParams;
        return {
          title,
          headerTitleAlign: "center",
          headerLeft: (
            <TouchableIcon
              icon={"times"}
              onPress={() => navigation.pop()}
              size={TotaraTheme.textH3.fontSize}
            />
          ),
          headerRight: headerRight({ navigation })
        };
      }
    },
    ScormAttemps: {
      screen: ScormAttempts,
      navigationOptions: ({ navigation }) => {
        const { title = "" } = navigation.state.params as ScormActivityParams;
        return {
          title
        };
      }
    },
    OfflineScormActivity: {
      screen: OfflineScormActivity
    }
  },
  {
    initialRouteKey: NAVIGATION_SCORM_STACK_ROOT,
    initialRouteName: "ScormActivity"
  }
);

const headerRight = (props) => {
  const { navigation } = props;
  const {
    id,
    title = "",
    downloadProgress = 0,
    downloadState,
    onDownloadPress
  } = navigation.state.params as ScormActivityParams;

  if (onDownloadPress) {
    return (
      <ResourceDownloader
        resourceState={downloadState}
        progress={downloadProgress}
        size={TotaraTheme.textH3.fontSize}
        onPress={() => onDownloadPress({ id, title })}
      />
    );
  }
};

export { scormStack };
export default ScormActivity;
