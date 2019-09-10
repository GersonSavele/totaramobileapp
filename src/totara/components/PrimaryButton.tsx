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
import { Text, ViewStyle } from "react-native";
import { Button } from "native-base";
import { theme } from "@totara/theme";

type Props = {
  children?: Element,
  text?: string,
  style?: ViewStyle,
  onPress?: (() => void)
}

const PrimaryButton = ({ children, text, style, onPress, ...rest}: Props) =>
  <Button block primary onPress={onPress} {...rest} style={style}>
    {
      text
        ? <Text style={{ color: "#fff", fontSize: theme.DefaultFontSize }}>{text}</Text>
        : children
    }
  </Button>;

export default PrimaryButton;
