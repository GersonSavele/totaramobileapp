/**
 * This file is part of Totara Enterprise.
 *
 * Copyright (C) 2020 onwards Totara Learning Solutions LTD
 *
 * Totara Enterprise is provided only to Totara Learning Solutions
 * LTD’s customers and partners, pursuant to the terms and
 * conditions of a separate agreement with Totara Learning
 * Solutions LTD or its affiliate.
 *
 * If you do not have an agreement with Totara Learning Solutions
 * LTD, you may not access, use, modify, or distribute this software.
 * Please contact [sales@totaralearning.com] for more information.
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
  ScrollView,
  RefreshControl
} from "react-native";
import { withNavigation } from "react-navigation";
import { useNetInfo } from "@react-native-community/netinfo";
import PropTypes from "prop-types";
import Carousel, { Pagination } from "react-native-snap-carousel";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";

import { LearningItemCard, AddBadge } from "@totara/components";
import { resizeByScreenSize, normalize, ThemeContext } from "@totara/theme";
import { navigateTo } from "@totara/lib/navigation";
import { itemToRouteMap } from "@totara/lib/constants";
import Restriction from "./Restriction";

const LearningItemCarousel = withNavigation(
  ({ navigation, currentLearning, loading, onRefresh }) => {
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
              paddingHorizontal: 0
            }}
            dotStyle={{
              width: Dimensions.get("window").width / currentLearning.length,
              height: 1.5,
              borderRadius: 0,
              marginHorizontal: 0,
              backgroundColor: theme.colorNeutral6
            }}
            dotContainerStyle={{
              marginHorizontal: 0
            }}
            carouselRef={sliderRef.current}
            tappableDots={sliderRef && !!sliderRef.current}
            inactiveDotOpacity={0}
            inactiveDotScale={1}
          />
          <ScrollView
            style={{ height: "100%" }}
            contentContainerStyle={{ height: "100%" }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={onRefresh} />
            }>
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
          </ScrollView>
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
    item: PropTypes.object.isRequired
  };
  return LearningItem;
};

const LearningItemWithSummaryAndNavigation = ({ item, navigation }) => {
  const [theme] = useContext(ThemeContext);
  const { isConnected, isInternetReachable } = useNetInfo();
  const [showRestriction, setShowRestriction] = useState(false);
  const isOnline = isConnected && isInternetReachable;
  const itemStyle = StyleSheet.create({
    container: {
      borderRadius: normalize(10),
      shadowColor: theme.colorNeutral8,
      shadowOpacity: 0.16,
      shadowRadius: normalize(13),
      backgroundColor: theme.colorNeutral1,
      borderWidth: 1,
      borderColor: theme.colorNeutral3
    },
    content: {
      borderRadius: normalize(10),
      width: "100%",
      height: "99%",
      overflow: "hidden"
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
      borderColor: theme.colorNeutral6
    },
    summary: {
      flex: 1,
      alignSelf: "flex-start",
      width: "100%",
      paddingVertical: 16,
      color: theme.textColorSubdued
    }
  });

  const clickedLearningItem = () => {
    if (isOnline) {
      if (item.native) {
        navigateTo({
          navigate: navigation.navigate,
          routeId: itemToRouteMap[item.itemtype],
          props: { targetId: item.id }
        });
      } else {
        setShowRestriction(true);
      }
    }
  };

  const onClose = () => {
    setShowRestriction(!showRestriction);
  };

  return (
    <TouchableOpacity
      style={itemStyle.container}
      key={item.id}
      onPress={clickedLearningItem}
      activeOpacity={1.0}>
      <View style={itemStyle.content}>
        <LearningItemCard item={item} image={item.imageSrc}>
          <Text style={[theme.textLabel, itemStyle.type]}>{item.itemtype}</Text>
          {/* // TODO handeling numberOfLines for dynamic height */}
          <Text
            style={[theme.textB2, itemStyle.summary]}
            ellipsizeMode="tail"
            numberOfLines={resizeByScreenSize(3, 6, 6, 8)}>
            {item.summary}
          </Text>
        </LearningItemCard>
      </View>
      {showRestriction && (
        <Restriction onClose={onClose} urlView={item.urlView} />
      )}
    </TouchableOpacity>
  );
};

LearningItemWithSummaryAndNavigation.propTypes = {
  item: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  itemWithBadgeContainer: {
    marginTop: hp("2.5%"),
    marginBottom: hp("3%"),
    marginLeft: 8,
    marginRight: 8
  }
});

export default LearningItemCarousel;
