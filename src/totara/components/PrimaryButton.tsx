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
import { Text, ViewStyle, StyleSheet } from "react-native";
import { Button, Spinner } from "native-base";
// @ts-ignore no types published yet for fortawesome react-native, they do have it react so check in future and remove this ignore
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { gutter, fontSizeButtonTitle, textColorLight } from "@totara/theme";
import { translate } from "@totara/locale";

type Props = {
  children?: Element,
  text?: string,
  icon?: string,
  style?: ViewStyle,
  onPress?: (() => void),
  mode?: "loading" | undefined
}

const ButtonTitle = ({mode, text}: Props) => {
  switch (mode) {
    case "loading":
        return <Text style={styles.title}>{ translate("general.loading") }</Text>;
    default: 
        return <Text style={styles.title}>{ text }</Text>;
  }
};

const ButtonIndicator = ({mode, icon}: Props) => {
  switch (mode) {
    case "loading":
      return <Spinner size="small" color={textColorLight}  style={styles.indicator} />;
    default: 
      return icon ? <FontAwesomeIcon icon={icon} size={fontSizeButtonTitle} color={textColorLight}  style={styles.indicator} /> : null;
  }
};

const PrimaryButton = ({ children, text, icon, style, onPress, mode, ...rest}: Props) =>
  <Button block primary onPress={onPress} {...rest}  style={[styles.button, style]} disabled={mode == "loading" || mode == "disabled"}>
    {
      text
      ? <ButtonTitle mode={mode} text={text} />
      : {children}
    }
    <ButtonIndicator mode={mode} icon={icon} />
  </Button>;

const styles = StyleSheet.create({
  button: {
    height: 48,
    paddingHorizontal: 16,
    minWidth: 200,
    borderRadius: 3
  },
  title: {
    color: textColorLight,
    fontSize: fontSizeButtonTitle,
    fontWeight: "bold",
  },
  indicator: {
    marginLeft: gutter
  }
});

export default PrimaryButton;
