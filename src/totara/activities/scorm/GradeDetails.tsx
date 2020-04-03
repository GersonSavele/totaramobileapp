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
import { Text, View, TextStyle } from "react-native";

import { ThemeContext, gutter } from "@totara/theme";
import { Scorm } from "@totara/types";
import { getGradesReport } from "./offline";
import { translate } from "@totara/locale";

type Props = {
  scorm: Scorm,
  limit?: number,
};

type AttemptGrade = {
  attempt: number, 
  scoreRaw: string, 
  scoreMax: string, 
  lessonStatus?: string
};

const  GradeDetails = ({scorm, limit}: Props) => {
  const [theme] = useContext(ThemeContext);
  const [gradeMethod, setGradeMethod] = useState<string>();
  const [acheivedGrade, setAcheivedGrade] = useState<string>();
  const [attemptsGradeReport, setAttemptsGradeReport] = useState<[AttemptGrade]>();
  
  useEffect(()=> {
    setGradeMethod("Highest attempt grade");
    setAcheivedGrade("80");
    if (scorm.id) {
      getGradesReport(scorm.id).then(offlineActivityReport => {
        if (offlineActivityReport && offlineActivityReport.length) {
          setAttemptsGradeReport(offlineActivityReport as [AttemptGrade]);
        } else {
          setAttemptsGradeReport(undefined);
        }
      });
    }
  }, [scorm.id]);



  const getRemainBars = (maxBars: number, attemptCurrent: number, attemptsMax?: number) => {
    if(attemptCurrent < maxBars) {
      let bars = [];
      const activeBars = attemptsMax ? attemptsMax : maxBars;
      for (let tmpAttempt =  attemptCurrent + 1; tmpAttempt <= maxBars; tmpAttempt++) {
        bars.push(<AttemptGrade attempt={tmpAttempt} activebars={activeBars} score={"0%"} key={tmpAttempt} />);
      }
      return bars;
    }
    return null;
  }
  const remainBars = getRemainBars(limit, scorm.attemptsCurrent, scorm.attemptsMax);

  if (limit) {
    return (
      <View style={{ borderRadius: 5, backgroundColor: "#eee", flexDirection: "row", padding: gutter, marginVertical: 8, justifyContent: "space-between" }} >
        <View style={{flex: 1, paddingHorizontal: 4}}>
          <Text style={theme.textB2}>{translate("scorm.summary.grade.reported")}</Text>
          <Text style={theme.textH1}>{scorm.calculatedGrade}</Text>
          <Text style={theme.textSmall}>{translate("scorm.summary.grade.in_attempt")} {scorm.attemptsCurrent ? scorm.attemptsCurrent : "0"}</Text>
        </View>
        <View style={{flex: 2, height: 100, padding: 4, flexDirection: "row-reverse"}}>
          <View style={{flexDirection: "row"}}>
          { scorm.attemptsCurrent > 0 && attemptsGradeReport && attemptsGradeReport.slice(0, limit).map((attemptReport, attemptIndex) => attemptReport.attempt  && attemptReport.scoreRaw  && <AttemptGrade attempt={attemptReport.attempt} score={`${((attemptReport.scoreRaw/(attemptReport.scoreMax ? attemptReport.scoreMax : 100)) * 100)}%`} grade={attemptReport.lessonStatus} activebars={limit} key={attemptIndex} />)}
          { remainBars }
          </View>
        </View>
    </View>);
  } else {
    return (
      <View style={{ borderRadius: 5, backgroundColor: "#eee", flexDirection: "row", padding: gutter, marginVertical: 8, justifyContent: "space-between" }} >
        <View style={{flex: 1, paddingHorizontal: 4}}>
          <Text style={theme.textB2}>{translate("scorm.summary.grade.reported")}</Text>
          <Text style={theme.textH1}>{scorm.calculatedGrade}</Text>
          <Text style={theme.textSmall}>{translate("scorm.summary.grade.in_attempt")} {scorm.attemptsCurrent ? scorm.attemptsCurrent : "0"}</Text>
        </View>
        <View style={{flex: 2, height: 100, padding: 4, flexDirection: "row-reverse"}}>
          <View style={{flexDirection: "row"}}>
          { scorm.attemptsCurrent > 0 && attemptsGradeReport && attemptsGradeReport.map((attemptReport, attemptIndex) => attemptReport.attempt  && attemptReport.scoreRaw  && <AttemptGrade attempt={attemptReport.attempt} score={attemptReport.scoreRaw} grade={attemptReport.lessonStatus} activebars={limit} key={attemptIndex} />)}
          </View>
        </View>
    </View>);
  }
  
};

type AttemptGradeBarProp = {
  attempt: number,
  activebars: number,
  score?: string,
  grade?: string
};

const AttemptGrade = ({attempt, activebars, score, grade}: AttemptGradeBarProp) => {
  const [theme] = useContext(ThemeContext);
  const styleTextBar: TextStyle = {textAlign: "center", color: attempt <= activebars ? theme.textColorDark : theme.textColorDisabled };
  return (
    <View style={{justifyContent: "space-between", paddingHorizontal: 4}}>
      <Text style={[theme.textLabel, styleTextBar]}>{score}</Text>
      <View style={{width: 8, borderRadius: 4, flex: 1, backgroundColor: theme.colorNeutral3, flexDirection: "column-reverse", alignSelf: "center", marginVertical: 4}}>
        <View style={{width: "100%", height: score, backgroundColor: grade && grade === "failed" ? theme.colorAlert : theme.colorSuccess, borderRadius: 4}}></View>
      </View>
      <Text style={[theme.textLabel, styleTextBar]}>{attempt}</Text>
    </View>
  )
};


export default GradeDetails;