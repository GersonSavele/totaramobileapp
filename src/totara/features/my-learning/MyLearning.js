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

import {
  gutter,
  fontSizeH1,
  lineHeightH1,
  colorAccent,
  colorSecondary1,
  fontSizeSmall,
  lineHeightSmall,
  navigationHeaderTintColor
} from "@totara/theme";
import { translate } from "@totara/locale";
import LearningItemCarousel from "./LearningItemCarousel";
import { learningItemsList } from "./api";
import { Log } from "@totara/lib";
import { GeneralErrorModal, PrimaryButton } from "@totara/components";
import NoCurrentLearning from "./NoCurrentLearning";
import { ThemeContext } from "@totara/theme/MobileTheme"


const MyLearning = learningItemsList(({loading, currentLearning, error }) => {

  const {theme, setMobileTheme} = useContext(ThemeContext);

  if (error) {
    Log.error("Error getting current learning", error);
    return <GeneralErrorModal />
  } else {
    return (
      // <ThemeContext.Consumer>
      //    {value =>  
            <View style={styles.myLearningContainer}>
            <View style={styles.myLearningHeader}>
              <Text style={[theme.textH1, styles.primaryText]}>
                {translate("my-learning.primary_title")}
              </Text>
              <Text style={styles.infoText}>
                {translate("my-learning.primary_info", { count: (!loading && currentLearning && currentLearning.length) ? currentLearning.length : 0})}
              </Text>
              {/* <PrimaryButton text="Switch" onPress={setMobileTheme} /> */}
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
      //   }
      // </ThemeContext.Consumer>
    )
  }
});

export default MyLearning;

const styles = StyleSheet.create({
  myLearningContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colorAccent
  },
  myLearningHeader: {
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: colorSecondary1,
    paddingHorizontal: gutter,
    paddingVertical: 8
  },
  primaryText: {
    // fontSize: fontSizeH1,
    // lineHeight: lineHeightH1,
    // color: navigationHeaderTintColor,
    // fontWeight: "bold"
  },
  infoText: {
    fontSize: fontSizeSmall,
    lineHeight: lineHeightSmall,
    color: navigationHeaderTintColor,
  },
  learningItems: {
    flex: 1
  }
});
