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
import React, { useContext} from "react";
import { StyleSheet, View, Text, Modal, Image, Dimensions } from "react-native";
import SafeAreaView from "react-native-safe-area-view";

import { ThemeContext } from "@totara/theme";
import { PrimaryButton, TertiaryButton } from "@totara/components";
import { translate } from "@totara/locale";

type SCORMFeedbackProps = {
  score?: string, 
  grade?: string, 
  method?: string, 
  onClose: ()=> void, 
  onPrimary: ()=> void
};

const SCORMFeedbackModal = ({score, grade, method, onClose, onPrimary}: SCORMFeedbackProps)=> {
  const [ theme ] = useContext(ThemeContext);
  return (<Modal animationType="slide" transparent>
    <View style={styles.transparentViewStyle}>
      <SafeAreaView />
      <View style={styles.wrapper}>
        <View style={[styles.container, {backgroundColor: theme.colorNeutral1}]}>
          <View style={styles.completion}>
            <View style={[styles.gradeContainer, {borderColor: grade === 'failed' ? theme.colorAlert : theme.colorSuccess}]}> 
              { method && <Image style={styles.completionStatusImage} source={require("@resources/images/success_tick/success_tick.png")} /> }
              { !method && 
              <View style={styles.result}>
                <Text style={[theme.textB3, styles.resultTitle]}>{translate("scorm.feedback.grade_title")}</Text>
                <Text style={[theme.textH2, styles.score]}>{score ? score : ""}</Text>
                <Text style={[theme.textLabel, styles.grade, {color: theme.colorNeutral1, backgroundColor: grade === "failed" ? theme.colorAlert : theme.colorSuccess}]}>{grade ? grade : ""}</Text>
              </View>
              }
            </View>
            <Text style={[theme.textH1, {textAlign: "center", marginTop: 8}]}>{grade === "failed" ? translate("scorm.feedback.sorry") : translate("scorm.feedback.awesome")}</Text>
          </View>
          <View style={{ paddingBottom: 24}}>
            <PrimaryButton onPress={onClose} text={translate("scorm.feedback.back")} style={{marginBottom: 8}} />
            <TertiaryButton onPress={onPrimary} text={translate("scorm.feedback.attempt_again")} style={{marginBottom: 8}} />
          </View>
        </View>
      </View >
      <SafeAreaView />
    </View>
  </Modal>);
};

const styles = StyleSheet.create({
  transparentViewStyle: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)"
  },
  wrapper: {
    flex: 1,
    flexDirection: "row", 
    justifyContent: "space-around"
  },
  container: {
    flex: 1,
    height: Dimensions.get("window").height * 0.7, 
    width: Dimensions.get("window").width * 0.7, 
    borderRadius: 4,
    marginHorizontal: "8%",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-around",
    alignSelf: "center"
  },
  completion : { 
    flex: 1, 
    justifyContent: "center"
  },
  gradeContainer: {
    width: 185, 
    height: 185, 
    borderWidth: 4, 
    borderRadius: 92.5, 
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    padding: 16,
  },
  result: {
    justifyContent: "center", 
    flexDirection: "column", 
    alignItems: "center"
  },
  completionStatusImage: {
    alignSelf: "center",
    height: "50%",
    width: "50%",
    resizeMode: "contain",
  },
  resultTitle: {
    textAlign: "center", 
    fontWeight: "600"
  },
  score: {
    textAlign: "center", 
    marginVertical: 8
  },
  grade: {
    textAlign: "center", 
    borderRadius: 7, 
    height: 14, 
    lineHeight: 14, 
    paddingHorizontal: 16
  }
});

export default SCORMFeedbackModal;