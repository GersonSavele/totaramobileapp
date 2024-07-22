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

import { TotaraTheme } from '@totara/theme/Theme';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

type LoadingProps = {
  text?: string;
  testID?: string;
};

const Loading = ({ text, testID }: LoadingProps) => {
  return (
    <View style={loadingViewSyles.container} testID={testID}>
      <ActivityIndicator color={TotaraTheme.textColorDark} />
      {text && <Text>{text}</Text>}
    </View>
  );
};

const loadingViewSyles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'center',
    flexDirection: 'column',
    justifyContent: 'center'
  }
});

export default Loading;
