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

import React, { useContext } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import CourseSet from "./CourseSet";
import CourseSetList from "./CourseSetList";
import { CourseGroup } from "@totara/types";
import { NavigationContext } from "react-navigation";
import { statusKey } from "@totara/types/Completion";
import { translate } from "@totara/locale";
import { courses } from "./courseGroupStyles";

const Courses = ({ courseGroup }: { courseGroup: CourseGroup }) => {
  return (
    <View>
      <CourseSet courseSets={courseGroup.currentCourseSets[0]} />
      {courseGroup.completion.statuskey === statusKey.complete && <Completed />}
      {courseGroup.currentCourseSets.length > 1 && (
        <CourseSetList courseSetList={courseGroup.currentCourseSets} />
      )}
      {courseGroup.countUnavailableSets > 0 && (
        <View style={courses.unavailableSetWrap}>
          <Text style={courses.unavailableText}>
            {courseGroup.countUnavailableSets}{" "}
            {translate("course_group.courses.unavailable_sets")}
          </Text>
        </View>
      )}
    </View>
  );
};

const Completed = () => {
  const navigation = useContext(NavigationContext);
  return (
    <View style={courses.bottomView}>
      <Text style={courses.completedText}>
        {translate("course_group.courses.compete")}
      </Text>
      <Text numberOfLines={5} style={courses.endNoteText}>
        {/* TO do: this text should remove when we have got end note from graphQL query */}
        Many dream, some try, but only a few achieve. You are an achiever. You
        have made us all proud, keep up the good work. Congratulations on your
        graduation
      </Text>
      <TouchableOpacity
        style={courses.button}
        onPress={() => navigation.goBack()}
        activeOpacity={1.0}>
        <Text style={courses.buttonTextTitle}>
          {translate("course_group.courses.current_learning_button_title")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Courses;
