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
 */

import {StyleSheet} from "react-native";
import {normalize} from "@totara/theme";


const styles = StyleSheet.create({
  itemImage: {
    flex: 1,
    flexDirection: "column-reverse",
  },
  itemCard: {
    padding: normalize(16),
    justifyContent: "flex-start",
    flex: 1
  },
  itemType: {
    fontSize: 12,
    color: "#A0A0A0"
  },
  pipe: {
    color: "#A0A0A0",
    paddingRight: 8,
    paddingLeft: 8,
    fontSize: 10,
  },
  percentagetext: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#A0A0A0",
  },
  itemFullName: {
    color: "#3D444B",
    flexWrap: "wrap",
    fontSize: normalize(22),
    fontWeight: "400",
    padding: 0,
    lineHeight: normalize(24),
  },
  itemInfo: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    minHeight: 30,
    maxHeight: 35,
    paddingTop: 5,
  },
});

export default styles;