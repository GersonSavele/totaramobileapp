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

import { NetworkStatus as ApolloNetworkStatus } from '@apollo/client';
import { Button, Loading, LoadingError, MessageBar, NetworkStatusIndicator } from '@totara/components';
import Icon from '@totara/components/Icon';
import { DATE_FORMAT_FULL } from '@totara/lib/constants';
import { navigateTo, NAVIGATION } from '@totara/lib/navigation';
import { spacedFlexRow } from '@totara/lib/styles/base';
import { SCORM_TEST_IDS } from '@totara/lib/testIds';
import { showConfirmation } from '@totara/lib/tools';
import { translate } from '@totara/locale';
import { gutter } from '@totara/theme';
import { margins } from '@totara/theme/constants';
import { scormSummaryStyles } from '@totara/theme/scorm';
import type { AppliedTheme } from '@totara/theme/Theme';
import { TotaraTheme } from '@totara/theme/Theme';
import type { ScormBundle } from '@totara/types/Scorm';
import { Grade } from '@totara/types/Scorm';
import { get, isEmpty } from 'lodash';
import type { ReactNode } from 'react';
import React, { useState } from 'react';
import type { TextStyle } from 'react-native';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { fetchLastAttemptResult } from './api';
import {
  getOfflineLastActivityResult,
  retrieveAllData,
  saveInTheCache,
  setCompletedScormAttempt
} from './storageUtils';
import { getDataForScormSummary } from './utils';

const { SCORM_ACTIVITY, OFFLINE_SCORM_ACTIVITY, SCORM_ATTEMPTS, SCORM_FEEDBACK, WEBVIEW_ACTIVITY } = NAVIGATION;

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

const gridStyle = (theme: AppliedTheme) => [theme.textRegular, { color: theme.colorNeutral6 }];

type GridLabelProps = {
  theme: AppliedTheme;
  textId: string;
  value: string;
  children?: ReactNode;
};

const GridLabelValue = ({ theme, textId, value, children }: GridLabelProps) => (
  <View style={scormSummaryStyles.sectionField}>
    <Text style={theme.textRegular}>{translate(textId)}</Text>
    <View style={{ flexDirection: 'row' }}>
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

type OnExitActivityAttemptProps = {
  id: string;
  attempt: number;
  gradeMethod?: Grade;
  showGrades: boolean;
  completionScoreRequired?: number;
  client: any;
  apiKey?: string;
  host?: string;
  setIsLoadingCurrentStatus?: Function;
  navigation: any;
  isDownloaded: boolean;
  offlinePackageScoIdentifiers?: [string];
  navigateTo: Function;
  onRefresh: () => void;
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
  showGrades,
  completionScoreRequired,
  navigate,
  navigateTo
}: {
  gradeMethod: Grade;
  showGrades: boolean;
  score: number;
  completionScoreRequired?: number;
  navigate: Function;
  navigateTo: Function;
}) => {
  const goToSummary = () => navigate({ routeName: SCORM_ACTIVITY });
  navigateTo({
    routeId: SCORM_FEEDBACK,
    navigate: navigate,
    props: {
      gradeMethod,
      completionScoreRequired,
      score,
      showGrades,
      onClose: goToSummary
    }
  });
};

