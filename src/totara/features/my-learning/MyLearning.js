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
import { StyleSheet, Text, View } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import PropTypes from 'prop-types';

import { gutter, h1 } from "@totara/theme";
import { translate } from "@totara/locale";
import { TouchableIcon } from "@totara/components";
import LearningItemCarousel from "./LearningItemCarousel";

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
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.myLearningContainer}>
          <View style={styles.myLearningHeader}>
            <View style={styles.notificationContainer}>
              <TouchableIcon icon={"bell"} disabled={false} onPress={() => { }}  />
            </View>
            <Text style={styles.primaryText}> {translate("my-learning.primary_title")} </Text>
            <Text> {translate("my-learning.primary_info", {count: 10})} </Text>
          </View>
          <View style={styles.learningItems}>
            <LearningItemCarousel />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

MyLearning.propTypes = {
  navigation: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  myLearningContainer: {
    flex: 1,
    justifyContent: "center"
  },
  myLearningHeader: {
    flexDirection: "column",
    justifyContent: "space-between",
    padding: gutter
  },
  notificationContainer: {
    height: 40,
    alignItems: "flex-end"
  },
  primaryText: {
    fontSize: h1
  },
  learningItems: {
    flex: 1
  }
});
