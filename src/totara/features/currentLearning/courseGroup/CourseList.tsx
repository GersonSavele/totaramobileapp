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

import React, { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { NavigationStackProp } from "react-navigation-stack";
import Course from "./Course";
import { translate } from "@totara/locale";
import CriteriaSheet from "../components/CriteriaSheet";
import CurrentLearningListViewItem from "@totara/features/currentLearning/learningItems/CurrentLearningListViewItem";

const LearningItems = ({ item, navigation }: any) => {
  return <CurrentLearningListViewItem item={item} navigation={navigation} />;
};

type CourseListProps = {
  navigation: NavigationStackProp;
};

const CourseList = ({ navigation }: CourseListProps) => {
  const courseList = navigation.state.params!.coursesList;
  const [show, setShow] = useState(false);

  useEffect(() => {
    navigation.state.params!.title = courseList.label;
  }, [courseList.label]);

  useEffect(() => {
    const onViewCriteriaTapListener = navigation.addListener("viewCriteriaTap", () => {
      setShow(true);
    });

    return () => {
      onViewCriteriaTapListener.remove();
    };
  }, [navigation]);

  const onClose = () => {
    setShow(!show);
  };

  const renderItems = ({ item }: any) => {
    return <LearningItems navigation={navigation} item={item} />;
  };

  return (
    <View testID={"test_course_list"}>
      <FlatList
        style={{ height: "100%" }}
        data={courseList.courses}
        renderItem={renderItems}
        keyExtractor={(_, id) => id.toString()}
        showsHorizontalScrollIndicator={false}
      />
      {show && (
        <CriteriaSheet
          title={translate("course_group.criteria.bottom_sheet_header")}
          criteriaList={courseList.completionCriteria}
          onClose={onClose}
        />
      )}
    </View>
  );
};

export { LearningItems };
export default CourseList;
