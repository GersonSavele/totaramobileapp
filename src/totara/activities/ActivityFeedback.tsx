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
import { StyleSheet, View, Text, Modal, Image, Dimensions, ImageBackground } from "react-native";
import SafeAreaView from "react-native-safe-area-view";

import { ActivityType } from "@totara/types";
import { resizeByScreenSize, ThemeContext, normalize } from "@totara/theme";
import { PrimaryButton, TertiaryButton } from "@totara/components";

 type Props = {
   activity: ActivityType,
   onClose: () => void
 }
 const styles = StyleSheet.create({
  transparentViewStyle: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)"
  },
  containerStyle: {
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
  gradeContainer: {
    width: Dimensions.get("window").width * 0.7 * 0.6, 
    height: Dimensions.get("window").width * 0.7 * 0.6, 
    borderWidth: 4, 
    borderRadius: Dimensions.get("window").width * 0.7 * 0.6 * 0.5, 
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    padding: 8,
  },
  completionStatusImage: {
    alignSelf: "center",
    height: "50%",
    width: "50%",
    resizeMode: "contain",
  },
  grade: {
    textAlign: "center", 
    borderRadius: 7, 
    height: 14, 
    lineHeight: 14, 
    paddingHorizontal: 16
  }
});
const ActivityFeedback = ({activity, onClose}: Props) => {

  const [ theme ] = useContext(ThemeContext);

  return (<Modal animationType="slide" transparent>
    <View style={styles.transparentViewStyle}>
      <SafeAreaView />
      <View style={{flexDirection: "row", justifyContent: "space-around", flex: 1}}>
        <View style={[styles.containerStyle, {backgroundColor: theme.colorNeutral1}]}>
          <View  style={{ flex: 1, justifyContent: "center"}}>
            <View style={[styles.gradeContainer, {borderColor: theme.colorSuccess}]}> 
              { !activity.completionstatus && <Image style={styles.completionStatusImage} source={require("@resources/images/success_tick/success_tick.png")} /> }
              <Text style={[theme.textB3, {textAlign: "center", fontWeight: "600"}]}>YOUR LAST ATTEMPT GRADE</Text>
              <Text style={[theme.textH2, {textAlign: "center", marginVertical: 8}]}>80%</Text>
              <Text style={[theme.textLabel, styles.grade, {color: theme.colorNeutral1, backgroundColor: theme.colorAlert}]}>Failed</Text>
            </View>
            <Text style={[theme.textH1,]}>Awesome!</Text>
          </View>
          <View style={{ paddingBottom: 24}}>
            <PrimaryButton onPress={onClose} text={"Back to course"} style={{marginBottom: 8}} />
            <TertiaryButton onPress={onClose} text={"Attempt again"} style={{marginBottom: 8}} />
          </View>
        </View>
      </View >
      <SafeAreaView />
    </View>
  </Modal>);
}

export default ActivityFeedback;

