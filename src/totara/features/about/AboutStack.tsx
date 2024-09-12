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

import CloseButton from '../../components/CloseButton';
import { NAVIGATION } from '../../lib/navigation';
import { NAVIGATION_TEST_IDS } from '../../lib/testIds';
import About from './About';

const Stack = createStackNavigator();

const AboutStack = () => (
  <Stack.Navigator initialRouteName={NAVIGATION.ABOUT}>
    <Stack.Screen
      name={NAVIGATION.ABOUT}
      component={About}
      options={({ navigation }) => ({
        headerLeft: () => <CloseButton onPress={() => navigation.goBack()} testID={NAVIGATION_TEST_IDS.BACK} />
      })}
    />
  </Stack.Navigator>
);

export default AboutStack;
