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
 * @author Jun Yamog <jun.yamog@totaralearning.com
 *
 */

import React from "react";
import {Image, StyleSheet, Text, View} from "react-native";
import PropTypes from 'prop-types';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";

import {gutter, h1, resizeByScreenSize} from "@totara/theme";
import LearningItemCarousel from "./LearningItemCarousel";
import {ActivitySheetConsumer, ActivityLauncher} from "@totara/components";
import {translate} from "@totara/locale";

export default class MyLearning extends React.Component {

  static navigationOptions = {
    headerTitle: null,
    headerStyle: {
      height: 0,
      borderBottomWidth: 0,
      backgroundColor: "#FFFFFF",
    }
  };

  render() {
    const activity = { // TODO mock activity, put into graphql
      id: 1,
      itemName: "Totara Learn for beginners",
      type: "video",
      progressPercentage: 55,
      summary: "Users are the people who are going to interact with your Totara Learn system; whether they are learners, " +
        "managers, trainers,administrators or something in between. So it’s easy to understand why you want to add users to your LMS. But how do you go about doing so? You’ve got two main options you’re likely to use. You can create users manually, or you can create multiple users at the same time using HR Import. In this course, you’ll learn how to do both.",
      imgSrc: "panel2.png"
    };

    return (
        <View style={styles.myLearningContainer}>
          <View style={styles.myLearningLogo}>
            <Image source={require("./totara_logo.png")} style={{width:81, height: 20}}/>
          </View>
          <View style={styles.myLearningHeader}>
          <Text style={styles.myLearningHeaderText}>{translate("my-learning.primary_title")}</Text>
            <FontAwesomeIcon icon="list-ul" size={20}/>
          </View>
          <View style={styles.learningItems}>
            <LearningItemCarousel/>
          </View>
          <View style={styles.recentActivity}>
            <ActivitySheetConsumer>
              {({setCurrentActivity}) =>
                <ActivityLauncher item={activity} onPress={(activity) => setCurrentActivity(activity)}/>
              }
            </ActivitySheetConsumer>
          </View>
        </View>
    );
  }
}

MyLearning.propTypes = {
  navigation: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  myLearningContainer: {
    flex: 1,
    justifyContent: "center",
  },
  myLearningLogo: {
    flexDirection: 'row',
    height: resizeByScreenSize(40, 48, 56, 64),
    paddingHorizontal: gutter,
    backgroundColor: "#FFFFFF",
    alignItems: 'center'
  },
  myLearningHeader: {
    height: resizeByScreenSize(40, 48, 64, 64),
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: gutter,
    paddingLeft: gutter,
  },
  myLearningHeaderText: {
    fontSize: h1,
  },
  topnavicon: {
    paddingLeft: 10,
  },
  learningItems: {
    flex: 1,
  },
  recentActivity: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#F0F0F0",
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 8,
    overflow: "hidden",
  },
  activity: {
    flex: 1,
    marginTop: 10,
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
    borderWidth: 1,
    margin: 0,
    backgroundColor: "#FFFFFF",
    borderColor: "#CCCCCC",
    width: wp("80%")
  },
  navigation: {
    paddingBottom: 20,
    width: wp("100%"),
    height: hp("10%")
  },
});
