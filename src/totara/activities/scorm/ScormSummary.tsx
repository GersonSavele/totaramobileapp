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

import React, { useContext, useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  Modal,
  SafeAreaView,
  TextStyle,
  TouchableOpacity,
  RefreshControl
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { AuthContext } from "@totara/core";
import { ScormBundle } from "@totara/types/Scorm";
import {
  MoreText,
  PrimaryButton,
  SecondaryButton,
  MessageBar,
  Loading
} from "@totara/components";
import { gutter, ThemeContext } from "@totara/theme";
import {
  offlineScormServerRoot,
  syncOfflineScormBundle,
  getOfflineScormPackageName
} from "./offline";
import ResourceManager, {
  ResourceObserver
} from "@totara/core/ResourceManager/ResourceManager";
import {
  IResource,
  ResourceState
} from "@totara/core/ResourceManager/Resource";
import { translate } from "@totara/locale";
import ScormAttempts from "./ScormAttempts";
import { AppliedTheme } from "@totara/theme/Theme";
import { ActivitySheetContext } from "../ActivitySheet";
import {
  getDataForScormSummary,
  onTapDownloadResource,
  onTapNewAttempt,
  onTapContinueLastAttempt,
  onTapViewAllAttempts,
  formatAttempts,
  updateScormBundleWithOfflineAttempts,
  removeScormPackageData
} from "@totara/lib/scorm";
import { scormSummaryStyles } from "@totara/theme/scorm";
import {
  scormActivityType,
  scormSummarySection,
  DATE_FORMAT,
  DATE_FORMAT_FULL,
  SECONDS_FORMAT
} from "@totara/lib/constants";
import { useQuery, useApolloClient } from "@apollo/react-hooks";
import { scormQuery } from "./api";
import LoadingError from "@totara/components/LoadingError";
import { NetworkStatus } from "apollo-boost";
import { useNetInfo } from "@react-native-community/netinfo";
import moment from "moment";

type SummaryProps = {
  id: string;
  setActionWithData: (
    action: scormActivityType,
    bundle?: ScormBundle,
    data?: any
  ) => void;
};

const gridStyle = (theme: AppliedTheme) => [
  theme.textB1,
  { color: theme.textColorSubdued }
];

type GridLabelProps = {
  theme: AppliedTheme;
  textId: string;
  value: string;
  children?: Element;
};

const GridLabelValue = ({ theme, textId, value, children }: GridLabelProps) => (
  <View style={scormSummaryStyles.sectionField}>
    <Text style={theme.textB1}>{translate(textId)}</Text>
    <View style={{ flexDirection: "row" }}>
      <Text style={gridStyle(theme)}>{value}</Text>
      {children}
    </View>
  </View>
);

type GridTitleProps = {
  theme: AppliedTheme;
  textId: string;
  style?: TextStyle;
};
const GridTitle = ({ theme, textId, style }: GridTitleProps) => (
  <Text style={[theme.textH2, scormSummaryStyles.sectionBreak, style]}>
    {translate(textId)}
  </Text>
);

const ScormSummary = ({ id, setActionWithData }: SummaryProps) => {
  const apolloClient = useApolloClient();
  const { isConnected, isInternetReachable } = useNetInfo();
  const isUserOnline = (isConnected && isInternetReachable && true) || false;

  const { loading, error, data, refetch, networkStatus } = useQuery(
    scormQuery,
    {
      variables: { scormid: id },
      notifyOnNetworkStatusChange: true
    }
  );

  const [scormBundle, setScormBundle] = useState<ScormBundle | undefined>(data);
  const {
    authContextState: { appState }
  } = useContext(AuthContext);
  const activitySheet = useContext(ActivitySheetContext);
  const [section, setSection] = useState(scormSummarySection.none);
  const [theme] = useContext(ThemeContext);
  const [downloadManager] = useState<ResourceManager>(
    ResourceManager.getInstance()
  );

  const {
    name,
    description,
    totalAttempt,
    attemptGrade,
    gradeMethod,
    calculatedGrade,
    actionPrimary,
    actionSecondary,
    lastsynced,
    timeOpen,
    maxAttempts,
    attempts
  } = getDataForScormSummary(isUserOnline, scormBundle);

  const shouldShowAction =
    !timeOpen &&
    (!maxAttempts || maxAttempts >= totalAttempt) &&
    (actionPrimary || actionSecondary);

  const onTapDeleteResource = () => {
    downloadManager.delete(id);
  };

  const setResource = (resource?: IResource) => {
    let onResourceTap: (() => void) | undefined = onTapDownloadResource({
      callback: syncOfflineScormBundle,
      downloadManager,
      scormBundle,
      client: apolloClient,
      apiKey: appState && appState.apiKey
    });
    if (resource) {
      switch (resource.state) {
        case ResourceState.Downloading:
          onResourceTap = undefined;
          break;
        case ResourceState.Completed:
          onResourceTap = onTapDeleteResource;
          break;
      }
    }
    activitySheet.setActivityResource({
      data: resource,
      action: onResourceTap
    });
  };

  //=========================

  // let cacheData = undefined;
  // try {
  //   cacheData = client.readQuery({ query: scormBundlesQuery });
  // } catch (e) {
  //   console.log("cacheData error: ", e);
  // }
  // console.log("cacheData: ", cacheData);
  //=======================

  const onDownloadFileUpdated: ResourceObserver = (resourceFile) => {
    const resoureId = resourceFile.id;
    if (
      scormBundle &&
      scormBundle.scorm &&
      scormBundle.scorm.id === resoureId
    ) {
      switch (resourceFile.state) {
        case ResourceState.Completed: {
          const offlineSCORMPackageName = getOfflineScormPackageName(resoureId);
          const _unzipPath = `${offlineScormServerRoot}/${offlineSCORMPackageName}`;
          if (resourceFile.unzipPath === _unzipPath) {
            const _offlineScormData = {
              scormPackage: {
                path: offlineSCORMPackageName
              },
              lastsynced: parseInt(moment().format(SECONDS_FORMAT))
            } as ScormBundle;

            //this updates the SCORM file unzipPath in the resource manager
            // This update the relative path as well
            // updates the LastSync
            // use client.writeQuery()
            syncOfflineScormBundle(
              resoureId,
              _offlineScormData,
              apolloClient
            ).then(() => {
              setResource(resourceFile);
            });
          }
          break;
        }
        case ResourceState.Deleted: {
          removeScormPackageData(resoureId, apolloClient).then(() => {
            setResource(undefined);
          });
          break;
        }
        case ResourceState.Downloading: {
          setResource(resourceFile);
          break;
        }
      }
    }
  };

  useEffect(() => {
    if (data && data.scorm) {
      // format scorm bundle with offline attempts
      // create new scorm bundle with the offline
      // the very first, we should not call this
      // The reason to call this is to merge the attempts, and  (last API response timestamp - scormAPIDATA_LOCAL_STORAGE)
      // and syncOfflineScormBundle(updates the package path)
      //

      updateScormBundleWithOfflineAttempts(
        id,
        formatAttempts(data.scorm),
        apolloClient
      ).then((formattedData) => {
        console.log("formattedData: ", formattedData);
        setScormBundle(formattedData);
      });
    }
  }, [data, isUserOnline]);

  useEffect(() => {
    if (
      !scormBundle ||
      !scormBundle.scorm ||
      !isUserOnline ||
      !shouldShowAction
    ) {
      return;
    }
    downloadManager.attach(onDownloadFileUpdated);
    const filter = downloadManager.snapshot.filter(
      (x) => x.id === scormBundle.scorm.id.toString()
    );
    if (filter.length > 0) {
      const existingResource = filter[0];
      setResource(existingResource);
    } else {
      setResource(undefined);
    }
    return () => {
      downloadManager.detach(onDownloadFileUpdated);
    };
  }, [scormBundle && scormBundle.scorm, downloadManager]);

  if (loading && !(scormBundle && scormBundle.scorm)) {
    return <Loading />;
  }
  if (error) {
    return <LoadingError onRefreshTap={refetch} />;
  }

  const offlineMessage =
    (lastsynced &&
      `${translate("scorm.last_synced")}: ${lastsynced.toNow(true)} ${translate(
        "scorm.ago"
      )} (${lastsynced.format(DATE_FORMAT)})`) ||
    (!isUserOnline && translate("general.no_internet")) ||
    undefined;
  return (
    <>
      <View style={scormSummaryStyles.expanded}>
        {shouldShowAction && offlineMessage && (
          <MessageBar mode={"info"} text={offlineMessage} icon={"bolt"} />
        )}
        {maxAttempts && maxAttempts <= totalAttempt && (
          <MessageBar
            mode={"alert"}
            text={translate("scorm.info_completed_attempts")}
            icon={"exclamation-circle"}
          />
        )}
        {timeOpen && (
          <MessageBar
            mode={"alert"}
            text={`${translate(
              "scorm.info_upcoming_activity"
            )} ${timeOpen.format(DATE_FORMAT_FULL)}`}
            icon={"exclamation-circle"}
          />
        )}
        <View style={{ flex: 1 }}>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={networkStatus === NetworkStatus.refetch}
                onRefresh={refetch}
              />
            }>
            <View style={{ padding: gutter }}>
              {description && (
                <>
                  <GridTitle
                    textId={"scorm.summary.summary"}
                    theme={theme}
                    style={{ paddingTop: 0 }}
                  />
                  <MoreText longText={description} />
                </>
              )}
              <GridTitle textId={"scorm.summary.grade.title"} theme={theme} />
              <GridLabelValue
                theme={theme}
                textId={"scorm.summary.grade.method"}
                value={translate(`scorm.grading_method.${attemptGrade}`)}
              />
              <TouchableOpacity
                onPress={onTapViewAllAttempts({
                  scormBundle,
                  callback: setSection
                })}>
                <GridLabelValue
                  theme={theme}
                  textId={"scorm.summary.grade.reported"}
                  value={calculatedGrade}>
                  <FontAwesomeIcon
                    icon="chevron-right"
                    size={theme.textB1.fontSize}
                    style={{ alignSelf: "center", marginLeft: 8 }}
                    color={theme.textColorSubdued}
                  />
                </GridLabelValue>
              </TouchableOpacity>
              <GridTitle textId={"scorm.summary.attempt.title"} theme={theme} />
              <GridLabelValue
                theme={theme}
                textId={"scorm.summary.attempt.total_attempts"}
                value={
                  maxAttempts || translate("scorm.summary.attempt.unlimited")
                }
              />
              <GridLabelValue
                theme={theme}
                textId={"scorm.summary.attempt.completed_attempts"}
                value={totalAttempt}
              />
            </View>
          </ScrollView>
        </View>
        {!timeOpen &&
          (!maxAttempts || maxAttempts >= totalAttempt) &&
          (actionPrimary || actionSecondary) && (
            <AttemptController
              primary={
                (actionPrimary && {
                  title: translate("scorm.summary.new_attempt"),
                  action: onTapNewAttempt({
                    scormBundle,
                    isUserOnline,
                    callback: setActionWithData
                  })
                }) ||
                undefined
              }
              secondary={
                (actionSecondary && {
                  title: translate("scorm.summary.last_attempt"),
                  action: onTapContinueLastAttempt({
                    scormBundle,
                    isUserOnline,
                    callback: setActionWithData
                  })
                }) ||
                undefined
              }
            />
          )}
        <SafeAreaView />
      </View>
      {scormBundle && (
        <Modal visible={section === scormSummarySection.attempts}>
          <ScormAttempts
            attempts={attempts}
            onExit={() => setSection(scormSummarySection.none)}
            gradeMethod={gradeMethod}
            name={name}
          />
        </Modal>
      )}
    </>
  );
};

type PropsAttempt = {
  primary: PropsInfo | undefined;
  secondary: PropsInfo | undefined;
};

type PropsInfo = {
  title: string;
  action: () => void;
};

const AttemptController = ({ primary, secondary }: PropsAttempt) => {
  return (
    <View style={scormSummaryStyles.attemptContainer}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {secondary && (
          <SecondaryButton
            text={secondary.title}
            onPress={secondary.action}
            style={{ flex: 1, marginRight: primary ? 16 : 0 }}
          />
        )}
        {primary && (
          <PrimaryButton
            text={primary.title}
            onPress={primary.action}
            style={{ flex: 1 }}
          />
        )}
      </View>
    </View>
  );
};

export default ScormSummary;
