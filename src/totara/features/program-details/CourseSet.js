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
import {normalize} from "@totara/theme";


const CourseCard = (navigateTo) => ({item}) => {

  class CourseSummary extends React.Component {
    render() {
      return(
        <View style={{flex: 1}}>
          <Text numberOfLines={3} style={styles.itemSummary}>{item.summary}</Text>
        </View>);
    }
  }

  const CourseWithSummary = learningItemCard(CourseSummary);

  return (
    <TouchableOpacity style={styles.learningItem} key={item.id} onPress={() => navigateTo(item)} activeOpacity={1.0}>
      <View style={styles.itemContainer}>
        <CourseWithSummary item={item}/>
      </View>
    </TouchableOpacity>
  );

};

CourseCard.propTypes = {
  item: PropTypes.object.isRequired
};


class CourseSet extends React.Component {

  render() {

    const {courses, navigateTo} = this.props;

    return (
      <View style={styles.courseSet}>
        <Carousel
          data={courses}
          renderItem={CourseCard(navigateTo)}
          sliderWidth={wp("100%")}
          itemWidth={350}
          sliderHeight={hp("100%")}
          inactiveSlideOpacity={0.6}
          enableSnap={false}
        />
        <Text>--------------------------Next-----------------------</Text>
      </View>
    );

  }
}

CourseSet.propTypes = {
  courses: PropTypes.array.isRequired
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
});


export default CourseSet;