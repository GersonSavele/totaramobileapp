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

import React from "react";
import {
  ScrollView,
  Text,
  View,
  TextStyle,
  TouchableOpacity,
  RefreshControl
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  MessageBar,
  NetworkStatus,
  LoadingError,
  MoreText,
  PrimaryButton,
  SecondaryButton
} from "@totara/components";
import { gutter } from "@totara/theme";
import { translate } from "@totara/locale";
import { AppliedTheme, TotaraTheme } from "@totara/theme/Theme";
import { scormSummaryStyles } from "@totara/theme/scorm";
import { NetworkStatus as ApolloNetworkStatus } from "apollo-boost";
import {
  getDataForScormSummary,
  setCompletedScormAttempt,
  getOfflineLastActivityResult,
  shouldAllowAttempt
} from "./utils";
import { navigateTo } from "@totara/lib/navigation";
import {
  DATE_FORMAT_FULL,
  NAVIGATION_OFFLINE_SCORM_ACTIVITY,
  NAVIGATION_SCORM_ATTEMPTS,
  NAVIGATION_SCORM_FEEDBACK
} from "@totara/lib/constants";
import { ScormBundle, Grade } from "@totara/types/Scorm";
import { spacedFlexRow } from "@totara/lib/styles/base";
import { showConfirmation } from "@totara/lib/tools";
import { margins } from "@totara/theme/constants";

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
  onRefresh: Function;
};

const gridStyle = (theme: AppliedTheme) => [
  theme.textRegular,
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

const ScormSummary = ({
  id,
  error,
  networkStatus,
  scormBundle,
  navigation,
  isDownloaded,
  client,
  onRefresh
}: SummaryProps) => {
  const theme = TotaraTheme;

  const bundleData = getDataForScormSummary(true, scormBundle);
  const {
    name,
    description,
    totalAttempt,
    attemptGrade,
    gradeMethod,
    calculatedGrade,
    completionScoreRequired,
    // actionSecondary, //TODO - will be enable for online
    timeOpen,
    maxAttempts,
    attempts
  } = bundleData;

  const onExitActivityAttempt = ({
    id,
    attempt,
    gradeMethod = Grade.objective,
    completionScoreRequired = undefined,
    client
  }: {
    id: string;
    attempt: number;
    gradeMethod?: Grade;
    completionScoreRequired?: number;
    client: any;
  }) => {
    showConfirmation({
      title: translate("scorm.confirmation.title"),
      message: translate("scorm.confirmation.message"),
      callback: () => {
        const existingLastAttempt = getOfflineLastActivityResult({
          scormId: id,
          client
        });
        navigation.pop();
        if (
          existingLastAttempt &&
          existingLastAttempt.attempt &&
          parseInt(existingLastAttempt.attempt) === attempt
        ) {
          setCompletedScormAttempt({ scormId: id, attempt, client });
          navigateTo({
            routeId: NAVIGATION_SCORM_FEEDBACK,
            navigate: navigation.navigate,
            props: {
              id,
              attempt,
              gradeMethod,
              completionScoreRequired,
              score: existingLastAttempt.gradereported
            }
          });
        }
      }
    });
    // This is the for the BackHandler callback that is calling this function
    return true;
  };
  if (error) {
    return <LoadingError onRefreshTap={onRefresh} />;
  }
  return (
    <>
      <View style={scormSummaryStyles.expanded}>
        <NetworkStatus />
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
                refreshing={networkStatus === ApolloNetworkStatus.refetch}
                onRefresh={onRefresh}
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
                  <MoreText
                    longText={description}
                    style={TotaraTheme.textMedium}
                  />
                </>
              )}
              <GridTitle textId={"scorm.summary.grade.title"} theme={theme} />
              <GridLabelValue
                theme={theme}
                textId={"scorm.summary.grade.method"}
                value={
                  attemptGrade &&
                  translate(`scorm.grading_method.${attemptGrade}`)
                }
              />
              <TouchableOpacity
                onPress={() =>
                  navigateTo({
                    routeId: NAVIGATION_SCORM_ATTEMPTS,
                    navigate: navigation.navigate,
                    props: {
                      attempts,
                      gradeMethod,
                      title: name,
                      backIcon: "chevron-left"
                    }
                  })
                }>
                <GridLabelValue
                  theme={theme}
                  textId={"scorm.summary.grade.reported"}
                  value={calculatedGrade}>
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
        <AttemptController
          isDownloaded={shouldAllowAttempt(bundleData) && isDownloaded}
          primary={{
            title: translate("scorm.summary.new_attempt"),
            action: () => {
              navigation.addListener("didFocus", onRefresh);
              const attemptNumber = totalAttempt + 1;
              navigateTo({
                routeId: NAVIGATION_OFFLINE_SCORM_ACTIVITY,
                navigate: navigation.navigate,
                props: {
                  title: name,
                  attempt: attemptNumber,
                  scorm: scormBundle && scormBundle.scorm,
                  backIcon: "chevron-left",
                  backAction: () =>
                    onExitActivityAttempt({
                      id: id,
                      attempt: attemptNumber,
                      gradeMethod: gradeMethod,
                      completionScoreRequired: completionScoreRequired,
                      client
                    })
                }
              });
            }
          }}
          //TODO - Will be fixed after enable online
          /*
            secondary={
              (actionSecondary && {
                title: translate("scorm.summary.last_attempt"),
                action: onTapContinueLastAttempt({
                  scormBundle,
                  // TODO: change the way online works
                  isUserOnline: false,
                  callback: () => {
                    navigateTo({
                      routeId: NAVIGATION_OFFLINE_SCORM_ACTIVITY,
                      navigate: navigation.navigate,
                      props: {
                        scormBundle,
                        attempt:
                          scormBundle &&
                          scormBundle.scorm &&
                          scormBundle.scorm.attemptsCurrent
                      }
                    });
                  }
                })
              }) ||
              undefined
            }
            */
        />
      </View>
    </>
  );
};

type PropsAttempt = {
  primary: PropsInfo | undefined;
  secondary: PropsInfo | undefined;
  isDownloaded: boolean;
};

type PropsInfo = {
  action: any;
  title: string;
};

const AttemptController = ({
  primary,
  secondary,
  isDownloaded
}: PropsAttempt) => {
  return (
    <View style={scormSummaryStyles.attemptContainer}>
      <View style={spacedFlexRow}>
        {secondary && (
          <SecondaryButton
            text={secondary.title}
            onPress={secondary.action}
            style={{ flex: 1, marginRight: primary ? margins.marginL : 0 }}
          />
        )}

        <PrimaryButton
          text={primary && primary.title}
          onPress={primary && primary.action}
          style={{ flex: 1 }}
          mode={(!(primary && isDownloaded) && "disabled") || undefined}
        />
      </View>
    </View>
  );
};

export default ScormSummary;
