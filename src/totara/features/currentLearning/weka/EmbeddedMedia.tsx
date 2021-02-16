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
import { CircleIcon } from "@totara/components";
import { TotaraTheme } from "@totara/theme/Theme";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import styles from "./wekaEditorViewStyle";
import { navigateWebView, EmbeddedMediaProps } from "./wekaUtils";

const EmbeddedMedia = ({ content = {}, title }: EmbeddedMediaProps) => {
  const [visible, setIsVisible] = useState(false);
  const onRequestClose = () => setIsVisible(!visible);
  return (
    <TouchableOpacity style={styles.touchableViewWrap} onPress={onRequestClose}>
      <View style={styles.iconWrap}>
        <CircleIcon
          icon={faPlay}
          backgroundColor={TotaraTheme.colorNeutral2}
          iconColor={TotaraTheme.colorLink}
          borderColor={TotaraTheme.colorLink}
        />
      </View>
      <View style={{ flex: 8 }}>
        <Text style={styles.embeddedMediaTitle}>{title}</Text>
      </View>
      {visible && navigateWebView(content.attrs.url, onRequestClose, title)}
    </TouchableOpacity>
  );
};

export default EmbeddedMedia;
