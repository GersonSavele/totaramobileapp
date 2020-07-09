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

import React, { useContext, useState } from "react";
import { Text, TouchableOpacity, View, FlatList } from "react-native";
import { NavigationContext } from "react-navigation";
import { CourseSets } from "@totara/types/CourseGroup";
import { translate } from "@totara/locale";
import { courseSet, horizontalList } from "./courseGroupStyles";
import CriteriaSheet from "../CriteriaSheet";
import { NAVIGATION } from "@totara/lib/navigation";
import { navigateTo } from "@totara/lib/navigation";
import LearningItemRow from "./LearningItemRow";

const CourseSetList = ({ courseSetList }: { courseSetList: [CourseSets] }) => {
  const [show, setShow] = useState(false);
  const onClose = () => {
    setShow(!show);
  };

  const navigation = useContext(NavigationContext);
  const [, ...list] = courseSetList;

  const renderItems = (navigation) => {
    const LearningItems = ({ item }: any) => (
      <View style={courseSet.container}>
        <TouchableOpacity
          style={horizontalList.listWrapper}
          key={item.id}
          onPress={() =>
            navigateTo({
              navigate: navigation.navigate,
              routeId: NAVIGATION.COURSE_LIST,
              props: { coursesList: item }
            })
          }
          activeOpacity={1.0}>
          <View style={courseSet.itemContainer}>
            <View style={courseSet.headerBar}>
              <Text style={courseSet.headerTitle}>{item.label}</Text>
              <TouchableOpacity
                style={courseSet.criteria}
                onPress={onClose}
                activeOpacity={1.0}>
                <Text style={courseSet.criteriaButtonTitle}>
                  {translate("course_group.course_set.criteria")}
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              {item.courses.length > 0 && (
                <LearningItemRow
                  course={item.courses[0]}
                  navigation={navigation}
                />
              )}
              {item.courses.length > 1 && (
                <LearningItemRow
                  course={item.courses[1]}
                  navigation={navigation}
                />
              )}
            </View>
          </View>
        </TouchableOpacity>
        {show && (
          <CriteriaSheet
            criteriaList={item.completionCriteria}
            onClose={onClose}
          />
        )}
      </View>
    );
    return LearningItems;
  };

  return (
    <View style={horizontalList.container}>
      <FlatList
        data={list}
        renderItem={renderItems(navigation)}
        keyExtractor={(_, id) => id.toString()}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
      />
    </View>
  );
};

export default CourseSetList;
