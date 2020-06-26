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
import { Text, TextStyle, StyleSheet, View } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { margins, paddings } from "@totara/theme/constants";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { TotaraTheme } from "@totara/theme/Theme";

type MessageBarProps = {
  text: string;
  icon?: IconProp;
  mode?: "info" | "alert";
  style?: TextStyle;
  testID?: string;
};

const MessageBar = ({
  text,
  icon = faInfoCircle,
  mode = "info",
  style,
  testID
}: MessageBarProps) => {
  let backgroundStyle = { backgroundColor: TotaraTheme.colorInfo };
  let textStyle = [
    TotaraTheme.textSmall,
    styles.content,
    { color: TotaraTheme.colorNeutral1 }
  ];
  if (style) {
    textStyle.push(style);
  }
  if (mode === "alert") {
    backgroundStyle.backgroundColor = TotaraTheme.colorAlert;
  }

  return (
    <View style={[styles.container, backgroundStyle]} testID={testID}>
      {icon && (
        <FontAwesomeIcon
          icon={icon}
          size={textStyle.fontSize}
          style={[styles.content, textStyle]}
        />
      )}
      <Text style={textStyle}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: paddings.paddingM,
    flexDirection: "row"
  },
  content: {
    marginRight: margins.marginS,
    alignSelf: "center"
  }
});

export default MessageBar;
