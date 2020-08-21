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

import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { NavigationStackProp } from "react-navigation-stack";
import CourseSet from "./CourseSet";
import CourseSetList from "./CourseSetList";
import { CourseGroup, StatusKey } from "@totara/types/CourseGroup";
import { translate } from "@totara/locale";
import { courses } from "./courseGroupStyles";
import { CourseSets } from "@totara/types/CourseGroup";
import listViewStyles from "@totara/theme/listView";

type CoursesProps = {
  courseGroup: CourseGroup;
  navigation: NavigationStackProp;
};

const Courses = ({ courseGroup, navigation }: CoursesProps) => {
  return (
    <View>
      {courseGroup.currentCourseSets.map((item: [CourseSets], key: number) => {
        return (
          <View key={key}>
            {item.length == 1 && <CourseSet courseSets={item[0]} navigation={navigation} testID={"test_course_set"} />}
            {item.length > 1 && (
              <CourseSetList courseSetList={item} navigate={navigation.navigate} testID={"test_course_set_list"} />
            )}
            {item[item.length - 1] && item[item.length - 1].nextsetoperator && (
              <View style={courses.nextSet}>
                <View style={{ ...listViewStyles.thickSeparator, flex: 1 }} />
                <Text style={courses.nextSetText}>{item[item.length - 1].nextsetoperator}</Text>
                <View style={{ ...listViewStyles.thickSeparator, flex: 1 }} />
              </View>
            )}
          </View>
        );
      })}
      {courseGroup.completion.statuskey === StatusKey.completed && (
        <Completed endnote={courseGroup.endnote} navigation={navigation} testID={"test_program_completed"} />
      )}
      {courseGroup.countUnavailableSets > 0 && (
        <View style={courses.unavailableSetWrap} testID={"test_unavailable_set"}>
          <Text style={courses.unavailableText} testID={"test_unavailable_set_title"}>
            {courseGroup.countUnavailableSets} {translate("course_group.courses.unavailable_sets")}
          </Text>
        </View>
      )}
    </View>
  );
};

type CompletedProps = {
  endnote?: string;
  navigation: NavigationStackProp;
  testID: string;
};

const Completed = ({ endnote, navigation, testID }: CompletedProps) => {
  return (
    <View style={courses.bottomView} testID={testID}>
      <Text style={courses.completedText}>{translate("course_group.courses.compete")}</Text>
      <Text numberOfLines={5} style={courses.endNoteText} testID={"test_endnote"}>
        {endnote}
      </Text>
      <TouchableOpacity
        style={courses.button}
        testID={"test_go_back_button"}
        onPress={() => navigation.goBack()}
        activeOpacity={1.0}>
        <Text style={courses.buttonTextTitle}>{translate("course_group.courses.current_learning_button_title")}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Courses;
