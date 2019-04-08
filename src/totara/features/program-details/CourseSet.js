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
import {learningItemCard} from "@totara/components";
import PropTypes from "prop-types";
import Carousel from "react-native-snap-carousel";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import {withNavigation} from "react-navigation";


import {normalize} from "@totara/theme";


const CourseCardAndNavigation = (navigation) => {
  const CourseCard = ({item}) => {

    class CourseSummary extends React.Component {
      render() {
        return (
          <View style={{flex: 1}}>
            <Text numberOfLines={3} style={styles.itemSummary}>{item.summary}</Text>
          </View>);
      }
    }

    const CourseWithSummary = learningItemCard(CourseSummary);
    const navigateTo = (item) => navigation.navigate("CourseDetails", {courseId: item.id});

    return (
      <TouchableOpacity style={styles.learningItem} key={item.id} onPress={() => navigateTo(item)}
                        activeOpacity={1.0}>
        <View style={styles.itemContainer}>
          <CourseWithSummary item={item}/>
        </View>
      </TouchableOpacity>
    );
  };

  CourseCard.propTypes = {
    item: PropTypes.object.isRequired
  };

  return CourseCard;
};


class CourseSet extends React.Component {

  render() {

    const {courses, navigation, nextSet} = this.props;

    return (
      <View style={styles.courseSet}>
        <Carousel
          data={courses}
          renderItem={CourseCardAndNavigation(navigation)}
          sliderWidth={wp("100%")}
          itemWidth={350}
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
  nextSet: PropTypes.object
};

const styles = StyleSheet.create({
  courseSet: {
    height: 300
  },
  learningItem: {
    flex: 1,
    marginTop: hp("2.5%"),
    marginBottom: hp("3%"),
    borderRadius: normalize(10),

    shadowColor: "#000",
    shadowOffset: { width: 0, height: normalize(10) },
    shadowOpacity: 0.16,
    shadowRadius: normalize(14),
    backgroundColor: "#FFFFFF"
  },
  itemContainer: {
    flex: 1,
    borderTopRightRadius: normalize(10),
    borderTopLeftRadius: normalize(10),
    overflow: "hidden",
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
  }
});


export default withNavigation(CourseSet);