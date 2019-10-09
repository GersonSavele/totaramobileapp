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

import React, { ReactNode } from "react";
import { Text, StyleSheet, ViewStyle } from "react-native";
import { Button } from "native-base";

import { fontSizeButtonTitle, textColorDark } from "@totara/theme";

type Props = {
  children?: ReactNode,
  text?: string,
  style?: ViewStyle,
  onPress?: (() => void)
}

const TertiaryButton = ({ children, text, style, onPress, ...rest }: Props) => (
  <Button block rounded transparent onPress={onPress} style={[styles.button, style]} {...rest}>
    {
      text 
      ? <Text style={styles.title}>{text}</Text> 
      : children
    }
  </Button>
);


const styles = StyleSheet.create({
  button: {
    height: 48,
    paddingHorizontal: 16,
    minWidth: 200,
    borderRadius: 3
  },
  title: {
    color: textColorDark,
    fontSize: fontSizeButtonTitle,
  }
});

export default TertiaryButton;