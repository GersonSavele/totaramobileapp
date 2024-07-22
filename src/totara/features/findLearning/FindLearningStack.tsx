/**
 * This file is part of Totara Enterprise.
 *
 * Copyright (C) 2021 onwards Totara Learning Solutions LTD
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
import { NAVIGATION } from '@totara/lib/navigation';
import React from 'react';

import CourseDetails from '../currentLearning/course/CourseDetails';
import FindLearning from './FindLearning';

const Stack = createStackNavigator();

const FindLearningStack = () => {
  return (
    <Stack.Navigator screenOptions={{ presentation: 'modal' }}>
      <Stack.Screen name={NAVIGATION.FIND_LEARNING_STACK} component={FindLearning} options={{ header: () => null }} />
      <Stack.Screen
        name={NAVIGATION.FIND_LEARNING_COURSE_DETAILS}
        component={CourseDetails}
        options={{ headerBackTitleVisible: false, headerTitle: '' }}
      />
    </Stack.Navigator>
  );
};

export default FindLearningStack;
