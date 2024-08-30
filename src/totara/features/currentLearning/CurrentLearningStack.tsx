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
import { NAVIGATION } from '@totara/lib/navigation';

import CourseDetails from './course/CourseDetails';
import { CourseGroupDetails, CourseList } from './courseGroup';
import CurrentLearning from './CurrentLearning';

const Stack = createStackNavigator();

const CurrentLearningStack = () => (
  <Stack.Navigator initialRouteName={NAVIGATION.CURRENT_LEARNING}>
    <Stack.Screen
      name={NAVIGATION.CURRENT_LEARNING}
      component={CurrentLearning}
      options={() => totaraNavigationOptions({})}
    />
    <Stack.Screen name={NAVIGATION.COURSE_DETAILS} component={CourseDetails} options={totaraNavigationOptions({})} />
    <Stack.Screen
      name={NAVIGATION.COURSE_GROUP_DETAILS}
      component={CourseGroupDetails}
      options={() =>
        totaraNavigationOptions({
          headerShown: false
        })
      }
    />
    <Stack.Screen
      name={NAVIGATION.COURSE_LIST}
      component={CourseList}
      options={() => {
        return totaraNavigationOptions({});
      }}
    />
  </Stack.Navigator>
);

export default CurrentLearningStack;
