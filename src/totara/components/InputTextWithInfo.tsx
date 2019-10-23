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
import { View, StyleSheet, ViewStyle, Text } from "react-native";
import { Item, Label } from "native-base";

// import { theme, textColorSubdued, fontSizeH4, fontSizeB2, lineHeightB2 } from "@totara/theme";
import { ThemeContext } from "@totara/theme/ThemeContext";

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
  const [ theme ] = useContext(ThemeContext);
  const stylesInfo = StyleSheet.create({
    hide: {
      opacity: 0
    },
    success: {
      color: theme.colorSuccess,
      opacity: 1
    },
    error: {
      color: theme.colorAlert,
      opacity: 1
    },
    focus: {
      color: theme.colorInfo,
      opacity: 0
    }
  });
  switch (status) {
    case "success":
      return <Text style={[theme.textB2, stylesInfo.success]}>{message}</Text>;
    case "error":
      return<Text style={[theme.textB2,  stylesInfo.error]}>{message}</Text>;
    case "focus":
        return <Text style={[theme.textB2, stylesInfo.focus]}>{message}</Text>;
    default:
      return <Text style={[theme.textB2, stylesInfo.hide]}>{message}</Text>;
  }
};

const InputTextWithInfo = ({ children, placeholder, message, status, style, ...rest }: Props) => {  

  const [ theme ] = useContext(ThemeContext);

  const styles = StyleSheet.create({
    formItem: {
      marginTop: 0,
      marginBottom:0,
      marginLeft: 0,
      marginRight: 0,
      paddingLeft: 0,
      paddingRight: 0,
      borderBottomColor: status === "error" ? theme.colorAlert : theme.textColorSubdued
    }
  });
  return (
    <View style={{marginBottom: 8}}>
      <Item floatingLabel {...rest} success={(status === "success")} error={(status === "error")} style={[style, styles.formItem]}>
        <Label style={{fontSize: theme.textH4.fontSize, color: theme.textColorSubdued}}>{placeholder}</Label>
        { children }        
      </Item>
      <InfoText status={status} message={message} />
    </View>
  );
};

export default InputTextWithInfo;
