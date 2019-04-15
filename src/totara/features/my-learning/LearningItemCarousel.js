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
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {withNavigation} from "react-navigation";
import PropTypes from "prop-types";
import {Button} from "native-base";
import Carousel from "react-native-snap-carousel";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";

import {learningItemsList} from "./api";
import {learningItemCard, applyBadge} from "@totara/components";
import {normalize} from "@totara/theme";
import {LearningItemType} from "@totara/types";


const LearningItemCarousel = withNavigation(learningItemsList(({loading, currentLearning, error, navigation}) => {

  if (loading) return <Text>Loading...</Text>;

  if (error) {
    console.log("error", error); // TODO turn this into a logging system
    return <Text>Error :(</Text>;
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

  const LearningItem = ({item}) => {

    const BadgeLearningItemWithSummaryAndNavigation = applyBadge(item.progressPercentage || item.status, LearningItemWithSummaryAndNavigation);

    return (<View style={styles.itemWithBadgeContainer}>
      <BadgeLearningItemWithSummaryAndNavigation item={item} navigation={navigation}/>
    </View>);
  };

  LearningItem.propTypes = {
    item: PropTypes.object.isRequired
  };

  return LearningItem;

};

const LearningItemWithSummaryAndNavigation = ({...props}) => (
  <TouchableOpacity style={styles.learningItem}
                    key={props.item.id}
                    onPress={() => navigateTo(props.navigation, props.item)}
                    activeOpacity={1.0}>
    <View style={styles.itemContainer}>
      <LearningItemWithSummary {...props}/>
    </View>
  </TouchableOpacity>);

LearningItemWithSummaryAndNavigation.propTypes = {
  item: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired
};

const SummaryAndStartButton = ({item}) => (
  <View style={{flex: 1}}>
    <Text numberOfLines={3} style={styles.itemSummary}>{item.summary}</Text>
    <View style={{flex: 1}}/>
    <Button block><Text style={styles.buttonText}>Start this {item.type}</Text></Button>
  </View>);

SummaryAndStartButton.propTypes = {
  item: PropTypes.object.isRequired
};

const LearningItemWithSummary = learningItemCard(SummaryAndStartButton);

let navigateTo = (navigation, item) => {
  switch (item.type) {
    case LearningItemType.Course:
      navigation.navigate("CourseDetails", {courseId: item.id});
      break;
    case LearningItemType.Program:
      navigation.navigate("ProgramDetails", {programId: item.id});
      break;
    case LearningItemType.Certification: // TODO for now certifaction is the same as Program
      navigation.navigate("ProgramDetails", {programId: item.id});
      break;
    default:
      console.error("unknown type", item); // TODO turn this into a logging system
  }
};


const styles = StyleSheet.create({
  itemWithBadgeContainer: {
    marginTop: hp("2.5%"),
    marginBottom: hp("3%"),
    marginLeft: 4,
    marginRight: 4,
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
    paddingBottom: 20,
    maxHeight: 80,
    fontSize: 14,
    lineHeight: 16,
    color: "#3D444B",
  },
  buttonText: {
    color: "#FFFFFF",
    padding: 5
  }
});


export default LearningItemCarousel;