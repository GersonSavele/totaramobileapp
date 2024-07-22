/**
 * This file is part of Totara Enterprise.
 *
 * Copyright (C) 2019 onwards Totara Learning Solutions LTD
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
import { paddings } from '@totara/theme/constants';
import React from 'react';
import type { ViewStyle } from 'react-native';
import { StyleSheet, TouchableOpacity } from 'react-native';

type Props = {
  icon: IconName;
  onPress?: () => void;
  disabled?: boolean;
  color?: string;
  size?: number;
  style?: ViewStyle;
  testID?: string;
};

const TouchableIcon = ({ icon, onPress, disabled, size, style, testID, ...rest }: Props) => {
  return (
    <TouchableOpacity testID={testID} onPress={onPress} style={[styles.container, style]} disabled={disabled}>
      <Icon name={icon} size={size} {...rest} style={{ opacity: disabled ? 0.5 : 1 }} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    padding: paddings.paddingL
  }
});

export default TouchableIcon;
