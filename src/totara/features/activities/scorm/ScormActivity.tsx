/**
 * This file is part of Totara Enterprise.
 *
 * Copyright (C) 2020 onwards Totara Learning Solutions LTD
 *
 * Totara Enterprise is provided only to Totara Learning Solutions
 * LTD’s customers and partners, pursuant to the terms and
 * conditions of a separate agreement with Totara Learning
 * Solutions LTD or its affiliate.
 *
 * If you do not have an agreement with Totara Learning Solutions
 * LTD, you may not access, use, modify, or distribute this software.
 * Please contact [sales@totaralearning.com] for more information.
 */

import React, { useContext, useEffect, useState } from "react";
import { createStackNavigator, NavigationStackProp } from "react-navigation-stack";
import { NavigationActions } from "react-navigation";
import { useSelector } from "react-redux";
import { useQuery } from "@apollo/react-hooks";

import { AppState } from "@totara/types";
import ScormSummary from "./ScormSummary";
import { AuthContext } from "@totara/core";
import OfflineScormActivity from "./OfflineScormActivity";
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
import { ScormActivityParams, ScormBundle, Scorm } from "@totara/types/Scorm";
import { useNetInfo } from "@react-native-community/netinfo";
import { translate } from "@totara/locale";
import { SafeAreaView } from "react-native";
import { fullFlex } from "@totara/lib/styles/base";
import { useApolloClient } from "@apollo/react-hooks";

import ResourceManager from "@totara/lib/resourceManager";
import { iconSizes } from "@totara/theme/constants";
import { getTargetZipFile, getOfflinePackageUnzipPath } from "./utils";
import ScormFeedbackModal from "./components/ScormFeedbackModal";
import { SCORM_TEST_IDS } from "./constants";
import { WebviewActivity } from "../webview/WebviewActivity";

const { download } = ResourceManager;

const {
  SCORM_ROOT,
  SCORM_STACK_ROOT,
  SCORM_ATTEMPTS,
  OFFLINE_SCORM_ACTIVITY,
  WEBVIEW_ACTIVITY,
  SCORM_FEEDBACK
} = NAVIGATION;

type ScormActivityProps = {
  navigation: NavigationStackProp<ScormActivityParams>;
};

type ApiDataEffectProps = {
  data?: any;
  client: any;
  id: string;
  scormBundle?: ScormBundle;
  setScormBundle: Function;
};

type ResourceListEffectProps = {
  scorm?: Scorm;
  resourceList: Resource[];
  id: string;
  apiKey: string;
  isInternetReachable?: boolean | null;
  navigation: any;
  setResourceState: Function;
};

const { SUMMARY_ID, LOADING_ID } = SCORM_TEST_IDS;

const headerDispatch = (params, dispatch) => {
  const setParamsAction = NavigationActions.setParams({
    params,
    key: SCORM_ROOT
  });
  dispatch(setParamsAction);
};

const apiDataEffect = ({ data, client, id, scormBundle, setScormBundle }: ApiDataEffectProps) => () => {
  if (data) {
    let mergedData = { ...data };

    const offlineAttempts = getOfflineActivity({
      client,
      scormId: id
    });
    setScormBundle({
      ...scormBundle,
      ...mergedData,
      offlineAttempts: offlineAttempts
    });
  }
};

const onRefresh = ({
  isInternetReachable,
  refetch,
  client,
  id,
  scormBundle,
  setScormBundle
}: ApiDataEffectProps & {
  isInternetReachable?: null | boolean;
  refetch: Function;
}) => () => {
  if (isInternetReachable) {
    refetch();
  } else {
    const offlineAttempts = getOfflineActivity({
      client,
      scormId: id
    });
    setScormBundle({
      ...scormBundle,
      offlineAttempts: offlineAttempts
    });
  }
};

const resourceListEffect = ({
  scorm,
  resourceList,
  id,
  apiKey,
  isInternetReachable,
  navigation,
  setResourceState
}: ResourceListEffectProps) => () => {
  if (scorm?.offlineAttemptsAllowed && scorm?.packageUrl) {
    const resource = resourceList.find((x) => x.customId === id);

    const resourceState = resource?.state;
    const progress = resource
      ? humanReadablePercentage({
          writtenBytes: resource.bytesDownloaded,
          sizeInBytes: resource.sizeInBytes
        })
      : 0;

    const { packageUrl } = scorm;

    headerDispatch(
      {
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
      },
      navigation.dispatch
    );
    setResourceState((resource && resource.state) || undefined);
  }
};

const ScormActivity = (props: ScormActivityProps) => {
  const { navigation } = props;
  const { id, title = "" } = navigation.state.params as ScormActivityParams;
  const apolloClient = useApolloClient();
  const { loading, error, data, refetch, networkStatus } = useQuery(scormQuery, {
    variables: { scormid: id },
    notifyOnNetworkStatusChange: true
  });

  const { isInternetReachable } = useNetInfo();

  // FIXME: This is a temporary hack because the server is not returning correct data
  const [scormBundle, setScormBundle] = useState<ScormBundle | undefined>(data);
  const [resourceState, setResourceState] = useState<ResourceState>();

  const {
    authContextState: { appState }
  } = useContext(AuthContext);

  const { apiKey, host } = appState as AppState;

  const resourceList: Resource[] = useSelector((state: RootState) => state.resourceReducer.resources);

  useEffect(
    resourceListEffect({
      scorm: scormBundle?.scorm,
      id,
      apiKey,
      isInternetReachable,
      navigation,
      resourceList,
      setResourceState
    }),
    [resourceList, scormBundle]
  );

  useEffect(
    apiDataEffect({
      data,
      client: apolloClient,
      id,
      scormBundle,
      setScormBundle
    }),
    [data]
  );

  if (loading && !(scormBundle && scormBundle.scorm)) {
    return <Loading testID={LOADING_ID} />;
  }
  return (
    <SafeAreaView style={fullFlex} testID={SUMMARY_ID}>
      <ScormSummary
        id={id}
        navigation={navigation}
        name={title}
        loading={loading}
        error={error}
        networkStatus={networkStatus}
        scormBundle={scormBundle}
        onRefresh={onRefresh({
          isInternetReachable,
          refetch,
          client: apolloClient,
          scormBundle,
          setScormBundle,
          id
        })}
        isDownloaded={resourceState === ResourceState.Completed}
        client={apolloClient}
        apiKey={apiKey}
        host={host}
      />
    </SafeAreaView>
  );
};

const navigationOptions = ({ navigation }) => {
  const { title = "", backIcon = "times", backAction = () => navigation.pop() } = navigation.state
    .params as ScormActivityParams;
  return {
    title,
    headerTitleAlign: "center",
    headerLeft: <TouchableIcon icon={backIcon} onPress={backAction} size={TotaraTheme.textHeadline.fontSize} />,
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
    [WEBVIEW_ACTIVITY]: {
      screen: WebviewActivity,
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
      screen: ScormFeedbackModal,
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
  const { id, title = "", downloadProgress = 0, downloadState, onDownloadPress } = navigation.state
    .params as ScormActivityParams;

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

export { scormStack, headerDispatch, apiDataEffect, onRefresh, navigationOptions, resourceListEffect };
export default ScormActivity;
