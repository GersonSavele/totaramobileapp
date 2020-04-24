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
 * @author: Kamala Tennakoon <kamala.tennakoon@totaralearning.com>
 */
import React from "react";
import { TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
// @ts-ignore no types published yet for fortawesome react-native, they do have it react so check in future and remove this ignore
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { gutter } from "@totara/theme";
import { IconDefinition } from "@fortawesome/fontawesome-common-types";

type Props = {
  icon: IconDefinition | string;
  onPress?: (() => void);
  disabled?: boolean;
  color?: string;
  size?: number;
  style?: ViewStyle;
};

const TouchableIcon = ({ icon, onPress, disabled, size, style, ...rest }: Props) => {

  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, style]} disabled={disabled}>
      <FontAwesomeIcon 
      icon={icon as IconDefinition} 
      size={size} {...rest} style={{ opacity: disabled ? 0.5 : 1}}/>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    padding: gutter
  }
});

export default TouchableIcon;