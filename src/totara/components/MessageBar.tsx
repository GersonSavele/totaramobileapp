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

import type { IconName } from '@totara/components/Icon';
import Icon from '@totara/components/Icon';
import { margins, paddings } from '@totara/theme/constants';
import { TotaraTheme } from '@totara/theme/Theme';
import React from 'react';
import type { TextStyle } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';

type MessageBarProps = {
  text: string;
  icon?: IconName;
  mode?: 'info' | 'alert';
  style?: TextStyle;
  testID?: string;
};

// @ts-ignore
const MessageBar = ({ text, icon = 'circle-info', mode = 'info', style, testID }: MessageBarProps) => {
  let backgroundStyle = { backgroundColor: TotaraTheme.colorInfo };
  let textStyle: any = [TotaraTheme.textSmall, styles.content, { color: TotaraTheme.colorNeutral1 }];
  if (style) {
    textStyle.push(style);
  }
  if (mode === 'alert') {
    backgroundStyle.backgroundColor = TotaraTheme.colorAlert;
  }

  return (
    <View style={[styles.container, backgroundStyle]} testID={testID}>
      {icon && <Icon name={icon} size={textStyle.fontSize} style={[styles.content, textStyle]} />}
      <Text style={textStyle}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: paddings.paddingM,
    flexDirection: 'row'
  },
  content: {
    marginRight: margins.marginS,
    alignSelf: 'center'
  }
});

export default MessageBar;
