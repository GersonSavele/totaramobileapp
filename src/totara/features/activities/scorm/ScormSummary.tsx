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

import React, { useState } from "react";
import { ScrollView, Text, View, TextStyle, TouchableOpacity, RefreshControl } from "react-native";
import { get, isEmpty } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  MessageBar,
  NetworkStatus,
  LoadingError,
  MoreText,
  PrimaryButton,
  SecondaryButton,
  Loading
} from "@totara/components";
import { gutter } from "@totara/theme";
import { translate } from "@totara/locale";
import { AppliedTheme, TotaraTheme } from "@totara/theme/Theme";
import { scormSummaryStyles } from "@totara/theme/scorm";
import { NetworkStatus as ApolloNetworkStatus } from "apollo-boost";
import {
  setCompletedScormAttempt,
  getOfflineLastActivityResult,
  retrieveAllData,
  saveInTheCache
} from "./storageUtils";
import { getDataForScormSummary } from "./utils";
import { navigateTo, NAVIGATION } from "@totara/lib/navigation";
import { DATE_FORMAT_FULL } from "@totara/lib/constants";
import { ScormBundle, Grade } from "@totara/types/Scorm";
import { spacedFlexRow } from "@totara/lib/styles/base";
import { showConfirmation } from "@totara/lib/tools";
import { margins } from "@totara/theme/constants";
import { fetchLastAttemptResult } from "./api";

const { SCORM_ROOT, OFFLINE_SCORM_ACTIVITY, SCORM_ATTEMPTS, SCORM_FEEDBACK, WEBVIEW_ACTIVITY } = NAVIGATION;

type SummaryProps = {
  id: string;
  name: string;
  error: any;
  loading: boolean;
  networkStatus: any;
  scormBundle: ScormBundle | undefined;
  navigation: any;
  isDownloaded: boolean;
  client: any;
  onRefresh: () => void;
  apiKey: string;
  host: string;
};

const gridStyle = (theme: AppliedTheme) => [theme.textRegular, { color: theme.textColorSubdued }];

type GridLabelProps = {
  theme: AppliedTheme;
  textId: string;
  value: string;
  children?: Element;
};

