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
import { Text, TextStyle, TouchableOpacity } from "react-native";

import { ThemeContext } from "@totara/theme";

type Props = {
  children?: Element,
  text?: string,
  style?: TextStyle,
  onPress?: (() => void)
}

const LinkText = ({ text, style, onPress, children, ...rest }: Props) => {

  const [theme] = useContext(ThemeContext);
  
  return (<TouchableOpacity onPress={onPress} >
    <Text style={[{fontSize: 16, color: theme.colorLink}, style]} {...rest}>
      { children ? children : text }
    </Text>
  </TouchableOpacity>);
};
export default LinkText;