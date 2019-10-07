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
import { TouchableOpacity, StyleSheet } from "react-native";
// @ts-ignore no types published yet for fortawesome react-native, they do have it react so check in future and remove this ignore
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { gutter, fontSizeH3, textColorDark, colorNeutral5 } from "@totara/theme";

type Props = {
  icon: string
  onPress?: (() => void)
  disabled: boolean
}

const TouchableIcon = ({ icon, onPress, disabled, ...rest }: Props) => (
  <TouchableOpacity onPress={onPress} style={styles.container} disabled={disabled}>
    <FontAwesomeIcon icon={icon} size={fontSizeH3} color={ disabled ? colorNeutral5 : textColorDark} {...rest} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    padding: gutter
  }
});

export default TouchableIcon;