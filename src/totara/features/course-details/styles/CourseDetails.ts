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
import {normalize} from "@totara/theme";

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  learningItem: {
    flex: 2,
  },
  activitiesContainer: {
    flex: 3
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
    borderColor: "#EEEEEE",
    height: normalize(64),
    padding: 10
  },
  activityText: {
    fontSize: 15,
    padding: 10,
  },
  activities: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  button: {
    alignItems: "center",
    padding: 10
  },
  tabNav: {
    flexDirection: "row",
    padding: 10,
  },
  tabActive: {
    paddingRight: 20,
    fontSize: 15,
    fontWeight: "bold",
    borderBottomWidth: 2
  },
  tabInActive: {
    fontSize: 15,
    color: "#CECECE"
  },
  itemImage: {
    flex: 6,
  },
  itemCard: {
    flex: 2,
    backgroundColor: "#EEEEEE",
    maxHeight: 72
  },
});

export default styles;