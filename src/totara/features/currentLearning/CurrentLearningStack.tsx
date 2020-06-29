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
import { NAVIGATION } from "@totara/lib/navigation";
import { Text, TouchableOpacity } from "react-native";
import totaraNavigationOptions from "@totara/components/NavigationOptions";
import CurrentLearning from "./learningItems/CurrentLearning";
import CourseDetails from "./course/CourseDetails";
import { CourseGroupDetails, CourseList } from "./courseGroup";
import { TouchableIcon } from "@totara/components";
import { WebviewActivity } from "@totara/activities/webview/WebviewActivity";
const {
  WEBVIEW_ACTIVITY,
  CURRENT_LEARNING,
  COURSE_DETAILS,
  COURSE_GROUP_DETAILS,
  COURSE_LIST
} = NAVIGATION;
import { paddings } from "@totara/theme/constants";
import { courseSet } from "./courseGroupStyle";
import { translate } from "@totara/locale";

const CurrentLearningStack = createStackNavigator(
  {
    [CURRENT_LEARNING]: {
      screen: CurrentLearning as any,
      navigationOptions: ({ navigation }: any) =>
        totaraNavigationOptions({
          title: navigation.getParam("title"),
          opacity: navigation.getParam("opacity")
        })
    },
    [COURSE_DETAILS]: {
      screen: CourseDetails as any,
      navigationOptions: ({ navigation }: any) =>
        totaraNavigationOptions({
          title: navigation.getParam("title"),
          opacity: navigation.getParam("opacity")
        })
    },
    [COURSE_GROUP_DETAILS]: {
      screen: CourseGroupDetails as any,
      navigationOptions: ({ navigation }: any) =>
        totaraNavigationOptions({
          title: navigation.getParam("title"),
          opacity: navigation.getParam("opacity")
        })
    },
    [COURSE_LIST]: {
      screen: CourseList as any,
      navigationOptions: ({ navigation }: any) =>
        totaraNavigationOptions({
          title: navigation.getParam("title"),
          opacity: navigation.getParam("opacity"),
          rightAction: (
            <TouchableOpacity
              onPress={() => {
                // @ts-ignore
                navigation.emit("viewCriteriaTap");
              }}
              style={{ paddingHorizontal: paddings.paddingL }}>
              <Text style={courseSet.criteriaButtonTitle}>
                {translate("navigation_stack.view_criteria")}
              </Text>
            </TouchableOpacity>
          )
        })
    },
    [WEBVIEW_ACTIVITY]: {
      screen: WebviewActivity,
      navigationOptions: ({ navigation }) => {
        const { onClose } = navigation.state.params;
        return {
          headerTitleAlign: "center",
          headerLeft: (
            <TouchableIcon
              icon={"times"}
              onPress={() => {
                onClose();
                navigation.pop();
              }}
              size={20}
            />
          )
        };
      }
    }
  },
  {
    initialRouteName: "CurrentLearning",
    initialRouteKey: "CurrentLearning"
  }
);

export default CurrentLearningStack;
