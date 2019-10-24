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
import { Text, ViewStyle, StyleSheet, TextStyle } from "react-native";
import { Button, Spinner } from "native-base";
// @ts-ignore no types published yet for fortawesome react-native, they do have it react so check in future and remove this ignore
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { gutter, ThemeContext } from "@totara/theme";
import { translate } from "@totara/locale";

type Props = {
  children?: Element,
  text?: string,
  icon?: string,
  style?: ViewStyle,
  onPress?: (() => void),
  mode?: "loading" | undefined
}

type TitleProps = {
  text?: string,
  style?: TextStyle ,
  mode?: "loading" | undefined,
}

type IndicatorProps = {
  icon?: string,
  mode?: "loading" | undefined,
  color?: string,
  size?: number
}

const ButtonTitle = ({mode, text, style}: TitleProps) => {
  switch (mode) {
    case "loading":
        return <Text style={style}>{ translate("general.loading") }</Text>;
    default: 
        return <Text style={style}>{ text }</Text>;
  }
};

const ButtonIndicator = ({mode, icon, color, size}: IndicatorProps) => {
  const styleIndicator = { marginLeft: gutter };
  switch (mode) {
    case "loading":
      return <Spinner size="small" color={color} style={styleIndicator} />;
    default: 
      return icon ? <FontAwesomeIcon icon={icon} size={size} color={color} style={styleIndicator} /> : null;
  }
};

const PrimaryButton = ({ children, text, icon, style, onPress, mode, ...rest}: Props) => {
  
  const [theme] = useContext(ThemeContext);
  
  const buttonStyle = StyleSheet.create({
    container: {
      height: 48,
      paddingHorizontal: 16,
      minWidth: 200,
      borderRadius: 3,
      backgroundColor: theme.colorBrand 
    }, 
    title: {
      fontWeight: "bold", 
      fontSize: theme.fontSizeButtonTitle, 
      color: theme.textColorLight
    }
  });
  
  return (
    <Button block onPress={onPress} {...rest}  style={[buttonStyle.container, style]} disabled={mode == "loading" || mode == "disabled"}>
      {
        text
        ? <ButtonTitle mode={mode} text={text} style={buttonStyle.title}/>
        : {children}
      }
      <ButtonIndicator mode={mode} icon={icon} color={theme.textColorLight} size={theme.fontSizeButtonTitle} />
    </Button>
  );
}

export default PrimaryButton;
