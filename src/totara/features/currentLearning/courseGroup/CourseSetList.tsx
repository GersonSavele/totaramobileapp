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
import { margins, paddings } from "@totara/theme/constants";
import { TotaraTheme } from "@totara/theme/Theme";

const renderItem = (navigation) => {
  const LearningItems = ({ item }: any) => (
    <View style={courseSet.container}>
      <View style={courseSet.learningItem}>
        <View style={courseSet.itemContainer}>
          <View
            style={{
              backgroundColor: TotaraTheme.colorNeutral2,
              height: 54,
              flexDirection: "row",
              justifyContent: "space-between"
            }}>
            <Text
              style={{
                ...TotaraTheme.textHeadline,
                marginLeft: 16,
                alignSelf: "flex-end",
                marginBottom: 4
              }}>
              {item.label}
            </Text>
            <TouchableOpacity
              style={courseSet.criteriaButton}
              onPress={() => {}}
              activeOpacity={1.0}>
              <Text
                style={{
                  ...TotaraTheme.textMedium,
                  marginRight: 16,
                  alignSelf: "flex-end",
                  marginBottom: 4
                }}>
                {translate("course_group.course_set.criteria")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  return LearningItems;
};

// const Row = ()=>{
//   return(
//     // <View style = {{}}>
//     //   <ImageElement
//     // </View>
//   )
// }

const CourseSetList = ({ courseSetList }: { courseSetList: [CourseSets] }) => {
  const navigation = useContext(NavigationContext);
  const [, ...list] = courseSetList;
  console.log("print ----", list);
  return (
    <View
      style={{
        marginVertical: margins.marginL,
        backgroundColor: TotaraTheme.colorNeutral2
      }}>
      <View style={{ height: 60 }}></View>
      <FlatList
        data={list}
        renderItem={renderItem(navigation)}
        keyExtractor={(_, id) => id.toString()}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
      />
    </View>
  );
};

export default CourseSetList;
