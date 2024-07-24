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

import { fullFlex } from '@totara/lib/styles/base';
import { SCORM_TEST_IDS } from '@totara/lib/testIds';
import { translate } from '@totara/locale';
import { ThemeContext } from '@totara/theme';
import { fontWeights } from '@totara/theme/constants';
import { scormAttemptsStyles } from '@totara/theme/scorm';
import { TotaraTheme } from '@totara/theme/Theme';
import type { Attempt } from '@totara/types/Scorm';
import { Grade } from '@totara/types/Scorm';
import React, { useContext } from 'react';
import { FlatList, SafeAreaView, Text, View } from 'react-native';

import { useParams } from '@/src/totara/lib/hooks';

const { ATTEMPTS_LIST_ID, ATTEMPT_ITEM_ID } = SCORM_TEST_IDS;

const ScormAttempts = () => {
  const { gradeMethod, attempts } = useParams('ScormAttempts');

  const attemptReport = (attemptReport: Attempt, index: number, gradeMethod: Grade) => {
    return <AttemptReport attemptReport={attemptReport} attempt={index + 1} gradeMethod={gradeMethod} />;
  };

  return (
    <SafeAreaView style={fullFlex}>
      <Text
        style={{
          ...TotaraTheme.textHeadline,
          ...scormAttemptsStyles.sectionTitle
        }}>
        {translate('scorm.attempts.title')}
      </Text>
      <FlatList
        style={{ flex: 1 }}
        data={attempts}
        renderItem={({ item, index }) => {
          return attemptReport(item as Attempt, index, gradeMethod);
        }}
        alwaysBounceVertical={false}
        scrollIndicatorInsets={{ right: 8 }}
        keyExtractor={(item, index) => `${(item as Attempt).attempt}-${index}`}
        testID={ATTEMPTS_LIST_ID}
      />
    </SafeAreaView>
  );
};

type AttemptReport = {
  attemptReport: Attempt;
  attempt: number;
  gradeMethod: Grade;
};

const AttemptReport = ({ attemptReport, attempt, gradeMethod }: AttemptReport) => {
  const theme = useContext(ThemeContext);

  const calculatedScore = attemptReport.gradereported;
  const formattedScore = gradeMethod == Grade.objective ? calculatedScore.toString() : `${calculatedScore}%`;

  return (
    <View style={scormAttemptsStyles.holder} testID={ATTEMPT_ITEM_ID}>
      <Text style={[theme.textRegular, scormAttemptsStyles.attempt]}>
        {translate('scorm.attempts.attempt')} {attempt}
      </Text>
      <View style={scormAttemptsStyles.result}>
        <Text
          style={{
            ...theme.textRegular,
            fontWeight: fontWeights.fontWeightSemiBold
          }}>
          {formattedScore}
        </Text>
      </View>
    </View>
  );
};

export default ScormAttempts;
