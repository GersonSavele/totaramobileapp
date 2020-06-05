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
import {
  FlatList,
  StyleSheet,
  View,
  TouchableOpacity,
  Text
} from "react-native";
import CourseSet from "./CourseSet";
import { CourseSets, CourseGroup } from "@totara/types";
import { NavigationParams, withNavigation } from "react-navigation";
import { NAVIGATION_MY_LEARNING } from "@totara/lib/constants";
import { ThemeContext } from "@totara/theme";

type CourseListProps = {
  courseGroup: CourseGroup;
  navigation: NavigationParams;
};

const CourseList = withNavigation(
  ({ courseGroup, navigation }: CourseListProps) => {
    const [theme] = useContext(ThemeContext);
    const renderCourseSet = ({ item }: { item: CourseSets }) => (
      <CourseSet courseSets={item} navigation={navigation} />
    );
    return (
      <View>
        <FlatList
          data={courseGroup.courseSets}
          renderItem={renderCourseSet}
          keyExtractor={(item, index) => item.id.toString() + index}
          style={{ backgroundColor: theme.colorAccent }}
          showsHorizontalScrollIndicator={false}
        />
        <View style={{ margin: 10, alignItems: "center" }}>
          <Text style={[styles.titleTextStyle, { color: theme.textColorDark }]}>
            Successfully completed!
          </Text>
          <Text
            numberOfLines={5}
            style={[styles.statusTextStyle, { color: theme.textColorDark }]}>
            Many dream, some try, but only a few achieve. You are an achiever.
            You have made us all proud, keep up the good work. Congratulations
            on your graduation
          </Text>
          <TouchableOpacity
            style={[
              styles.buttonStyle,
              {
                backgroundColor: theme.colorAccent,
                borderColor: theme.textColorDark
              }
            ]}
            onPress={() => navigation!.navigate(NAVIGATION_MY_LEARNING)}
            activeOpacity={1.0}>
            <Text
              style={[styles.buttonTextTitle, { color: theme.textColorDark }]}>
              Current Learning
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  titleTextStyle: {
    fontSize: 20,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 28,
    letterSpacing: 0,
    textAlign: "center"
  },
  statusTextStyle: {
    fontSize: 15,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: "center",
    marginBottom: 20,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 12
  },
  buttonStyle: {
    borderRadius: 4,
    borderStyle: "solid",
    borderWidth: 1,
    width: 194,
    height: 48,
    marginTop: 12,
    justifyContent: "center"
  },
  buttonTextTitle: {
    fontSize: 16,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 16,
    letterSpacing: 0,
    textAlign: "center"
  }
});

export default CourseList;
