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
import { Text } from "react-native";
import { fontWeights, fontStyles, marksTypes } from "@totara/theme/constants";
import styles from "./wekaEditorViewStyle";
import { TotaraTheme } from "@totara/theme/Theme";
import { navigateWebView } from "./wekaUtils";

type TextProps = {
  attrs?: any;
  textColor?: string | undefined;
  marks?: any;
  text: string;
};

const TextContentWrapper = ({ attrs = {}, marks = {}, textColor, text }: TextProps) => {
  const [visible, setIsVisible] = useState(false);
  const onRequestClose = () => setIsVisible(!visible);
  const font =
    attrs.level === 1
      ? { ...TotaraTheme.textHeadline, color: textColor }
      : attrs.level == 2
      ? { ...TotaraTheme.textMedium, color: textColor }
      : { ...TotaraTheme.textRegular, color: textColor };
  marks = Array.from(marks);
  const fontItalic =
    marks &&
    marks.map((marks) => {
      return marks.type === marksTypes.italic && { fontStyle: fontStyles.fontStyleItalic };
    });
  const fontBold =
    marks &&
    marks.map((marks) => {
      return marks.type === marksTypes.bold && { fontWeight: fontWeights.fontWeightBold };
    });
  const link =
    marks &&
    marks.map((marks) => {
      return marks.type === marksTypes.link && { marks };
    });

  return (
    <Text>
      <Text
        style={[font, fontItalic, fontBold, link && link[0] && styles.textLink]}
        testID="test_rich_text"
        onPress={link && onRequestClose}>
        {text}
      </Text>
      {visible && link && link[0] && navigateWebView(link[0].marks.attrs.href, onRequestClose, text)}
    </Text>
  );
};

export default TextContentWrapper;
