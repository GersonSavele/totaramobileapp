/*
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
 */

import {StyleSheet} from "react-native";
import {normalize, resizeByScreenSize} from "@totara/theme";

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  learningItem: {
    flex: 2,
  },
  activitiesContainer: {
    flex: 3,
    paddingLeft: 0,

    },
  buttonContainer: {
    flex: 0,
    paddingTop: 4,
    paddingLeft: 8,
    paddingRight: 8,
    marginBottom: 10
  },
  activity: {
    flexDirection: "row",
    alignItems: "center",
    textAlign: "center",
    fontWeight: "bold",
    margin: 0,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F5F5F5",
    height: normalize(64),
    padding: 10
  },
  activityText: {
    fontSize: 16,
    paddingLeft: 10,

  },
  activitySummaryText: {
    fontSize: 14,
    color: "#A0A0A0",
    paddingLeft: 10,

  },
  activities: {
    paddingLeft: resizeByScreenSize(8, 10, 16, 24),
    paddingRight: resizeByScreenSize(8,10, 16, 24),
    paddingTop: resizeByScreenSize(8,10, 16, 24),
  },
  button: {
    alignItems: "center",
    padding: 10
  },
  tabNav: {
    flexDirection: "row",
    paddingLeft: resizeByScreenSize(8, 10, 16, 24),
    paddingTop: 20,
  },
  tabActive: {
    paddingRight: 40,
    fontSize: 16,
    fontWeight: "bold",
    borderBottomWidth: 5,
    borderColor: "black",
  },
  tabInActive: {
    fontSize: 15,
    color: "#CECECE"
  },
  itemImage: {
    flex: 6,
  },
  iconcircle:{
    padding: 0,
    backgroundColor: "#3D444B",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#3D444B",
    height: normalize(50),
    width: normalize(50),
    justifyContent: "center",
    alignItems: "center",
  },
  itemCard: {
    flex: 2,
    backgroundColor: "#EEEEEE",
    maxHeight: 72
  },
});

export default styles;