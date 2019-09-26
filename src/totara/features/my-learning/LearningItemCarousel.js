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
 *
 */

import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { withNavigation } from "react-navigation";
import PropTypes from "prop-types";
import { Button } from "native-base";
import Carousel from "react-native-snap-carousel";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

import { LearningItemCard, AddBadge } from "@totara/components";
import { normalize } from "@totara/theme";
import { LearningItemType } from "@totara/types";
import { translate } from "@totara/locale";
import { NAVIGATION_COURSE_DETAILS, NAVIGATION_PROGRAM_DETAILS } from "@totara/lib/Constant";
import { Log } from "@totara/lib";

import { learningItemsList } from "./api";


const LearningItemCarousel = withNavigation(learningItemsList(({loading, currentLearning, error, navigation}) => {

  if (loading) return <Text>{translate("general.loading")}</Text>;

  if (error) {
    Log.error("Error getting course details", error);
    return <Text>{translate("general.error")}(</Text>; // TODO MOB-123 make this UI better
  }

  if (currentLearning) {
    // used for faster development to navigate at once to first course-details
    // courseNavigate(currentLearning[0])
    // return null;
    return (
      <Carousel
        data={currentLearning}
        renderItem={renderItem(navigation)}
        sliderWidth={wp("100%")}
        itemWidth={wp("82%")}
        sliderHeight={hp("100%")}
        inactiveSlideOpacity={0.6}
        containerCustomStyle={{backgroundColor: "#FFFFFF"}}
      />
    );

  } else return null;
}));

const renderItem = (navigation) => {

  const LearningItem = ({item}) =>
    <View style={styles.itemWithBadgeContainer}>
      <AddBadge status={item.progressPercentage || item.status}>
        <LearningItemWithSummaryAndNavigation item={item} navigation={navigation}/>
      </AddBadge>
    </View>;

  LearningItem.propTypes = {
    item: PropTypes.object.isRequired
  };

  return LearningItem;

};

const LearningItemWithSummaryAndNavigation = ({item, navigation}) => (
  <TouchableOpacity style={styles.learningItem}
                    key={item.id}
                    onPress={() => navigateTo(navigation, item)}
                    activeOpacity={1.0}>
    <View style={styles.itemContainer}>
      <LearningItemCard item={item}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemType}>{item.type}</Text>
        </View>
        <View style={{flex: 1}}>
          <Text numberOfLines={3} style={styles.itemSummary}>{item.summary}</Text>
          <View style={{flex: 1}}/>
        </View>
      </LearningItemCard>
    </View>
  </TouchableOpacity>);

LearningItemWithSummaryAndNavigation.propTypes = {
  item: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired
};

let navigateTo = (navigation, item) => {
  switch (item.type) {
    case LearningItemType.Course:
      navigation.navigate(NAVIGATION_COURSE_DETAILS, {courseId: item.id});
      break;
    case LearningItemType.Program :  
      navigation.navigate(NAVIGATION_PROGRAM_DETAILS, {programId: item.id});
      break;
    case LearningItemType.Certification: // TODO for now certifaction is the same as Program
      navigation.navigate(NAVIGATION_PROGRAM_DETAILS, {programId: item.id});
      break;
    default:
      Log.error(`Unknown type ${item.type}, unable to native to`, new Error(), item);
  }
};


const styles = StyleSheet.create({
  itemWithBadgeContainer: {
    marginTop: hp("2.5%"),
    marginBottom: hp("3%"),
    marginLeft: 8,
    marginRight: 8,
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
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  itemSummary: {
    flex: 10,
    paddingBottom: 24,
    paddingTop: 16,
    maxHeight: 125,
    fontSize: 15,
    lineHeight: 20,
    color: "#3D444B",
  },
  buttonText: {
    color: "#3D444B",
    padding: 5
  },
  secondaryButton: {
    borderColor: "#3D444B",
  },
  itemInfo: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    maxHeight: 16,
    paddingTop: 4,
  },
  itemType: {
    fontSize: 12,
    color: "#A0A0A0"
  },
});


export default LearningItemCarousel;
