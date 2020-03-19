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

import React, { useContext, useEffect, useState }  from "react";
import { Text, View } from "react-native";

import { TertiaryButton} from "@totara/components";
import { ThemeContext, gutter } from "@totara/theme";
import { Scorm } from "@totara/types";

type GradeDetailsProps = {
  scorm: Scorm
}
const  GradeDetails = ({scorm}: GradeDetailsProps) => {
  const [theme] = useContext(ThemeContext);
  const [gradeMethod, setGradeMethod] = useState("Highest attempt grade");
  const [acheivedGrade, setAcheivedGrade] = useState("80");
  const [numberOfAttmept, setNumberOfAttmept] = useState("1");
  const [lastSixAttemptsReport, setLastSixAttemptsReport] = useState([{attempt:7, marks: 84, grade: "pass"}, {attempt:6, marks: 84, grade: "pass"}, {attempt:5, marks: 72, grade: "pass"}, {attempt:4, marks: 35, grade: "fail"}, {attempt:3, marks: 72, grade: "pass"}, {attempt:2, marks: 50, grade: "pass"}, {attempt:1, marks: 30, grade: "fail"}]);
  const totalAttempt = lastSixAttemptsReport ? lastSixAttemptsReport.length : 0;
  return (
    <View style={{ borderRadius: 5, backgroundColor: "#eee", flexDirection: "row", padding: gutter, marginVertical: 8 }} >
      <View style={{flex: 1, paddingHorizontal: 4}}>
        <Text style={theme.textB2}>{gradeMethod}</Text>
        <Text><Text style={theme.textH1}>{acheivedGrade}</Text><Text>%</Text></Text>
        <Text style={theme.textSmall}>In attempt {totalAttempt}</Text>
      </View>
      { totalAttempt > 0 && (
        <View style={{flex: 2, height: 100, padding: 4, flexDirection: "row-reverse"}}>
        { lastSixAttemptsReport && lastSixAttemptsReport.slice(0, 6).map(attemptReport => attemptReport.grade && attemptReport.attempt && attemptReport.marks  && <AttemptGrade attempt={attemptReport.attempt} marks={attemptReport.marks} grade={attemptReport.grade} />)}
        </View>
      )}
  </View>);
};

type AttemptGradeProp = {
  attempt: number,
  marks: number,
  grade: "pass" | "fail" | undefined
};

const AttemptGrade = ({grade, attempt, marks}: AttemptGradeProp) => {
  const [theme] = useContext(ThemeContext);

  return (
    <View style={{justifyContent: "space-between", paddingHorizontal: 4}}>
      <Text style={[theme.textLabel, {color: theme.textColorSubdued, textAlign: "center"}]}>{`${marks}%`}</Text>
      <View style={{width: 8, borderRadius: 4, flex: 1, backgroundColor: theme.colorNeutral3, flexDirection: "column-reverse", alignSelf: "center", marginVertical: 4}}>
        <View style={{width: "100%", height: `${marks}%`, backgroundColor: grade && grade === "fail" ? theme.colorAlert : theme.colorSuccess, borderRadius: 4}}></View>
      </View>
      <Text style={[theme.textLabel, {textAlign: "center"}]}>{attempt}</Text>
    </View>
  )
};
export default GradeDetails;