const onExitActivityAttempt = ({
  id,
  attempt,
  gradeMethod = Grade.objective,
  showGrades,
  apiKey,
  completionScoreRequired,
  client,
  host,
  setIsLoadingCurrentStatus,
  navigation,
  isDownloaded,
  offlinePackageScoIdentifiers,
  navigateTo,
  onRefresh
}: OnExitActivityAttemptProps) => {
  showConfirmation({
    title: translate('scorm.confirmation.title'),
    message: translate('scorm.confirmation.message'),
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
            showGrades,
            completionScoreRequired,
            score: existingLastAttempt.gradereported,
            navigate: navigation.navigate,
            navigateTo
          });
        }
      } else {
        if (apiKey && host) {
          setIsLoadingCurrentStatus && setIsLoadingCurrentStatus(true);
          fetchLastAttemptResult({
            scormId: id,
            apiKey,
            host
          })
            .then(response => {
              const status = get(response, 'data.status');
              if (status) {
                const { attemptsCurrent, gradefinal } = status;
                if (attemptsCurrent >= attempt) {
                  showScormFeedback({
                    gradeMethod,
                    showGrades,
                    completionScoreRequired,
                    score: gradefinal,
                    navigate: navigation.navigate,
                    navigateTo
                  });
                  onRefresh();
                }
              }
            })
            .catch(e => console.log('Error: ', e))
            .finally(() => {
              setIsLoadingCurrentStatus && setIsLoadingCurrentStatus(false);
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
  const [isLoadingCurrentStatus, setIsLoadingCurrentStatus] = useState(loading);
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
    offlinePackageScoIdentifiers,
    showGrades
  } = bundleData;
  if (isLoadingCurrentStatus) {
    return <Loading testID={'summary_loading'} />;
  }
  if (!scormBundle && error) {
    return <LoadingError onRefreshTap={onRefresh} testID={'summary_error'} error={error} />;
  }
  return (
    <>
      <View style={scormSummaryStyles.expanded} testID={'scorm_summary_container'}>
        <NetworkStatusIndicator />
        {maxAttempts && maxAttempts <= totalAttempt && (
          <MessageBar mode={'alert'} text={translate('scorm.info_completed_attempts')} icon={'exclamation-circle'} />
        )}
        {timeOpen && (
          <MessageBar
            mode={'alert'}
            text={`${translate('scorm.info_upcoming_activity')} ${timeOpen.format(DATE_FORMAT_FULL)}`}
            icon={'exclamation-circle'}
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
                  <GridTitle textId={'scorm.summary.summary'} theme={theme} style={{ paddingTop: 0 }} />
                  <Text style={TotaraTheme.textRegular}>{description}</Text>
                </>
              )}
              {showGrades && (
                <>
                  <GridTitle textId={'scorm.summary.grade.title'} theme={theme} />
                  <GridLabelValue
                    theme={theme}
                    textId={'scorm.summary.grade.method'}
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
                          backIcon: 'chevron-left'
                        }
                      })
                    }
                    disabled={isEmpty(attempts)}
                    testID={SCORM_TEST_IDS.BUTTON_VIEW_ATTEMPTS}>
                    <GridLabelValue theme={theme} textId={'scorm.summary.grade.reported'} value={calculatedGrade}>
                      {!isEmpty(attempts) && (
                        <Icon
                          name="chevron-right"
                          color={theme.colorNeutral6}
                          size={theme.textRegular.fontSize}
                          style={scormSummaryStyles.sectionArrow}
                        />
                      )}
                    </GridLabelValue>
                  </TouchableOpacity>
                </>
              )}
              <GridTitle textId={'scorm.summary.attempt.title'} theme={theme} />
              <GridLabelValue
                theme={theme}
                textId={'scorm.summary.attempt.total_attempts'}
                value={maxAttempts || translate('scorm.summary.attempt.unlimited')}
              />
              <GridLabelValue theme={theme} textId={'scorm.summary.attempt.completed_attempts'} value={totalAttempt} />
            </View>
          </ScrollView>
        </View>
        <AttemptController
          shouldAllowNewAttempt={shouldAllowNewAttempt}
          newAttempt={{
            title: translate('scorm.summary.new_attempt'),
            action: () => {
              navigation.addListener('didFocus', onRefresh);
              const attemptNumber = totalAttempt + 1;
              const scormActivityRoute = isDownloaded ? OFFLINE_SCORM_ACTIVITY : WEBVIEW_ACTIVITY;
              navigateTo({
                routeId: scormActivityRoute,
                navigate: navigation.navigate,
                props: {
                  title: name,
                  attempt: attemptNumber,
                  scorm: scormBundle && scormBundle.scorm,
                  backIcon: 'chevron-left',
                  uri: launchUrl,
                  backAction: () =>
                    onExitActivityAttempt({
                      id: id,
                      attempt: attemptNumber,
                      gradeMethod: gradeMethod,
                      showGrades: showGrades,
                      completionScoreRequired: completionScoreRequired,
                      client,
                      apiKey,
                      host,
                      setIsLoadingCurrentStatus,
                      navigation,
                      isDownloaded,
                      offlinePackageScoIdentifiers,
                      navigateTo,
                      onRefresh
                    })
                }
              });
            }
          }}
          lastAttempt={{
            title: translate('scorm.summary.last_attempt'),
            action: () => {
              navigation.addListener('didFocus', onRefresh);
              const attemptNumber = totalAttempt;
              navigateTo({
                routeId: WEBVIEW_ACTIVITY,
                navigate: navigation.navigate,
                props: {
                  title: name,
                  attempt: attemptNumber,
                  scorm: scormBundle && scormBundle.scorm,
                  backIcon: 'chevron-left',
                  uri: repeatUrl,
                  backAction: () =>
                    onExitActivityAttempt({
                      id: id,
                      attempt: attemptNumber,
                      gradeMethod: gradeMethod,
                      showGrades,
                      completionScoreRequired: completionScoreRequired,
                      client,
                      navigation,
                      isDownloaded,
                      offlinePackageScoIdentifiers,
                      navigateTo,
                      onRefresh
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
          <Button
            variant="secondary"
            text={lastAttempt.title}
            onPress={lastAttempt.action}
            style={{ flex: 1, marginRight: newAttempt ? margins.marginL : 0 }}
            testID={SCORM_TEST_IDS.LAST_ATTEMPT}
          />
        )}

        <Button
          variant="primary"
          text={newAttempt && newAttempt.title}
          onPress={newAttempt && newAttempt.action}
          style={{ flex: 1 }}
          mode={(!shouldAllowNewAttempt && 'disabled') || undefined}
          testID={SCORM_TEST_IDS.NEW_ATTEMPT}
        />
      </View>
    </View>
  );
};

export { onExitActivityAttempt, showScormFeedback };
export default ScormSummary;
