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

import React, { useContext } from "react";
import { Text, View, FlatList, SafeAreaView } from "react-native";

import { ThemeContext } from "@totara/theme";
import { translate } from "@totara/locale";
import { Attempt, Grade } from "@totara/types/Scorm";
import { NavigationStackProp } from "react-navigation-stack";
import { fullFlex } from "@totara/lib/styles/base";
import { scormAttemptsStyles } from "@totara/theme/scorm";
import { fontWeights } from "@totara/theme/constants";
import { TotaraTheme } from "@totara/theme/Theme";
import { SCORM_TEST_IDS } from "./constants";

type AttemptsParams = {
  gradeMethod: Grade;
  attempts: [Attempt?];
};

type ScormActivityProps = {
  navigation: NavigationStackProp<AttemptsParams>;
};

const { ATTEMPTS_LIST_ID, ATTEMPT_ITEM_ID } = SCORM_TEST_IDS;

const ScormAttempts = ({ navigation }: ScormActivityProps) => {
  const { gradeMethod, attempts } = navigation.state.params as AttemptsParams;

  const attemptReport = (
    attemptReport: Attempt,
    index: number,
    gradeMethod: Grade
  ) => {
    return (
      <AttemptReport
        attemptReport={attemptReport}
        attempt={index + 1}
        gradeMethod={gradeMethod}
      />
    );
  };

  return (
    <SafeAreaView style={fullFlex}>
      <Text
        style={{
          ...TotaraTheme.textHeadline,
          ...scormAttemptsStyles.sectionTitle
        }}>
        {translate("scorm.attempts.title")}
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

const AttemptReport = ({
  attemptReport,
  attempt,
  gradeMethod
}: AttemptReport) => {
  const [theme] = useContext(ThemeContext);

  const calculatedScore = attemptReport.gradereported;
  const formattedScore =
    gradeMethod == Grade.objective
      ? calculatedScore.toString()
      : `${calculatedScore}%`;

  return (
    <View style={scormAttemptsStyles.holder} testID={ATTEMPT_ITEM_ID}>
      <Text style={[theme.textRegular, scormAttemptsStyles.attempt]}>
        {translate("scorm.attempts.attempt")} {attempt}
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
