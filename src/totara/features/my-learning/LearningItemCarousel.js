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
import { useState, useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from "react-native";
import { withNavigation } from "react-navigation";
import PropTypes from "prop-types";
import Carousel, { Pagination } from "react-native-snap-carousel";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { LearningItemCard, AddBadge } from "@totara/components";
import { normalize } from "@totara/theme";
import { LearningItemType } from "@totara/types";
import {
  NAVIGATION_COURSE_DETAILS,
  NAVIGATION_PROGRAM_DETAILS
} from "@totara/lib/Constant";
import { Log } from "@totara/lib";

const LearningItemCarousel = withNavigation(
  ({ navigation, currentLearning }) => {
    const [activeSlide, setActiveSlide] = useState(0);
    const sliderRef = useRef(null)

    if (currentLearning) {
      // used for faster development to navigate at once to first course-details
      // courseNavigate(currentLearning[0])
      // return null;
      return (
        <View>
            <Pagination 
              activeDotIndex={activeSlide}
              dotsLength={currentLearning.length}
              containerStyle={{ borderStyle: "dashed", paddingVertical: 0, marginHorizontal: 0, paddingHorizontal: 0 }}
              dotStyle={{
                  width: (Dimensions.get("window").width)/(currentLearning.length),
                  height: 1.5,
                  borderRadius: 0,
                  marginHorizontal: 0,
                  backgroundColor: "#b2b2b2",
              }}
              dotContainerStyle={{
                marginHorizontal: 0,
              }}
              carouselRef={sliderRef.current}
              tappableDots={sliderRef && !!sliderRef.current}
              inactiveDotOpacity={0}
              inactiveDotScale={1}
            />
          <Carousel
            ref={sliderRef}
            data={currentLearning}
            renderItem={renderItem(navigation)}
            sliderWidth={wp("100%")}
            itemWidth={wp("82%")}
            sliderHeight={hp("100%")}
            inactiveSlideOpacity={0.6}
            containerCustomStyle={{ backgroundColor: "#FFFFFF" }}
            onSnapToItem={index => setActiveSlide(index)}
          />
        </View>
      );
    } else return null;
  }
);

const renderItem = navigation => {
  const LearningItem = ({ item }) => (
    <View style={styles.itemWithBadgeContainer}>
      <AddBadge status={item.progressPercentage || item.status} size={21}>
        <LearningItemWithSummaryAndNavigation
          item={item}
          navigation={navigation}
        />
      </AddBadge>
    </View>
  );

  LearningItem.propTypes = {
    item: PropTypes.object.isRequired
  };

  return LearningItem;
};

const LearningItemWithSummaryAndNavigation = ({ item, navigation }) => (
  <TouchableOpacity
    style={styles.learningItem}
    key={item.id}
    onPress={() => navigateTo(navigation, item)}
    activeOpacity={1.0}
  >
    <View style={styles.itemContainer}>
      <LearningItemCard item={item}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemType}>{item.itemtype}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text numberOfLines={3} style={styles.itemSummary}>
            {item.summary}
          </Text>
          <View style={{ flex: 1 }} />
        </View>
      </LearningItemCard>
    </View>
  </TouchableOpacity>
);

LearningItemWithSummaryAndNavigation.propTypes = {
  item: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired
};

let navigateTo = (navigation, item) => {
  switch (item.type) {
    case LearningItemType.Course:
      navigation.navigate(NAVIGATION_COURSE_DETAILS, { courseId: item.id });
      break;
    case LearningItemType.Program:
      navigation.navigate(NAVIGATION_PROGRAM_DETAILS, { programId: item.id });
      break;
    case LearningItemType.Certification: // TODO for now certifaction is the same as Program
      navigation.navigate(NAVIGATION_PROGRAM_DETAILS, { programId: item.id });
      break;
    default:
      Log.error(
        `Unknown type ${item.type}, unable to native to`,
        new Error(),
        item
      );
  }
};

const styles = StyleSheet.create({
  itemWithBadgeContainer: {
    marginTop: hp("2.5%"),
    marginBottom: hp("3%"),
    marginLeft: 8,
    marginRight: 8
  },
  learningItem: {
    borderRadius: normalize(10),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: normalize(10) },
    shadowOpacity: 0.16,
    shadowRadius: normalize(14),
    backgroundColor: "#FFFFFF",
  },
  itemContainer: {
    borderTopRightRadius: normalize(10),
    borderTopLeftRadius: normalize(10),
    width: "100%",
    height: "100%",
    overflow: "hidden"
  },
  itemSummary: {
    flex: 10,
    paddingBottom: 24,
    paddingTop: 16,
    maxHeight: 125,
    fontSize: 15,
    lineHeight: 20,
    color: "#3D444B"
  },
  buttonText: {
    color: "#3D444B",
    padding: 5
  },
  secondaryButton: {
    borderColor: "#3D444B"
  },
  itemInfo: {
    flexDirection: "row",
    paddingTop: 8
  },
  itemType: {
    fontSize: 10,
    color: "#A0A0A0",
    borderRadius: 4,
    borderColor: "#A0A0A0",
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2
  }
});

export default LearningItemCarousel;
