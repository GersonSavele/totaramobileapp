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
import { Text, View, StyleSheet, FlatList, } from "react-native";
import { Button } from "native-base";

import { ThemeContext, gutter } from "@totara/theme";
import { translate } from "@totara/locale";
import { ScormActivityResult, ScormBundle, Grade } from "@totara/types/Scorm";
import { SafeAreaView } from "react-navigation";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

type Props = {
  scormBundle: ScormBundle,
  onExit: () => void
};


const  SCORMAttempts = ({scormBundle, onExit}: Props) => {

  const [theme] = useContext(ThemeContext);
  const [allAttemptsReport, setAllAttempts] = useState<[ScormActivityResult?]>([]);

  useEffect(()=> {
    let dataAllAttemptsReport: [ScormActivityResult?] = [];
    if (scormBundle && scormBundle.scorm && scormBundle.scorm.attempts) {
      dataAllAttemptsReport = dataAllAttemptsReport.concat(scormBundle.scorm.attempts) as [ScormActivityResult];
    }
    if (scormBundle && scormBundle.offlineActivity && scormBundle.offlineActivity.attempts) {
      dataAllAttemptsReport = dataAllAttemptsReport.concat(scormBundle.offlineActivity.attempts) as [ScormActivityResult];
    } 
    setAllAttempts(dataAllAttemptsReport);
  }, [scormBundle]);

  const attemptReport = (attemptReport: ScormActivityResult, index: number, grademethod: Grade) => {
    return <AttemptReport attemptReport={attemptReport} attempt={index + 1} grademethod={grademethod} />
  };

  return (
    <>
      <View style={[theme.viewContainer, gradesStyle.panel]}>
        <SafeAreaView style={{ backgroundColor: theme.colorSecondary1 }} />
        <View style={[gradesStyle.navigationStyle,{ backgroundColor: theme.colorSecondary1 }]}>
          <View style={gradesStyle.leftContainer}>
            <Button style={gradesStyle.buttonStyle} onPress={onExit}>
              <FontAwesomeIcon icon="times" size={24} />
            </Button>
          </View>
          <Text style={gradesStyle.titleStyle}>{scormBundle.scorm.name}</Text>
          <View style={gradesStyle.rightContainer} />
        </View>
        <Text style={[theme.textH2, gradesStyle.heading]}>{translate("scorm.attempts.title")}</Text>
        <FlatList
          style={{flex: 1}}
          data={allAttemptsReport}
          renderItem={({ item, index }) =>
          {
            return attemptReport( item as ScormActivityResult, index, scormBundle.scorm.grademethod as Grade, scormBundle.scorm.completionscorerequired)
          }
          }
          alwaysBounceVertical={false}
          scrollIndicatorInsets={{right:8}}
          keyExtractor={(item, index) => `${(item as ScormActivityResult).attempt}-${index}`}
        />
        <SafeAreaView forceInset={{ bottom: "always" }} />
      </View>
    </>
  );
  
};

const gradesStyle = StyleSheet.create({
  panel: {
    flex: 1,
    flexDirection: "column",
  },
  navigationStyle :{
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  leftContainer: {
    flex: 1,
    justifyContent: "flex-start",
  },
  rightContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  buttonStyle : {
    backgroundColor: "transparent",
    padding: 20,
    alignSelf:"flex-start"
  },
  titleStyle: {
    fontSize: 16,
    color: "#3D444B",
    fontWeight: "bold",
    textAlign: 'center',
    alignSelf:"center"
  },
  heading: {
    marginVertical: 8,
    paddingHorizontal: gutter, 
  },
});

type AttemptReport = {
  attemptReport: ScormActivityResult,
  attempt: number,
  grademethod: Grade,
};

const AttemptReport = ({attemptReport, attempt, grademethod}: AttemptReport) => {
  
  const [theme] = useContext(ThemeContext);
  
  const calculatedScore = attemptReport.gradereported;
  const formattedScore = (grademethod == Grade.objective) ? calculatedScore.toString() : `${calculatedScore}%`;
  
  return (
    <View style={attemptResult.holder} key={"holder"}>
      <Text style={[theme.textH4, attemptResult.attempt]}>{translate("scorm.attempts.attempt")} {attempt}</Text>
      <View style={attemptResult.result}>
        <Text style={theme.textH4}>{formattedScore}</Text>
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

export default SCORMAttempts;