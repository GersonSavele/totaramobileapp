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
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import FindLearning from "./FindLearning";
import { NAVIGATION, horizontalAnimation } from "@totara/lib/navigation";
import CourseDetails from "../currentLearning/course/CourseDetails";
import FindLearningWebView from "./FindLearningWebView";

const Stack = createStackNavigator();

const FindLearningStack = () => {
  return (
    <Stack.Navigator headerMode={"none"} mode="modal">
      <Stack.Screen name={NAVIGATION.FIND_LEARNING} component={FindLearning} />
      <Stack.Screen name={NAVIGATION.FIND_LEARNING_COURSE_DETAILS} component={CourseDetails} />
      <Stack.Screen
        name={NAVIGATION.FIND_LEARNING_WEB_VIEW}
        component={FindLearningWebView}
        options={horizontalAnimation}
      />
    </Stack.Navigator>
  );
};

export default FindLearningStack;
