/**
 * This file is part of Totara Mobile
 *
 * Copyright (C) 2019 onwards Totara Learning Solutions LTD
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @author @author Tharaka Dushmantha <tharaka.dushmantha@totaralearning.com>
 *
 *
 */

import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, FlatList } from "react-native";
import PropTypes from "prop-types";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { withNavigation } from "react-navigation";
import { Course } from "@totara/types";
import { normalize } from "@totara/theme";
import { Status } from "@totara/types"
import { AddBadge, LearningItemCard } from "@totara/components";
import { NAVIGATION_COURSE_DETAILS } from "@totara/lib/Constant";
import { NavigationParams } from "react-navigation";


type CourseSetProps = {
    courses : [Course]
    navigation: NavigationParams
    nextSet: nextSetProps
    label: string
}

type nextSetProps = {
  nextID : number
  operator : string
}

const CourseSet = ({courses, navigation, nextSet, label}: CourseSetProps) => (
  <View style={styles.courseSet}>
    <View style={styles.courseSetLabel}>
      <Text style={styles.courseSetLabel}>{label}</Text>
    </View>
    <FlatList
      data={courses}
      renderItem={renderItem(navigation)}
      keyExtractor={(item, index) => item.id.toString() + index}
      horizontal={true}/>
    {
      (nextSet && nextSet.operator) ?
        <View style={styles.nextSet}>
          <View style={styles.separator}/>
          <Text style={styles.nextSetText}>{nextSet.operator}</Text>
          <View style={styles.separator}/>
        </View>
        :
        null
    }
  </View>
  );

const renderItem = (navigation : NavigationParams) => {

  const CourseCard = ({item}) =>
    <View style={styles.itemWithBadgeContainer}>
      <AddBadge status={item.progress || item.status}>
        <CourseWithSummaryAndNavigation item={item} navigation={navigation}/>
      </AddBadge>
    </View>;

  CourseCard.propTypes = {
    item: PropTypes.object.isRequired
  };

  return CourseCard;
};

const CourseWithSummaryAndNavigation = ({navigation, item}) => {
  const navigateTo = (item) => navigation.navigate(NAVIGATION_COURSE_DETAILS, {courseId: item.id});
  const learningItemStyle = (item.status === Status.active) ?
    StyleSheet.flatten([styles.learningItem, styles.activeCourse]) :
    styles.learningItem;

  const CourseDetails =
    <View style={styles.itemContainer}>
      <LearningItemCard item={item}>
        <View style={{flex: 1}}>
          <Text numberOfLines={3} style={styles.itemSummary}>{item.summary}</Text>
        </View>
      </LearningItemCard>
    </View>;

  return (
    (item.status !== Status.hidden) ?
      <TouchableOpacity style={learningItemStyle} key={item.id} onPress={() => navigateTo(item)} activeOpacity={1.0}>
        {CourseDetails}
      </TouchableOpacity>
      :
      <View style={learningItemStyle}>
        {CourseDetails}
      </View>);
};

CourseWithSummaryAndNavigation.propTypes = {
  item: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  courseSet: {
  },
  itemWithBadgeContainer: {
    marginTop: hp("3%"),
    marginBottom: hp("4%"),
    marginLeft: 16,
    marginRight: wp("3%"),
    width: wp("70"),
    height: hp("24%")
  },
  learningItem: {
    borderRadius: normalize(10),
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: normalize(10) },
    shadowOpacity: 0.16,
    shadowRadius: normalize(14),
    backgroundColor: "#FFFFFF",
  },
  activeLearningItem: {
    borderWidth: 2,
    borderColor: "#337AB7",
  },
  itemContainer: {
    borderTopRightRadius: normalize(10),
    borderTopLeftRadius: normalize(10),
    overflow: "hidden",
    width: "100%",
    height: "100%",
  },
  itemSummary: {
    flex: 10,
    paddingBottom: 24,
    paddingTop: 8,
    fontSize: 14,
    lineHeight: 16,
    color: "#3D444B",
  },
  nextSet: {
    flex: 0,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: 'transparent',
  },
  separator: {
    backgroundColor: "#D2D2D2",
    height: 2,
    flex: 1,
    marginRight: 16,
    marginLeft: 16
  },
  nextSetText: {
    textTransform: "uppercase",
    fontSize: 12,
    color: "#3D444B",
    fontWeight: "bold",
  },
  courseSetLabel: {
    fontSize: 20,
    color: "#3D444B",
    paddingLeft: 8,
  },
});

export default withNavigation(CourseSet);
