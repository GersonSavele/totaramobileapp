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

import React, { useContext } from "react";
import { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { withNavigation } from "react-navigation";
import PropTypes from "prop-types";
import Carousel, { Pagination } from "react-native-snap-carousel";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { LearningItemCard, AddBadge } from "@totara/components";
import { resizeByScreenSize, normalize, ThemeContext } from "@totara/theme";
import { LearningItemType } from "@totara/types";
import {
  NAVIGATION_COURSE_DETAILS,
  NAVIGATION_PROGRAM_DETAILS,
  NAVIGATION_CERTIFICATE_DETAILS,
} from "@totara/lib/constants";
import { Log } from "@totara/lib";

const LearningItemCarousel = withNavigation(
  ({ navigation, currentLearning }) => {
    const [activeSlide, setActiveSlide] = useState(0);
    const sliderRef = useRef(null);

    if (currentLearning) {
      // used for faster development to navigate at once to first course-details
      // courseNavigate(currentLearning[0])
      // return null;
      const [theme] = useContext(ThemeContext);

      return (
        <View>
          <Pagination
            activeDotIndex={activeSlide}
            dotsLength={currentLearning.length}
            containerStyle={{
              borderStyle: "dashed",
              paddingVertical: 0,
              marginHorizontal: 0,
              paddingHorizontal: 0,
            }}
            dotStyle={{
              width: Dimensions.get("window").width / currentLearning.length,
              height: 1.5,
              borderRadius: 0,
              marginHorizontal: 0,
              backgroundColor: theme.colorNeutral6,
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
            onSnapToItem={(index) => setActiveSlide(index)}
          />
        </View>
      );
    } else return null;
  }
);

const renderItem = (navigation) => {
  const LearningItem = ({ item }) => (
    <View style={styles.itemWithBadgeContainer}>
      <AddBadge status={item.progress} size={24}>
        <LearningItemWithSummaryAndNavigation
          item={item}
          navigation={navigation}
        />
      </AddBadge>
    </View>
  );

  LearningItem.propTypes = {
    item: PropTypes.object.isRequired,
  };

  return LearningItem;
};

const LearningItemWithSummaryAndNavigation = ({ item, navigation }) => {
  const [theme] = useContext(ThemeContext);

  const itemStyle = StyleSheet.create({
    container: {
      borderRadius: normalize(10),
      shadowColor: theme.colorNeutral8,
      shadowOpacity: 0.16,
      shadowRadius: normalize(13),
      backgroundColor: theme.colorNeutral1,
      borderWidth: 1,
      borderColor: theme.colorNeutral3,
    },
    content: {
      borderRadius: normalize(10),
      width: "100%",
      height: "99%",
      overflow: "hidden",
    },
    type: {
      marginTop: 8,
      alignSelf: "flex-start",
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderWidth: 1,
      borderRadius: 4,
      backgroundColor: theme.colorNeutral1,
      color: theme.textColorSubdued,
      borderColor: theme.colorNeutral6,
    },
    summary: {
      flex: 1,
      alignSelf: "flex-start",
      width: "100%",
      paddingVertical: 16,
      color: theme.textColorSubdued,
    },
  });
  return (
    <TouchableOpacity
      style={itemStyle.container}
      key={item.id}
      onPress={() => navigateTo(navigation, item)}
      activeOpacity={1.0}
    >
      <View style={itemStyle.content}>
        <LearningItemCard item={item}>
          <Text style={[theme.textLabel, itemStyle.type]}>{item.itemtype}</Text>
          {/* // TODO handeling numberOfLines for dynamic height */}
          <Text
            style={[theme.textB2, itemStyle.summary]}
            ellipsizeMode="tail"
            numberOfLines={resizeByScreenSize(3, 6, 6, 8)}
          >
            {item.summary}
          </Text>
        </LearningItemCard>
      </View>
    </TouchableOpacity>
  );
};

LearningItemWithSummaryAndNavigation.propTypes = {
  item: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
};

let navigateTo = (navigation, item) => {
  switch (item.itemtype) {
    case LearningItemType.Course:
      navigation.navigate(NAVIGATION_COURSE_DETAILS, { courseId: item.id });
      break;
    case LearningItemType.Program:
      navigation.navigate(NAVIGATION_PROGRAM_DETAILS, { programId: item.id });
      break;
    case LearningItemType.Certification:
      navigation.navigate(NAVIGATION_CERTIFICATE_DETAILS, {
        certificateId: item.id,
      });
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
    marginRight: 8,
  },
});

export default LearningItemCarousel;
