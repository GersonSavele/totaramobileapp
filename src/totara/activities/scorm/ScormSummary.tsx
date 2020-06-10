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
  onTapViewAllAttempts,
  onTapContinueLastAttempt,
  shouldShowAction
} from "@totara/lib/scorm";
import { navigateTo } from "@totara/lib/navigation";
import {
  DATE_FORMAT_FULL,
  NAVIGATION_OFFLINE_SCORM_ACTIVITY
} from "@totara/lib/constants";
import { ScormBundle } from "@totara/types/Scorm";
import { spacedFlexRow } from "@totara/lib/styles/base";

type SummaryProps = {
  id: string;
  name: string;
  error: any;
  refetch: any;
  loading: boolean;
  networkStatus: any;
  scormBundle: ScormBundle | undefined;
  navigation: any;
  isDownloaded: boolean;
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

const ScormSummary = ({
  error,
  refetch,
  networkStatus,
  scormBundle,
  navigation,
  isDownloaded
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
    actionPrimary,
    actionSecondary,
    timeOpen,
    maxAttempts,
    attempts
  } = bundleData;

  if (error) {
    return <LoadingError onRefreshTap={refetch} />;
  }
  return (
    <>
      <View style={scormSummaryStyles.expanded}>
        <NetworkStatus />
        {/* TODO: review this */}
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
                value={
                  attemptGrade &&
                  translate(`scorm.grading_method.${attemptGrade}`)
                }
              />
              <TouchableOpacity
                onPress={onTapViewAllAttempts({
                  scormBundle,
                  callback: () => {
                    navigateTo({
                      routeId: "ScormAttemps",
                      navigate: navigation.navigate,
                      props: {
                        attempts,
                        gradeMethod,
                        title: name
                      }
                    });
                  }
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
        {shouldShowAction(bundleData) && isDownloaded && (
          <AttemptController
            primary={
              (actionPrimary && {
                title: translate("scorm.summary.new_attempt"),
                action: () => {
                  if (scormBundle && scormBundle.scorm) {
                    const attemptNumber =
                      (scormBundle.scorm &&
                        scormBundle.scorm.attempts &&
                        scormBundle.scorm.attempts.length + 1) ||
                      1;
                    navigateTo({
                      routeId: NAVIGATION_OFFLINE_SCORM_ACTIVITY,
                      navigate: navigation.navigate,
                      props: {
                        attempt: attemptNumber,
                        scorm: scormBundle.scorm
                      }
                    });
                  }
                }
              }) ||
              undefined
            }
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
        )}
      </View>
    </>
  );
};

type PropsAttempt = {
  primary: PropsInfo | undefined;
  secondary: PropsInfo | undefined;
};

type PropsInfo = {
  title: string;
  action: any;
};

const AttemptController = ({ primary, secondary }: PropsAttempt) => {
  return (
    <View style={scormSummaryStyles.attemptContainer}>
      <View style={spacedFlexRow}>
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
