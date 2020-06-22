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
import { Text, TouchableOpacity, View, FlatList } from "react-native";
import { NavigationContext } from "react-navigation";
import { CourseSets } from "@totara/types/CourseGroup";
import { ImageElement } from "@totara/components";
import { translate } from "@totara/locale";
import { NAVIGATION_COURSE_DETAILS } from "@totara/lib/constants";
import { navigateTo } from "@totara/lib/navigation";
import { courseSet } from "../courseGroupStyle";
import { margins } from "@totara/theme/constants";

type CourseSetProps = {
  courseSets: CourseSets;
};

const renderItem = (navigation) => {
  const LearningItem = ({ item }: any) => (
    <View style={courseSet.container}>
      <TouchableOpacity
        style={courseSet.learningItem}
        key={item.id}
        onPress={() =>
          navigateTo({
            navigate: navigation.navigate,
            routeId: NAVIGATION_COURSE_DETAILS,
            props: { targetId: item.id }
          })
        }
        activeOpacity={1.0}>
        <View style={courseSet.itemContainer}>
          <ImageElement
            item={item}
            image={item.imageSrc}
            imageStyle={{ flex: 1 }}
          />
          <View style={courseSet.courseDetails}>
            <Text numberOfLines={1} style={courseSet.courseTitle}>
              {item.fullname}
            </Text>
            <Text numberOfLines={2} style={courseSet.courseSummery}>
              {item.summary}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  return LearningItem;
};

const CourseSet = ({ courseSets }: CourseSetProps) => {
  const navigation = useContext(NavigationContext);
  return (
    <View style={{ marginTop: margins.marginXL }}>
      <View style={courseSet.courseSetHeader}>
        <Text style={courseSet.title}>{courseSets.label}</Text>
        <TouchableOpacity
          style={courseSet.criteriaButton}
          onPress={() => {}}
          activeOpacity={1.0}>
          <Text style={courseSet.criteriaButtonTitle}>
            {translate("course_group.course_set.criteria")}
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={courseSets.courses}
        renderItem={renderItem(navigation)}
        keyExtractor={(_, id) => id.toString()}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
      />
      {courseSets.nextsetoperator && (
        <View style={courseSet.nextSet}>
          <View style={courseSet.separator} />
          <Text style={courseSet.nextSetText}>
            {courseSets.nextsetoperator}
          </Text>
          <View style={courseSet.separator} />
        </View>
      )}
    </View>
  );
};

export default CourseSet;
