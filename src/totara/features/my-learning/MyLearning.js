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

import { gutter, textColorDark ,fontSizeH1, lineHeightH1, colorSecondary4, colorSecondary3, fontSizeSmall, lineHeightSmall } from "@totara/theme";
import { translate } from "@totara/locale";
import LearningItemCarousel from "./LearningItemCarousel";
import { learningItemsList } from "./api";
import { Log } from "@totara/lib";
import { ErrorFeedbackModal } from "@totara/components";
import NoCurrentLearning from "./NoCurrentLearning";

const MyLearning = learningItemsList(({loading, currentLearning, error}) => {
  if (error) {
    Log.error("Error getting current learning", error);
    return <ErrorFeedbackModal/>
  } else {
    return (
      <View style={styles.myLearningContainer}>
        <View style={styles.myLearningHeader}>
          <Text style={styles.primaryText}>
            {translate("my-learning.primary_title")}
          </Text>
          <Text style={styles.infoText}>
            {translate("my-learning.primary_info", { count: (!loading && currentLearning && currentLearning.length) ? currentLearning.length : 0})}
          </Text>
        </View>
        <View style={styles.learningItems}>
          { (loading)
            ? <Text>{translate("general.loading")}</Text>
            : (currentLearning && currentLearning.length > 0)
              ? <LearningItemCarousel currentLearning={currentLearning} />
              : <NoCurrentLearning />
          }
        </View>
      </View>
    )
  } 
});

export default MyLearning;

const styles = StyleSheet.create({
  myLearningContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colorSecondary4
  },
  myLearningHeader: {
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: colorSecondary3,
    padding: gutter
  },
  primaryText: {
    fontSize: fontSizeH1,
    lineHeight: lineHeightH1,
    color: textColorDark,
    fontWeight: "bold"
  },
  infoText: {
    fontSize: fontSizeSmall,
    lineHeight: lineHeightSmall,
    color: textColorDark,
  },
  learningItems: {
    flex: 1
  }
});
