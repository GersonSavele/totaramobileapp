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

import {StyleSheet} from "react-native";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import {resizeByScreenSize, h1, gutter} from "@totara/theme";

const styles = StyleSheet.create({
  myLearningContainer: {
    flex: 1,
    justifyContent: "center",
  },
  myLearningLogo: {
    flexDirection: 'row',
    height: resizeByScreenSize(40, 48, 56, 64),
    paddingHorizontal: gutter,
    backgroundColor: "white",
    alignItems: 'center'
  },
  myLearningHeader: {
    height: resizeByScreenSize(40, 48, 64, 64),
    flexDirection: "row",
    backgroundColor: "white",
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
  panel: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#CECECE",
  },
  panelContent: {
    flex: 10,
    padding: 20,
  },
});

export default styles