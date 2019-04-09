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
import {applyBadge, learningItemCard} from "@totara/components";
import PropTypes from "prop-types";
import Carousel from "react-native-snap-carousel";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import {withNavigation} from "react-navigation";


import {normalize} from "@totara/theme";


const CourseSummary = ({item}) =>
  <View style={{flex: 1}}>
    <Text numberOfLines={3} style={styles.itemSummary}>{item.summary}</Text>
  </View>;

CourseSummary.propTypes = {
  item: PropTypes.object.isRequired
};

const CourseCard = (navigation) => ({item}) => {

  const navigateTo = (item) => navigation.navigate("CourseDetails", {courseId: item.id});
  const CourseWithSummary = learningItemCard(() => <CourseSummary item={item}/>);

  const CourseWithSummaryAndNavigiation = () => (item.status != "hidden") ?
    <TouchableOpacity style={styles.learningItem} key={item.id} onPress={() => navigateTo(item)} activeOpacity={1.0}>
      <View style={styles.itemContainer}>
        <CourseWithSummary item={item}/>
      </View>
    </TouchableOpacity>
    :
    <View style={styles.itemContainer}>
      <CourseWithSummary item={item}/>
    </View>;

  const BadgedCourseWithSummaryWithNavigation = applyBadge(item.status || item.progressPercentage, CourseWithSummaryAndNavigiation);

  return(<View style={{marginTop: hp("2.5%"), marginBottom: hp("3%"),}}>
    <BadgedCourseWithSummaryWithNavigation/>
  </View>);
};

class CourseSet extends React.Component {

  render() {

    const {courses, navigation, nextSet, label} = this.props;

    return (
      <View style={styles.courseSet}>
        <View style={styles.courseSetLabel}>
          <Text style={styles.courseSetLabel}>{label}</Text>
        </View>
        <Carousel
          data={courses}
          renderItem={CourseCard(navigation)}
          sliderWidth={wp("100%")}
          itemWidth={300}
          sliderHeight={hp("100%")}
          inactiveSlideOpacity={0.6}
          enableSnap={false}
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
      </View>
    );

  }
}

CourseSet.propTypes = {
  courses: PropTypes.array.isRequired,
  navigation: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  nextSet: PropTypes.object,
};

const styles = StyleSheet.create({
  courseSet: {
    height: 350
  },
  learningItem: {
    borderRadius: normalize(10),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: normalize(10) },
    shadowOpacity: 0.16,
    shadowRadius: normalize(14),
    backgroundColor: "#FFFFFF"
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
  }
});


export default withNavigation(CourseSet);