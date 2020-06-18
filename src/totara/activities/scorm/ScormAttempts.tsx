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
import { Text, View, StyleSheet, FlatList, SafeAreaView } from "react-native";

import { ThemeContext, gutter, baseSpace } from "@totara/theme";
import { translate } from "@totara/locale";
import { ScormActivityResult, Grade } from "@totara/types/Scorm";
import { NavigationStackProp } from "react-navigation-stack";
import { fullFlex } from "@totara/lib/styles/base";

type AttemptsParams = {
  gradeMethod: Grade;
  attempts: [ScormActivityResult?];
};

type ScormActivityProps = {
  navigation: NavigationStackProp<AttemptsParams>;
};

const ScormAttempts = ({ navigation }: ScormActivityProps) => {
  const { gradeMethod, attempts } = navigation.state.params as AttemptsParams;

  const [theme] = useContext(ThemeContext);

  const attemptReport = (
    attemptReport: ScormActivityResult,
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
        style={[
          theme.textH2,
          { marginVertical: baseSpace, paddingHorizontal: gutter }
        ]}>
        {translate("scorm.attempts.title")}
      </Text>
      <FlatList
        style={{ flex: 1 }}
        data={attempts}
        renderItem={({ item, index }) => {
          return attemptReport(item as ScormActivityResult, index, gradeMethod);
        }}
        alwaysBounceVertical={false}
        scrollIndicatorInsets={{ right: 8 }}
        keyExtractor={(item, index) =>
          `${(item as ScormActivityResult).attempt}-${index}`
        }
      />
    </SafeAreaView>
  );
};

type AttemptReport = {
  attemptReport: ScormActivityResult;
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
    <View style={attemptResult.holder} key={"holder"}>
      <Text style={[theme.textH3, attemptResult.attempt]}>
        {translate("scorm.attempts.attempt")} {attempt}
      </Text>
      <View style={attemptResult.result}>
        <Text style={theme.textH3}>{formattedScore}</Text>
      </View>
    </View>
  );
};

const attemptResult = StyleSheet.create({
  holder: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginVertical: 8,
    paddingHorizontal: gutter
  },
  attempt: {
    flex: 2,
    alignSelf: "center",
    fontWeight: "normal"
  },
  result: {
    flex: 1,
    alignItems: "flex-end"
  }
});

export default ScormAttempts;
