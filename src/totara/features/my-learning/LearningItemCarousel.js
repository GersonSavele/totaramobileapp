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
import {learningItemCard} from "@totara/components";
import {normalize} from "@totara/theme";


const LearningItemCarousel = withNavigation(learningItemsList(({loading, currentLearning, error, navigation}) => {

  let courseNavigate = (course) => navigation.navigate("Course", {item: course});

  const LearningItem = ({item}) => {

    class LearningItemSummaryAndStartButton extends React.Component {
      render() {
        return(
          <View style={{flex: 1}}>
            <Text numberOfLines={3} style={styles.itemSummary}>{item.summary}</Text>
            <View style={{flex: 1}}/>
            <Button block><Text style={styles.buttonText}>Start this {item.type}</Text></Button>
          </View>);
      }
    }

    const LearningItemWithSummary = learningItemCard(LearningItemSummaryAndStartButton);

    return (
      <TouchableOpacity style={styles.learningItem} key={item.id} onPress={() => courseNavigate(item)} activeOpacity={1.0}>
        <View style={styles.itemContainer}>
          <LearningItemWithSummary item={item}/>
        </View>
      </TouchableOpacity>
    );

  };

  LearningItem.propTypes = {
    item: PropTypes.object.isRequired
  };

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
        renderItem={LearningItem}
        sliderWidth={wp("100%")}
        itemWidth={wp("82%")}
        sliderHeight={hp("100%")}
        inactiveSlideOpacity={0.6}
      />
    );

  } else return null;
}));

const styles = StyleSheet.create({
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
  buttonText: {
    color: "#FFFFFF",
    padding: 5
  }
});


export default LearningItemCarousel;