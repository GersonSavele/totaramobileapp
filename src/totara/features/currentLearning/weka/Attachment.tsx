/**
 * This file is part of Totara Enterprise.
 *
 * Copyright (C) 2020 onwards Totara Learning Solutions LTD
 *
 * Totara Enterprise is provided only to Totara Learning Solutions
 * LTD’s customers and partners, pursuant to the terms and
 * conditions of a separate agreement with Totara Learning
 * Solutions LTD or its affiliate.
 *
 * If you do not have an agreement with Totara Learning Solutions
 * LTD, you may not access, use, modify, or distribute this software.
 * Please contact [sales@totaralearning.com] for more information.
 */

import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { iconSizes } from "@totara/theme/constants";
import { TotaraTheme } from "@totara/theme/Theme";
// @ts-ignore no types published yet for fortawesome react-native, they do have it react so check in future and remove this ignore
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import styles from "./wekaStyle";
import { navigateWebView } from "./wekaUtils";

type ConfigProps = {
  content?: any;
  index?: number;
  attrs?: any;
  children?: (index: number) => void;
};

const Attachment = ({ content = {} }: ConfigProps) => {
  const [visible, setIsVisible] = useState(false);
  const [clickIndex, setClickIndex] = useState();
  const onRequestClose = (index) => {
    setIsVisible(!visible);
    setClickIndex(index);
  };
  return content.map((nestedContent: any = {}, index: number) => {
    return (
      <TouchableOpacity style={styles.touchableViewWrap} key={index} onPress={() => onRequestClose(index)}>
        <View style={styles.iconWrap}>
          <FontAwesomeIcon
            icon={faPaperclip}
            color={TotaraTheme.colorLink}
            size={iconSizes.sizeS}
            style={{ alignSelf: "flex-start" }}
          />
        </View>
        <View style={{ flex: 8 }}>
          <Text style={styles.attachmentFileName}>{nestedContent.attrs.filename}</Text>
        </View>

        {visible && clickIndex == index && navigateWebView(nestedContent.attrs.url, onRequestClose, "")}
      </TouchableOpacity>
    );
  });
};
export default Attachment;
