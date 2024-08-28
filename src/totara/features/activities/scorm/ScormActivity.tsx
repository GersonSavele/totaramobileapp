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

import { useApolloClient, useQuery } from '@apollo/client';
import { useNetInfo } from '@react-native-community/netinfo';
import CloseButton from '@totara/components/CloseButton';
import Loading from '@totara/components/Loading';
import ResourceDownloader from '@totara/components/ResourceDownloader';
import { useSession } from '@totara/core';
import { useNavigation, useParams } from '@totara/lib/hooks';
import { NAVIGATION } from '@totara/lib/navigation';
import ResourceManager from '@totara/lib/resourceManager';
import { fullFlex } from '@totara/lib/styles/base';
import { NAVIGATION_TEST_IDS, SCORM_TEST_IDS } from '@totara/lib/testIds';
import { humanReadablePercentage, showMessage } from '@totara/lib/tools';
import { translate } from '@totara/locale';
import type { RootState } from '@totara/reducers';
import { iconSizes } from '@totara/theme/constants';
import type { Resource } from '@totara/types/Resource';
import { ResourceState, ResourceType } from '@totara/types/Resource';
import type { ScormActivityParams, ScormBundle } from '@totara/types/Scorm';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { SafeAreaView } from 'react-native';
import { useSelector } from 'react-redux';

import { scormQuery } from './api';
import ScormSummary from './ScormSummary';
import { getOfflineActivity } from './storageUtils';
import { getOfflinePackageUnzipPath, getTargetZipFile } from './utils';

const { download } = ResourceManager;

type ApiDataEffectProps = {
  data?: any;
  client: any;
  id: string;
  scormBundle?: ScormBundle;
  setScormBundle: Function;
};

const { SUMMARY_ID, LOADING_ID } = SCORM_TEST_IDS;

const apiDataEffect =
  ({ data, client, id, scormBundle, setScormBundle }: ApiDataEffectProps) =>
  () => {
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

const onRefresh =
  ({
    isInternetReachable,
    refetch,
    client,
    id,
    scormBundle,
    setScormBundle
  }: ApiDataEffectProps & {
    isInternetReachable?: null | boolean;
    refetch: Function;
  }) =>
  () => {
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

const ScormActivity = () => {
  const navigation = useNavigation('ScormActivity');
  const { id, title = '' } = useParams('ScormActivity') ?? {};
  const apolloClient = useApolloClient();
  const { loading, error, data, refetch, networkStatus } = useQuery(scormQuery, {
    variables: { scormid: id },
    notifyOnNetworkStatusChange: true
  });

  const { isInternetReachable } = useNetInfo();

  // FIXME: This is a temporary hack because the server is not returning correct data
  const [scormBundle, setScormBundle] = useState<ScormBundle | undefined>(data);

  const { apiKey = '', host = '' } = useSession();

  //FIXME: IMPROVE THIS USESELECTOR, create something like useResource that does all this stuff
  const resourceList: Resource[] = useSelector((state: RootState) => state.resourceReducer.resources);
  const resource = resourceList.find(x => x.customId === id);

  const progress = resource
    ? humanReadablePercentage({
        writtenBytes: resource.bytesDownloaded,
        sizeInBytes: resource.sizeInBytes
      })
    : 0;
  const scorm = scormBundle?.scorm;
  const offlinePackageUrl = scorm?.offlineAttemptsAllowed && scorm?.offlinePackageUrl;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return offlinePackageUrl ? (
          <ResourceDownloader
            resourceState={resource?.state}
            progress={progress}
            size={iconSizes.sizeM}
            onPress={onDownloadPress}
            testID={SCORM_TEST_IDS.DOWNLOAD}
          />
        ) : null;
      }
    });
  });

  const onDownloadPress = () => {
    if (isInternetReachable) {
      download({
        apiKey: apiKey,
        customId: id,
        name: title,
        type: ResourceType.ScormActivity,
        resourceUrl: offlinePackageUrl as string,
        targetPathFile: getTargetZipFile(id),
        targetExtractPath: getOfflinePackageUnzipPath(id)
      });
    } else {
      showMessage({ text: translate('general.no_internet') });
    }
  };

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
        isDownloaded={resource?.state === ResourceState.Completed}
        client={apolloClient}
        apiKey={apiKey}
        host={host}
      />
    </SafeAreaView>
  );
};

const navigationOptions = ({ navigation }) => {
  const { title = '', backAction = () => navigation.pop() } = navigation.state.params as ScormActivityParams;
  return {
    title,
    headerTitleAlign: 'center',
    headerLeft: () => <CloseButton onPress={backAction} testID={NAVIGATION_TEST_IDS.BACK} />,
    headerRight: () => headerRight({ navigation })
  };
};

const headerRight = props => {
  const { navigation } = props;
  const {
    id,
    title = '',
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
        accessibilityLabel={translate('downloads.accessibility_icon', { filename: title })}
        onPress={() => onDownloadPress({ id, title })}
        testID={SCORM_TEST_IDS.DOWNLOAD}
      />
    );
  }
};

export { apiDataEffect, navigationOptions, onRefresh };
export default ScormActivity;
