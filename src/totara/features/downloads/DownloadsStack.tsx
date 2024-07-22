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
import totaraNavigationOptions from '@totara/components/NavigationOptions';
import Downloads from '@totara/features/downloads/Downloads';

import { NAVIGATION } from '../../lib/navigation';

// const DownloadsStack = createCompatNavigatorFactory(createStackNavigator)(
//   {
//     Downloads: {
//       screen: Downloads
//     }
//   },
//   {
//     initialRouteName: "Downloads",
//     defaultNavigationOptions: totaraNavigationOptions({ title: "" })
//   }
// );

const Stack = createStackNavigator();

const DownloadsStack = () => (
  <Stack.Navigator initialRouteName={NAVIGATION.DOWNLOADS} screenOptions={{ ...totaraNavigationOptions({}) }}>
    <Stack.Screen name={NAVIGATION.DOWNLOADS} component={Downloads} />
  </Stack.Navigator>
);

export default DownloadsStack;
