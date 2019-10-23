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

import React, { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";

import { gutter } from "@totara/theme";
import { translate } from "@totara/locale";
import LearningItemCarousel from "./LearningItemCarousel";
import { learningItemsList } from "./api";
import { Log } from "@totara/lib";
import { GeneralErrorModal } from "@totara/components";
import NoCurrentLearning from "./NoCurrentLearning";
import { ThemeContext } from "@totara/theme/ThemeContext";

const MyLearning = learningItemsList(({loading, currentLearning, error }) => {

  const [ theme ] = useContext(ThemeContext);

  if (error) {
    Log.error("Error getting current learning", error);
    return <GeneralErrorModal />
  } else {
    return (
      <View style={[{ flex: 1}, theme.viewContainer]}>
        <View style={[styles.myLearningHeader, { backgroundColor: theme.colorSecondary1 }]}>
          <Text style={[theme.textH1, { color: theme.navigationHeaderTintColor }]}>
            {translate("my-learning.primary_title")}
          </Text>
          <Text style={[theme.textSmall, { color: theme.navigationHeaderTintColor }]}>
            {translate("my-learning.primary_info", {
              count:
                !loading && currentLearning && currentLearning.length
                  ? currentLearning.length
                  : 0
            })}
          </Text>
        </View>
        <View style={{flex: 1, backgroundColor: "transparent"}}>
          {loading ? (
            <Text>{translate("general.loading")}</Text>
          ) : currentLearning && currentLearning.length > 0 ? (
            <LearningItemCarousel currentLearning={currentLearning} />
          ) : (
            <NoCurrentLearning />
          )}
        </View>
      </View>
    );
  }
});

export default MyLearning;

const styles = StyleSheet.create({
  myLearningHeader: {
    flexDirection: "column",
    justifyContent: "space-between",
    paddingHorizontal: gutter,
    paddingVertical: 8
  }
});
