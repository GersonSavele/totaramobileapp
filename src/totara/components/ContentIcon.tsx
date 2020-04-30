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

import { StyleSheet, View, Image } from "react-native";
import React from "react";

import { normalize } from "@totara/theme";
// @ts-ignore no types published yet for fortawesome react-native, they do have it react so check in future and remove this ignore
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

type Props = {
  icon?: any;
  iconSize: number;
  size: number;
  backgroundColor?: string;
  iconColor?: string;
  borderColor?: string;
  fontAwesomeIcon?: boolean;
};

const ContentIcon = ({
  icon,
  iconSize,
  size,
  backgroundColor,
  iconColor,
  borderColor,
  fontAwesomeIcon = true,
}: Props) => {
  const styles = StyleSheet.create({
    iconCircle: {
      padding: 0,
      backgroundColor: backgroundColor == null ? "#3D444B" : backgroundColor,
      borderRadius: 25,
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: borderColor == null ? "#3D444B" : borderColor,
      height: normalize(size),
      width: normalize(size),
      justifyContent: "center",
      alignItems: "center",
    },
  });
  return (
    <View style={styles.iconCircle}>
      {icon ? (
        fontAwesomeIcon ? (
          <FontAwesomeIcon
            icon={icon}
            size={iconSize}
            color={iconColor == null ? "white" : iconColor}
          />
        ) : (
          <Image source={icon}></Image>
        )
      ) : null}
    </View>
  );
};

export default ContentIcon;
