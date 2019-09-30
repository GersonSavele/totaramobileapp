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

import { gutter, h1 } from "@totara/theme";
import { translate } from "@totara/locale";
import LearningItemCarousel from "./LearningItemCarousel";
import { learningItemsList } from "./api";
import { Log } from "@totara/lib";
import { ErrorFeedbackModal } from "@totara/components";
import NoCurrentLearning from "./NoCurrentLearning";

const MyLearning = learningItemsList(({loading, currentLearning, error}) => {
  if (error) {
    Log.error("Error getting course details", error);
    return <ErrorFeedbackModal/>
  } else {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.myLearningContainer}>
          <View style={styles.myLearningHeader}>
            <Text style={styles.primaryText}>
              {translate("my-learning.primary_title")}
            </Text>
            <Text>
              {translate("my-learning.primary_info", { count: (!loading && currentLearning && currentLearning.length) ? currentLearning.length : 0})}
            </Text>
          </View>
          <View style={styles.learningItems}>
            { (loading) && <Text>{translate("general.loading")}</Text>}
            { 
              (!loading && currentLearning && currentLearning.length > 0) 
              ? <LearningItemCarousel currentLearning={currentLearning} /> 
              : <NoCurrentLearning />
            }
          </View>
        </View>
      </SafeAreaView>
    )
  } 
});

export default MyLearning;

const styles = StyleSheet.create({
  myLearningContainer: {
    flex: 1,
    justifyContent: "center"
  },
  myLearningHeader: {
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#f9f9f9",
    padding: gutter,
    borderBottomWidth: 0.2,
  },
  primaryText: {
    fontSize: h1
  },
  learningItems: {
    flex: 1
  }
});
