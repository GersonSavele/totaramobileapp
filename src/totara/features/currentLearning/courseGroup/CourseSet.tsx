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
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp
} from "react-native-responsive-screen";
import { withNavigation, NavigationParams } from "react-navigation";
import { Course, CourseSets } from "@totara/types";
import { normalize } from "@totara/theme";
import { AddBadge, LearningItemCard } from "@totara/components";
import { ThemeContext } from "@totara/theme";

type CourseSetProps = {
  courseSets: CourseSets;
  navigation: NavigationParams;
};

const CourseSet = ({ courseSets }: CourseSetProps) => {
  const [theme] = useContext(ThemeContext);
  return (
    <View style={styles.courseSet}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          flex: 1
        }}>
        <Text style={[styles.courseSetLabel, { color: theme.colorNeutral8 }]}>
          {courseSets.label}
        </Text>
        <TouchableOpacity
          style={{
            flex: 0.6,
            paddingRight: 16,
            alignItems: "flex-end",
            justifyContent: "flex-end"
          }}
          onPress={() => {}}
          activeOpacity={1.0}>
          <Text
            style={{
              textAlign: "center",
              fontSize: normalize(17),
              color: theme.colorInfo
            }}>
            View criteria
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={courseSets.courses}
        renderItem={renderItem}
        keyExtractor={(item, id) => id.toString()}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
      />
      {courseSets.nextSet && courseSets.nextSet.operator ? (
        <View style={styles.nextSet}>
          <View
            style={[styles.separator, { backgroundColor: theme.colorNeutral6 }]}
          />
          <Text
            style={[
              styles.nextSetText,
              { color: theme.navigationHeaderTintColor }
            ]}>
            {courseSets.nextSet.operator}
          </Text>
          <View
            style={[styles.separator, { backgroundColor: theme.colorNeutral6 }]}
          />
        </View>
      ) : null}
    </View>
  );
};

// const renderItem = (navigation: NavigationParams) => {
//   const CourseCard = (renderCourse : any) => {
//     <View style={styles.itemWithBadgeContainer}>
//       <AddBadge status={course.completion.progress}>
//         <CourseWithSummaryAndNavigation item={course} navigation={navigation} />
//       </AddBadge>
//     </View>
//   };
//   return CourseCard;
// };

// TO do: We have to remove this any type once API has been done
const renderItem = (renderCourse: any) => {
  return (
    <View style={styles.itemWithBadgeContainer}>
      <AddBadge status={renderCourse.item.data.course.completion.progress}>
        <CourseWithSummaryAndNavigation item={renderCourse.item.data.course} />
      </AddBadge>
    </View>
  );
};

type SummeryAndNavigationProps = {
  item: Course;
  navigation?: NavigationParams;
};

const CourseWithSummaryAndNavigation = ({
  // navigation,
  item
}: SummeryAndNavigationProps) => {
  // const navigateTo = (item: Course) =>
  // navigation.navigate(NAVIGATION_COURSE_DETAILS, { courseId: item.id });
  const [theme] = useContext(ThemeContext);
  const learningItemStyle = StyleSheet.flatten([
    styles.learningItem,
    { shadowColor: theme.colorNeutral8, backgroundColor: theme.colorNeutral1 }
  ]);
  const CourseDetails = (
    <View style={styles.itemContainer}>
      <LearningItemCard item={item} image={item.image}>
        <View style={{ flex: 1 }}>
          <Text
            numberOfLines={3}
            style={[styles.itemSummary, { color: theme.colorNeutral7 }]}>
            {item.summary}
          </Text>
        </View>
      </LearningItemCard>
    </View>
  );

  return (
    <TouchableOpacity
      style={learningItemStyle}
      key={item.id}
      // onPress={() => navigateTo(item)}
      activeOpacity={1.0}>
      {CourseDetails}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  courseSet: {
    marginTop: 20
  },
  itemWithBadgeContainer: {
    marginTop: hp("3%"),
    marginBottom: hp("4%"),
    marginLeft: 16,
    marginRight: wp("3%"),
    width: wp("70"),
    height: normalize(220)
  },
  learningItem: {
    borderRadius: normalize(10),
    shadowOffset: { width: 0, height: normalize(10) },
    shadowOpacity: 0.16,
    shadowRadius: normalize(14)
  },
  itemContainer: {
    borderTopRightRadius: normalize(10),
    borderTopLeftRadius: normalize(10),
    overflow: "hidden",
    width: "100%",
    height: "100%"
  },
  itemSummary: {
    flex: 10,
    paddingBottom: 10,
    paddingTop: 8,
    fontSize: 15,
    lineHeight: 15
  },
  nextSet: {
    flex: 0,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent"
  },
  separator: {
    height: 2,
    flex: 1,
    marginRight: 16,
    marginLeft: 16
  },
  nextSetText: {
    textTransform: "uppercase",
    fontSize: 12,
    fontWeight: "bold"
  },
  courseSetLabel: {
    fontSize: 22,
    marginLeft: 16,
    fontWeight: "bold",
    flex: 1
  }
});

export default withNavigation(CourseSet);
