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
 *
 */
import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import {
  NAVIGATION_COURSE_DETAILS,
  NAVIGATION_COURSE_GROUP_DETAILS,
  NAVIGATION_CURRENT_LEARNING
} from "@totara/lib/constants";
import totaraNavigationOptions from "@totara/components/NavigationOptions";
import CurrentLearning from "./carouselItems/CurrentLearning";
import CourseDetails from "./course/CourseDetails";
import CourseGroupDetails from "./courseGroup/CourseGroupDetails";
import { header } from "@totara/theme/constants";
import { faCloudDownloadAlt } from "@fortawesome/free-solid-svg-icons";
import { TouchableIcon } from "@totara/components";

const CurrentLearningStack = createStackNavigator(
  {
    [NAVIGATION_CURRENT_LEARNING]: {
      screen: CurrentLearning as any,
      navigationOptions: ({ screenProps, navigation }: any) =>
        totaraNavigationOptions({
          theme: screenProps.theme,
          title: navigation.getParam("title"),
          opacity: navigation.getParam("opacity")
        })
    },
    [NAVIGATION_COURSE_DETAILS]: {
      screen: CourseDetails as any,
      navigationOptions: ({ screenProps, navigation }: any) =>
        totaraNavigationOptions({
          theme: screenProps.theme,
          title: navigation.getParam("title"),
          opacity: navigation.getParam("opacity")
        })
    },
    [NAVIGATION_COURSE_GROUP_DETAILS]: {
      screen: CourseGroupDetails,
      navigationOptions: ({ screenProps, navigation }: any) =>
        totaraNavigationOptions({
          theme: screenProps.theme,
          rightAction: (
            <TouchableIcon
              icon={faCloudDownloadAlt}
              disabled={false}
              size={header.icon.size}
              color={screenProps.theme.navigationHeaderTintColor}
            />
          ),
          title: navigation.getParam("title"),
          opacity: navigation.getParam("opacity")
        })
    }
  },
  {
    initialRouteName: "CurrentLearning",
    initialRouteKey: "CurrentLearning",
    defaultNavigationOptions: ({ screenProps }: any) =>
      totaraNavigationOptions({
        theme: screenProps.theme
      })
  }
);

export default CurrentLearningStack;
