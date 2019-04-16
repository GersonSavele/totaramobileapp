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
 * @author Jun Yamog <jun.yamog@totaralearning.com
 */

import React from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import PropTypes from "prop-types";
import Carousel from "react-native-snap-carousel";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import {withNavigation} from "react-navigation";

import {normalize} from "@totara/theme";
import {Status} from "@totara/types"
import {applyBadge, learningItemCard} from "@totara/components";


const CourseSet = ({courses, navigation, nextSet, label}) => (
  <View style={styles.courseSet}>
    <View style={styles.courseSetLabel}>
      <Text style={styles.courseSetLabel}>{label}</Text>
    </View>
    <Carousel
      data={courses}
      renderItem={renderItem(navigation)}
      sliderWidth={wp("100%")}
      itemWidth={300}
      sliderHeight={hp("100%")}
      inactiveSlideOpacity={0.6}
      enableSnap={false}
      containerCustomStyle={{backgroundColor: "#FFFFFF"}}
    />
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
  </View>);

CourseSet.propTypes = {
  courses: PropTypes.array.isRequired,
  navigation: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  nextSet: PropTypes.object,
};

const renderItem = (navigation) => {
  const CourseCard = ({item}) => {

    const BadgedCourseWithSummaryWithNavigation = applyBadge(item.progressPercentage || item.status, CourseWithSummaryAndNavigation);

    return(<View style={styles.itemWithBadgeContainer}>
      <BadgedCourseWithSummaryWithNavigation item={item} navigation={navigation}/>
    </View>);
  };

  CourseCard.propTypes = {
    item: PropTypes.object.isRequired
  };

  return CourseCard;
};

const CourseWithSummaryAndNavigation = ({navigation, item}) => {
  const navigateTo = (item) => navigation.navigate("CourseDetails", {courseId: item.id});
  const learningItemStyle = (item.status === Status.active) ?
    StyleSheet.flatten([styles.learningItem, styles.activeCourse]) :
    styles.learningItem;

  return (
    (item.status !== Status.hidden) ?
      <TouchableOpacity style={learningItemStyle} key={item.id} onPress={() => navigateTo(item)} activeOpacity={1.0}>
        <View style={styles.itemContainer}>
          <CourseWithSummary item={item}/>
        </View>
      </TouchableOpacity>
      :
      <View style={learningItemStyle}>
        <View style={styles.itemContainer}>
          <CourseWithSummary item={item}/>
        </View>
      </View>);
};

CourseWithSummaryAndNavigation.propTypes = {
  item: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
};

const CourseSummary = ({item}) =>
  <View style={{flex: 1}}>
    <Text numberOfLines={3} style={styles.itemSummary}>{item.summary}</Text>
  </View>;

CourseSummary.propTypes = {
  item: PropTypes.object.isRequired
};

const CourseWithSummary = learningItemCard(CourseSummary);

const styles = StyleSheet.create({
  courseSet: {
    height: 350
  },
  itemWithBadgeContainer: {
    marginTop: hp("2.5%"),
    marginBottom: hp("3%"),
    marginLeft: 4,
    marginRight: 4
  },
  learningItem: {
    borderRadius: normalize(10),
    shadowColor: "#000",
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
    paddingBottom: 20,
    maxHeight: 80,
    fontSize: 14,
    lineHeight: 16,
    color: "#3D444B",
  },
  nextSet: {
    flex: 0,
    height: 20,
    flexDirection: "row",
    alignItems: "center"
  },
  separator: {
    backgroundColor: "#CCCCCC",
    height: 4,
    flex: 1,
    marginRight: 20,
    marginLeft: 20
  },
  nextSetText: {
    textTransform: "uppercase"
  },
  courseSetLabel: {
    fontSize: 20,
    color: "#000000",
    paddingLeft: 10,
    paddingTop: 5,
  },
});

export default withNavigation(CourseSet);