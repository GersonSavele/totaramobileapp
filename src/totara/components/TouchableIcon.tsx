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
import React, { useContext } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
// @ts-ignore no types published yet for fortawesome react-native, they do have it react so check in future and remove this ignore
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { gutter, ThemeContext } from "@totara/theme";
import { IconDefinition } from "@fortawesome/fontawesome-common-types";

type Props = {
  icon: IconDefinition | string;
  onPress?: (() => void);
  disabled: boolean;
  color?: string;
  size?: number;
};

const TouchableIcon = ({ icon, onPress, color, disabled, size, ...rest }: Props) => {
  const [theme] = useContext(ThemeContext);
  return (
  <TouchableOpacity onPress={onPress} style={styles.container} disabled={disabled}>
    <FontAwesomeIcon icon={icon} size={ size ? size : theme.textH3.fontSize} color={ color ? color : theme.textColorDark} {...rest} style={{ opacity: disabled ? 0.5 : 1}}/>
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