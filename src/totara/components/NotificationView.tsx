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
import { Text, TextStyle, StyleSheet, View } from "react-native";

import { ThemeContext } from "@totara/theme";

type Props = {
  mode: "info" | "alert"
  text?: string,
  style?: TextStyle,
}

const NotificationView = ({ text, mode, style}: Props) => {

  const [theme] = useContext(ThemeContext);
  let backgroundStyle = {backgroundColor: theme.colorInfo};
  let indicator = "⚡︎";
  let textStyle = {...theme.textSmall, ...{ color: theme.colorNeutral1}};
  if(mode === "alert") {
    backgroundStyle.backgroundColor = theme.colorAlert;
    indicator = "⌽";
  }
  
  return (<View style={[styles.container, backgroundStyle]} >
    <Text style={[styles.indicator, textStyle, style]}>{indicator}</Text>
    <Text style={[styles.indicator, textStyle, style]}>{text}</Text>
  </View>);
};

const styles = StyleSheet.create({
  container: {
    padding: 8, 
    flexDirection: "row",
  },
  indicator: {
    paddingRight: 8,
    alignSelf: "center"
  }
});

export default NotificationView;