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

import React, { useState } from "react";
import { Text, TouchableOpacity, View, FlatList } from "react-native";
import { CourseSets } from "@totara/types/CourseGroup";
import { translate } from "@totara/locale";
import { courseSet, horizontalList } from "./courseGroupStyles";
import CriteriaSheet from "../CriteriaSheet";
import { NAVIGATION } from "@totara/lib/navigation";
import { navigateTo } from "@totara/lib/navigation";
import Course from "./Course";

type CourseSetListProps = {
  courseSetList: [CourseSets];
  navigate: any;
  testID: string;
};

const LearningItems = ({ item, navigate }: any) => {
  const [show, setShow] = useState(false);
  const onClose = () => {
    setShow(!show);
  };
  return (
    <View style={courseSet.container} testID={"test_learning_items"}>
      <TouchableOpacity
        style={horizontalList.listWrapper}
        onPress={() =>
          navigateTo({
            navigate: navigate,
            routeId: NAVIGATION.COURSE_LIST,
            props: { coursesList: item }
          })
        }
        activeOpacity={1.0}>
        <View style={courseSet.itemContainer}>
          <View style={courseSet.headerBar}>
            <Text style={courseSet.headerTitle} testID={"test_header_title"}>
              {item.label}
            </Text>
            <TouchableOpacity
              style={courseSet.criteria}
              onPress={onClose}
              testID={"test_view_criteria_clicked"}
              activeOpacity={1.0}>
              <Text style={courseSet.criteriaButtonTitle}>
                {translate("course_group.criteria.view_criteria")}
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            {item.courses && item.courses.length > 0 && (
              <Course course={item.courses[0]} navigate={navigate} />
            )}
            {item.courses && item.courses.length > 1 && (
              <Course course={item.courses[1]} navigation={navigate} />
            )}
          </View>
        </View>
      </TouchableOpacity>
      {show && (
        <CriteriaSheet
          title={translate("course_group.criteria.bottom_sheet_header")}
          criteriaList={item.completionCriteria}
          onClose={onClose}
        />
      )}
    </View>
  );
};

const CourseSetList = ({
  courseSetList,
  navigate,
  testID
}: CourseSetListProps) => {
  const renderItems = ({ item }: any) => {
    return <LearningItems navigate={navigate} item={item} />;
  };

  return (
    <View style={horizontalList.container} testID={testID}>
      <FlatList
        data={courseSetList}
        renderItem={renderItems}
        keyExtractor={(_, id) => id.toString()}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
      />
    </View>
  );
};
export { LearningItems };
export default CourseSetList;
