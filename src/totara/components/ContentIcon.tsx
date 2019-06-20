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

import {StyleSheet, View} from "react-native";
import React from "react";
import {normalize} from "@totara/theme";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";

type Props = {
  icon: string
  iconSize: number
  size: number
}

const ContentIcon = ({icon, iconSize, size}: Props) => {
  return(
    <View style={styles.iconCircle}>
      <FontAwesomeIcon icon={icon} size={iconSize} color={"white"}/>
    </View>
  );

};

const styles = StyleSheet.create({
  iconCircle: {
    padding: 0,
    backgroundColor: "#3D444B",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#3D444B",
    height: normalize(size),
    width: normalize(size),
    justifyContent: "center",
    alignItems: "center",
  },
});
export default ContentIcon
