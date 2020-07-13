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
import {
  createStackNavigator,
  NavigationStackProp
} from "react-navigation-stack";
import { NavigationActions } from "react-navigation";
import { useSelector } from "react-redux";
import { useQuery } from "@apollo/react-hooks";

import { AppState } from "@totara/types";
import ScormSummary from "./ScormSummary";
import { AuthContext } from "@totara/core";
import { OfflineScormActivity } from "./offline";
import OnlineSCORMActivity from "./online/OnlineSCORMActivity";
import ResourceDownloader from "@totara/components/ResourceDownloader";
import { TouchableIcon } from "@totara/components";
import { Resource, ResourceType, ResourceState } from "@totara/types/Resource";
import { RootState } from "@totara/reducers";
import { scormQuery } from "./api";
import { NAVIGATION } from "@totara/lib/navigation";
import { getOfflineActivity } from "./storageUtils";

import { humanReadablePercentage, showMessage } from "@totara/lib/tools";
import ScormAttempts from "./ScormAttempts";
import Loading from "@totara/components/Loading";
import { TotaraTheme } from "@totara/theme/Theme";
import { ScormActivityParams, ScormBundle } from "@totara/types/Scorm";
import { useNetInfo } from "@react-native-community/netinfo";
import { translate } from "@totara/locale";
import { SafeAreaView } from "react-native";
import { fullFlex } from "@totara/lib/styles/base";
import { useApolloClient } from "@apollo/react-hooks";

import ResourceManager from "@totara/lib/resourceManager";
import { iconSizes } from "@totara/theme/constants";
import ScormFeedback from "./ScormFeedback";
import { getTargetZipFile, getOfflinePackageUnzipPath } from "./utils";

const { download } = ResourceManager;

const {
  SCORM_ROOT,
  SCORM_STACK_ROOT,
  SCORM_ATTEMPTS,
  OFFLINE_SCORM_ACTIVITY,
  ONLINE_SCORM_ACTIVITY,
  SCORM_FEEDBACK
} = NAVIGATION;

type ScormActivityProps = {
  navigation: NavigationStackProp<ScormActivityParams>;
};

const ScormActivity = (props: ScormActivityProps) => {
  const { navigation } = props;
  const { id, title = "" } = navigation.state.params as ScormActivityParams;
  const apolloClient = useApolloClient();
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
  const [resourceState, setResourceState] = useState<ResourceState>();

  const {
    authContextState: { appState }
  } = useContext(AuthContext);

  const { apiKey, host } = appState as AppState;

  const resourceList: Resource[] = useSelector(
    (state: RootState) => state.resourceReducer.resources
  );

  const onRefresh = () => {
    if (isInternetReachable) {
      refetch();
    } else {
      const offlineAttempts = getOfflineActivity({
        client: apolloClient,
        scormId: id
      });
      setScormBundle({
        ...scormBundle,
        offlineAttempts: offlineAttempts
      });
    }
  };
  useEffect(() => {
    if (
      scormBundle &&
      scormBundle.scorm &&
      scormBundle.scorm.offlineAttemptsAllowed
    ) {
      const resource = resourceList.find((x) => x.customId === id);
      const resourceState = resource && resource.state;
      const progress = resource
        ? humanReadablePercentage({
            writtenBytes: resource.bytesDownloaded,
            sizeInBytes: resource.sizeInBytes
          })
        : 0;

      const { packageUrl } = scormBundle.scorm;

      headerDispatch({
        downloadProgress: progress,
        downloadState: resourceState,
        // if there's no existing scorm resource, a null function will serve disabling the action
        onDownloadPress: resource
          ? () => null
          : ({ id, title }) => {
              if (isInternetReachable) {
                download({
                  apiKey: apiKey,
                  customId: id,
                  name: title,
                  type: ResourceType.ScormActivity,
                  resourceUrl: packageUrl,
                  targetPathFile: getTargetZipFile(id),
                  targetExtractPath: getOfflinePackageUnzipPath(id)
                });
              } else {
                showMessage({ text: translate("general.no_internet") });
              }
            }
      });
      setResourceState(resource && resource.state);
    }
  }, [resourceList, scormBundle]);

  useEffect(() => {
    if (data) {
      let mergedData = { ...data };

      const offlineAttempts = getOfflineActivity({
        client: apolloClient,
        scormId: id
      });
      setScormBundle({
        ...scormBundle,
        ...mergedData,
        offlineAttempts: offlineAttempts
        //TODO: remove timestamp if the user is online
        //lastsynced: 0
      });
    }
  }, [data]);

  const headerDispatch = (params) => {
    const setParamsAction = NavigationActions.setParams({
      params,
      key: SCORM_ROOT
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
        error={error}
        networkStatus={networkStatus}
        scormBundle={scormBundle}
        onRefresh={onRefresh}
        isDownloaded={resourceState === ResourceState.Completed}
        client={apolloClient}
        apiKey={apiKey}
        host={host}
      />
    </SafeAreaView>
  );
};

const navigationOptions = ({ navigation }) => {
  const {
    title = "",
    backIcon = "times",
    backAction = () => navigation.pop()
  } = navigation.state.params as ScormActivityParams;
  return {
    title,
    headerTitleAlign: "center",
    headerLeft: (
      <TouchableIcon
        icon={backIcon}
        onPress={backAction}
        color={TotaraTheme.colorLink}
        size={TotaraTheme.textHeadline.fontSize}
      />
    ),
    headerRight: headerRight({ navigation })
  };
};

const innerStack = createStackNavigator(
  {
    [SCORM_ROOT]: {
      screen: ScormActivity,
      navigationOptions
    },
    [SCORM_ATTEMPTS]: {
      screen: ScormAttempts,
      navigationOptions
    },
    [OFFLINE_SCORM_ACTIVITY]: {
      screen: OfflineScormActivity,
      navigationOptions
    },
    [ONLINE_SCORM_ACTIVITY]: {
      screen: OnlineSCORMActivity,
      navigationOptions
    }
  },
  {
    initialRouteKey: SCORM_ROOT,
    initialRouteName: SCORM_ROOT
  }
);

const scormStack = createStackNavigator(
  {
    [SCORM_STACK_ROOT]: {
      screen: innerStack
    },
    [SCORM_FEEDBACK]: {
      screen: ScormFeedback,
      navigationOptions
    }
  },
  {
    mode: "modal",
    headerMode: "none"
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
        size={iconSizes.sizeM}
        onPress={() => onDownloadPress({ id, title })}
      />
    );
  }
};

export { scormStack };
export default ScormActivity;
