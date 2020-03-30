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

import { ThemeContext, gutter } from "@totara/theme";
import { Scorm } from "@totara/types";
import { getGradesReport } from "./offline";

const  GradeDetails = (scorm: Scorm) => {
  const [theme] = useContext(ThemeContext);
  const [gradeMethod, setGradeMethod] = useState<string>();
  const [acheivedGrade, setAcheivedGrade] = useState<string>();
  const [offlineAttemptsReport, setOfflineAttemptsReport] = useState<[AttemptGradeProp]>();
  
  useEffect(()=> {
    setGradeMethod("Highest attempt grade");
    setAcheivedGrade("80");
    if (scorm.id) {
      getGradesReport(scorm.id).then(offlineActivityReport => {
        if (offlineActivityReport && offlineActivityReport.length) {
          setOfflineAttemptsReport(offlineActivityReport as [AttemptGradeProp]);
        } else {
          setOfflineAttemptsReport(undefined);
        }
      });
    }
  }, [scorm.id]);

  const totalOfflineAttempts = offlineAttemptsReport !== undefined ? offlineAttemptsReport.length : 0;

  return (
    <View style={{ borderRadius: 5, backgroundColor: "#eee", flexDirection: "row", padding: gutter, marginVertical: 8 }} >
      <View style={{flex: 1, paddingHorizontal: 4}}>
        <Text style={theme.textB2}>{gradeMethod}</Text>
        <Text><Text style={theme.textH1}>{acheivedGrade}</Text><Text>%</Text></Text>
        <Text style={theme.textSmall}>In attempt {totalOfflineAttempts}</Text>
      </View>
      { totalOfflineAttempts > 0 && (
        <View style={{flex: 2, height: 100, padding: 4, flexDirection: "row-reverse"}}>
        { totalOfflineAttempts > 0 && offlineAttemptsReport && offlineAttemptsReport.slice(Math.max(totalOfflineAttempts - 6, 0)).map(attemptReport => attemptReport.attempt  && attemptReport.grade  && attemptReport.score  && <AttemptGrade attempt={attemptReport.attempt} score={attemptReport.score} grade={attemptReport.grade} />)}
        </View>
      )}
  </View>);
};

type AttemptGradeProp = {
  attempt: number,
  score: number,
  grade: "pass" | "failed" | undefined
};

const AttemptGrade = ({grade, attempt, score: marks}: AttemptGradeProp) => {
  const [theme] = useContext(ThemeContext);

  return (
    <View style={{justifyContent: "space-between", paddingHorizontal: 4}}>
      <Text style={[theme.textLabel, {color: theme.textColorSubdued, textAlign: "center"}]}>{`${marks}%`}</Text>
      <View style={{width: 8, borderRadius: 4, flex: 1, backgroundColor: theme.colorNeutral3, flexDirection: "column-reverse", alignSelf: "center", marginVertical: 4}}>
        <View style={{width: "100%", height: `${marks}%`, backgroundColor: grade && grade === "failed" ? theme.colorAlert : theme.colorSuccess, borderRadius: 4}}></View>
      </View>
      <Text style={[theme.textLabel, {textAlign: "center"}]}>{attempt}</Text>
    </View>
  )
};
export default GradeDetails;