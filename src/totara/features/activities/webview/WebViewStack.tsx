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

import { createStackNavigator } from '@react-navigation/stack';
import CloseButton from '@totara/components/CloseButton';
import { NAVIGATION } from '@totara/lib/navigation';
import { NAVIGATION_TEST_IDS } from '@totara/lib/testIds';
import React from 'react';

import { WebviewActivity } from './WebviewActivity';

const Stack = createStackNavigator();

const WebViewStack = () => (
  <Stack.Navigator screenOptions={{ presentation: 'modal' }}>
    <Stack.Screen
      name={NAVIGATION.WEBVIEW_ACTIVITY}
      component={WebviewActivity}
      options={({ route, navigation }) => {
        const { backAction, title } = route.params as any;
        // const { backAction, title } = navigation.state.params as any;
        return {
          headerTitleAlign: 'center',
          title: title,
          headerLeft: () => (
            <CloseButton
              onPress={() => {
                backAction();
                navigation.goBack();
              }}
              testID={NAVIGATION_TEST_IDS.BACK}
            />
          )
        };
      }}
    />
  </Stack.Navigator>
);

export default WebViewStack;
