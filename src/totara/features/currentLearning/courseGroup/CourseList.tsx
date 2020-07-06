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

import React, { useContext, useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { NavigationContext } from "react-navigation";
import LearningItemRow from "./LearningItemRow";
import CriteriaSheet from "../CriteriaSheet";

const renderItems = (navigation) => {
  const LearningItems = ({ item }: any) => (
    <LearningItemRow course={item} navigation={navigation} />
  );
  return LearningItems;
};

const CourseList = () => {
  const navigation = useContext(NavigationContext);
  const courseList = navigation.getParam("coursesList");
  const [show, setShow] = useState(false);

  useEffect(() => {
    navigation.setParams({ title: courseList.label });
  }, [courseList.label]);

  useEffect(() => {
    const onViewCriteriaTapListener = navigation.addListener(
      "viewCriteriaTap",
      () => {
        setShow(true);
      }
    );

    return () => {
      onViewCriteriaTapListener.remove();
    };
  }, [navigation]);

  const onClose = () => {
    setShow(!show);
  };

  return (
    <View>
      <FlatList
        style={{ height: "100%" }}
        data={courseList.courses}
        renderItem={renderItems(navigation)}
        keyExtractor={(_, id) => id.toString()}
        showsHorizontalScrollIndicator={false}
      />
      {show && (
        <CriteriaSheet
          criteriaList={courseList.completionCriteria}
          onClose={onClose}
        />
      )}
    </View>
  );
};

export default CourseList;