const GridLabelValue = ({ theme, textId, value, children }: GridLabelProps) => (
  <View style={scormSummaryStyles.sectionField}>
    <Text style={theme.textRegular}>{translate(textId)}</Text>
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

type OnExitAcitivityAttemptProps = {
  id: string;
  attempt: number;
  gradeMethod?: Grade;
  completionScoreRequired?: number;
  client: any;
  apiKey?: string;
  host?: string;
  setIsLoadingCurretStatus?: Function;
  navigation: any;
  isDownloaded: boolean;
  offlinePackageScoIdentifiers?: [string];
  navigateTo: Function;
};

const GridTitle = ({ theme, textId, style = {} }: GridTitleProps) => (
  <Text
    style={{
      ...theme.textHeadline,
      ...scormSummaryStyles.sectionTitle,
      ...style
    }}>
    {translate(textId)}
  </Text>
);

const showScormFeedback = ({
  gradeMethod,
  score,
  completionScoreRequired,
  navigate,
  navigateTo
}: {
  gradeMethod: Grade;
  score: number;
  completionScoreRequired?: number;
  navigate: Function;
  navigateTo: Function;
}) => {
  const goToSummary = () => navigate({ routeName: SCORM_ROOT });
  navigateTo({
    routeId: SCORM_FEEDBACK,
    navigate: navigate,
    props: {
      gradeMethod,
      completionScoreRequired,
      score,
      onClose: goToSummary
    }
  });
};

const onExitActivityAttempt = ({
  id,
  attempt,
  gradeMethod = Grade.objective,
  apiKey,
  completionScoreRequired,
  client,
  host,
  setIsLoadingCurretStatus,
  navigation,
  isDownloaded,
  offlinePackageScoIdentifiers,
  navigateTo
}: OnExitAcitivityAttemptProps) => {
  showConfirmation({
    title: translate("scorm.confirmation.title"),
    message: translate("scorm.confirmation.message"),
    callback: () => {
      const existingLastAttempt = getOfflineLastActivityResult({
        scormId: id,
        client
      });

      navigation.pop();
      if (isDownloaded) {
        if (existingLastAttempt && existingLastAttempt.attempt && parseInt(existingLastAttempt.attempt) === attempt) {
          const scormBundles = retrieveAllData({ client });
          const newData = setCompletedScormAttempt({
            scormId: id,
            attempt,
            offlinePackageScoIdentifiers,
            scormBundles
          });
          saveInTheCache({ client, scormBundles: newData });
          showScormFeedback({
            gradeMethod,
            completionScoreRequired,
            score: existingLastAttempt.gradereported,
            navigate: navigation.navigate,
            navigateTo
          });
        }
      } else {
        if (apiKey && host) {
          setIsLoadingCurretStatus && setIsLoadingCurretStatus(true);
          fetchLastAttemptResult({
            scormId: id,
            apiKey,
            host
          })
            .then((response) => {
              const status = get(response, "data.status");
              if (status) {
                const { attemptsCurrent, gradefinal } = status;
                if (attempt == attemptsCurrent) {
                  showScormFeedback({
                    gradeMethod,
                    completionScoreRequired,
                    score: gradefinal,
                    navigate: navigation.navigate,
                    navigateTo
                  });
                }
              }
            })
            .catch((e) => console.log("Error: ", e))
            .finally(() => {
              setIsLoadingCurretStatus && setIsLoadingCurretStatus(false);
            });
        }
      }
    }
  });
  // This is the for the BackHandler callback that is calling this function
  return true;
};

const ScormSummary = ({
  id,
  error,
  networkStatus,
  scormBundle,
  navigation,
  isDownloaded,
  client,
  onRefresh,
  apiKey,
  host,
  loading
}: SummaryProps) => {
  const theme = TotaraTheme;

  const bundleData = getDataForScormSummary(isDownloaded, scormBundle);
  const [isLoadingCurretStatus, setIsLoadingCurretStatus] = useState(loading);
  const {
    name,
    description,
    totalAttempt,
    attemptGrade,
    gradeMethod,
    calculatedGrade,
    completionScoreRequired,
    launchUrl,
    shouldAllowNewAttempt,
    repeatUrl,
    shouldAllowLastAttempt,
    timeOpen,
    maxAttempts,
    attempts,
    offlinePackageScoIdentifiers
  } = bundleData;
  if (isLoadingCurretStatus) {
    return <Loading testID={"summary_loading"} />;
  }
  if (error) {
    return <LoadingError onRefreshTap={onRefresh} testID={"summary_error"} />;
  }
  return (
    <>
      <View style={scormSummaryStyles.expanded} testID={"scorm_summary_container"}>
        <NetworkStatus />
        {maxAttempts && maxAttempts <= totalAttempt && (
          <MessageBar mode={"alert"} text={translate("scorm.info_completed_attempts")} icon={"exclamation-circle"} />
        )}
        {timeOpen && (
          <MessageBar
            mode={"alert"}
            text={`${translate("scorm.info_upcoming_activity")} ${timeOpen.format(DATE_FORMAT_FULL)}`}
            icon={"exclamation-circle"}
          />
        )}
        <View style={{ flex: 1 }}>
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={networkStatus === ApolloNetworkStatus.refetch} onRefresh={onRefresh} />
            }>
            <View style={{ padding: gutter }}>
              {!isEmpty(description) && (
                <>
                  <GridTitle textId={"scorm.summary.summary"} theme={theme} style={{ paddingTop: 0 }} />
                  <MoreText longText={description} style={TotaraTheme.textMedium} />
                </>
              )}
              <GridTitle textId={"scorm.summary.grade.title"} theme={theme} />
              <GridLabelValue
                theme={theme}
                textId={"scorm.summary.grade.method"}
                value={attemptGrade && translate(`scorm.grading_method.${attemptGrade}`)}
              />
              <TouchableOpacity
                onPress={() =>
                  navigateTo({
                    routeId: SCORM_ATTEMPTS,
                    navigate: navigation.navigate,
                    props: {
                      attempts,
                      gradeMethod,
                      title: name,
                      backIcon: "chevron-left"
                    }
                  })
                }>
                <GridLabelValue theme={theme} textId={"scorm.summary.grade.reported"} value={calculatedGrade}>
                  <FontAwesomeIcon
                    icon="chevron-right"
                    size={theme.textRegular.fontSize}
                    style={{ alignSelf: "center", marginLeft: 8 }}
                    color={theme.textColorSubdued}
                  />
                </GridLabelValue>
              </TouchableOpacity>
              <GridTitle textId={"scorm.summary.attempt.title"} theme={theme} />
              <GridLabelValue
                theme={theme}
                textId={"scorm.summary.attempt.total_attempts"}
                value={maxAttempts || translate("scorm.summary.attempt.unlimited")}
              />
              <GridLabelValue theme={theme} textId={"scorm.summary.attempt.completed_attempts"} value={totalAttempt} />
            </View>
          </ScrollView>
        </View>
        <AttemptController
          shouldAllowNewAttempt={shouldAllowNewAttempt}
          newAttempt={{
            title: translate("scorm.summary.new_attempt"),
            action: () => {
              navigation.addListener("didFocus", onRefresh);
              const attemptNumber = totalAttempt + 1;
              const scormActivityRoute = isDownloaded ? OFFLINE_SCORM_ACTIVITY : WEBVIEW_ACTIVITY;
              navigateTo({
                routeId: scormActivityRoute,
                navigate: navigation.navigate,
                props: {
                  title: name,
                  attempt: attemptNumber,
                  scorm: scormBundle && scormBundle.scorm,
                  backIcon: "chevron-left",
                  uri: launchUrl,
                  backAction: () =>
                    onExitActivityAttempt({
                      id: id,
                      attempt: attemptNumber,
                      gradeMethod: gradeMethod,
                      completionScoreRequired: completionScoreRequired,
                      client,
                      apiKey,
                      host,
                      setIsLoadingCurretStatus,
                      navigation,
                      isDownloaded,
                      offlinePackageScoIdentifiers,
                      navigateTo
                    })
                }
              });
            }
          }}
          lastAttempt={{
            title: translate("scorm.summary.last_attempt"),
            action: () => {
              navigation.addListener("didFocus", onRefresh);
              const attemptNumber = totalAttempt;
              navigateTo({
                routeId: WEBVIEW_ACTIVITY,
                navigate: navigation.navigate,
                props: {
                  title: name,
                  attempt: attemptNumber,
                  scorm: scormBundle && scormBundle.scorm,
                  backIcon: "chevron-left",
                  uri: repeatUrl,
                  backAction: () =>
                    onExitActivityAttempt({
                      id: id,
                      attempt: attemptNumber,
                      gradeMethod: gradeMethod,
                      completionScoreRequired: completionScoreRequired,
                      client,
                      navigation,
                      isDownloaded,
                      offlinePackageScoIdentifiers,
                      navigateTo
                    })
                }
              });
            }
          }}
          shouldAllowLastAttempt={shouldAllowLastAttempt}
        />
      </View>
    </>
  );
};

type PropsAttempt = {
  newAttempt: PropsInfo | undefined;
  lastAttempt: PropsInfo | undefined;
  shouldAllowNewAttempt: boolean;
  shouldAllowLastAttempt: boolean;
};

type PropsInfo = {
  action: any;
  title: string;
};

const AttemptController = ({
  newAttempt,
  lastAttempt,
  shouldAllowNewAttempt,
  shouldAllowLastAttempt
}: PropsAttempt) => {
  return (
    <View style={scormSummaryStyles.attemptContainer}>
      <View style={spacedFlexRow}>
        {lastAttempt && shouldAllowLastAttempt && (
          <SecondaryButton
            text={lastAttempt.title}
            onPress={lastAttempt.action}
            style={{ flex: 1, marginRight: newAttempt ? margins.marginL : 0 }}
          />
        )}

        <PrimaryButton
          text={newAttempt && newAttempt.title}
          onPress={newAttempt && newAttempt.action}
          style={{ flex: 1 }}
          mode={(!shouldAllowNewAttempt && "disabled") || undefined}
        />
      </View>
    </View>
  );
};

export { showScormFeedback, onExitActivityAttempt };
export default ScormSummary;
