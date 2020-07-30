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
import { NavigationStackProp } from "react-navigation-stack";
import { CourseSets } from "@totara/types/CourseGroup";
import { ImageElement } from "../components/LearningItemCard";
import { translate } from "@totara/locale";
import { NAVIGATION } from "@totara/lib/navigation";
import { navigateTo } from "@totara/lib/navigation";
import { courseSet } from "./courseGroupStyles";
import { margins } from "@totara/theme/constants";
import CriteriaSheet from "../CriteriaSheet";
import NativeAccessRestriction from "../NativeAccessRestriction";
import { learningItemEnum } from "../constants";

type CourseSetProps = {
  courseSets: CourseSets;
  navigation: NavigationStackProp;
  testID: string;
};

const LearningItems = ({ item, navigation }: any) => {
  const [showRestriction, setShowRestriction] = useState(false);
  const onCloseRestriction = () => {
    setShowRestriction(!showRestriction);
  };
  return (
    <View style={courseSet.container}>
      <TouchableOpacity
        style={courseSet.learningItem}
        key={item.id}
        onPress={() => {
          if (item.native) {
            navigateTo({
              navigate: navigation.navigate,
              routeId: NAVIGATION.COURSE_DETAILS,
              props: { targetId: item.id }
            });
          } else {
            setShowRestriction(true);
          }
        }}
        activeOpacity={1.0}>
        <View style={courseSet.itemContainer}>
          <ImageElement item={item} image={item.imageSrc} itemType={learningItemEnum.Course} imageStyle={{ flex: 1 }} />
          <View style={courseSet.courseDetails}>
            <Text numberOfLines={1} style={courseSet.courseTitle}>
              {item.fullname}
            </Text>
            <Text numberOfLines={2} style={courseSet.courseSummary}>
              {item.summary}
            </Text>
          </View>
        </View>
        {showRestriction && <NativeAccessRestriction onClose={onCloseRestriction} urlView={item.urlView} />}
      </TouchableOpacity>
    </View>
  );
};

const CourseSet = ({ courseSets, navigation, testID }: CourseSetProps) => {
  const [show, setShow] = useState(false);
  const onCloseBottomSheet = () => {
    setShow(!show);
  };

  const renderItem = ({ item }: any) => {
    return <LearningItems navigation={navigation} item={item} />;
  };

  return (
    <View style={{ marginTop: margins.marginXL }} testID={testID}>
      <View style={courseSet.courseSetHeader}>
        <Text style={courseSet.title}>{courseSets.label}</Text>
        <TouchableOpacity style={courseSet.criteriaButton} onPress={onCloseBottomSheet} activeOpacity={1.0}>
          <Text style={courseSet.criteriaButtonTitle}>{translate("course_group.criteria.view_criteria")}</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={courseSets.courses}
        renderItem={renderItem}
        keyExtractor={(_, id) => id.toString()}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
      />
      {show && (
        <CriteriaSheet
          title={translate("course_group.criteria.bottom_sheet_header")}
          criteriaList={courseSets.completionCriteria}
          onClose={onCloseBottomSheet}
        />
      )}
    </View>
  );
};

export default CourseSet;
