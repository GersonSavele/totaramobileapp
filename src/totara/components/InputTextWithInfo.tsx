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
import { View, StyleSheet, ViewStyle, Text } from "react-native";
import { Item, Label } from "native-base";
import { theme } from "@totara/theme";

type Props = {
  children?: Element,
  placeholder?: string,
  value?: string,
  message?: string,
  onPress?: (() => void),
  status?: "success" | "focus" | "error",
  style?: ViewStyle
}

const InfoText = ({status, message}: Props) => {
  switch (status) {
    case "success":
      return <Text style={[styles.message, styles.success]}>{message}</Text>;
    case "error":
      return<Text style={[styles.message, styles.error]}>{message}</Text>;
    case "focus":
        return <Text style={[styles.message, styles.focus]}>{message}</Text>;
    default:
      return <Text style={styles.message}>{message}</Text>;
  }
};

const InputTextWithInfo = ({ children, placeholder, message, status, style, ...rest }: Props) => {  
  return (
    <View style={{marginBottom: 8}}>
      <Item floatingLabel {...rest} success={(status === "success")} error={(status === "error")} style={[style, styles.formItem]}>
        <Label style={{fontSize: theme.inputFontSize - 1}}>{placeholder}</Label>
        { children }        
      </Item>
      <InfoText status={status} message={message} />
    </View>
  );
};

const styles = StyleSheet.create({
  message: {
    fontSize: theme.inputFontSize - 2,
    color: theme.inputTextColor,
    height: theme.inputFontSize,
    opacity: 0
  },
  success: {
    color: theme.inputSuccessTextColor,
    opacity: 1
  },
  error: {
    color: theme.inputErrorTextColor,
    opacity: 1
  },
  focus: {
    color: theme.inputSuccessTextColor,
    opacity: 0
  },
  formItem: {
    marginTop: 0,
    marginBottom:0,
    marginLeft: 0,
    marginRight: 0,
    paddingLeft: 0,
    paddingRight: 0
  }
});

export default InputTextWithInfo;
