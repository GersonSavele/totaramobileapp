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

import React from "react";
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
import { LearningItemCard, AddBadge } from "@totara/components";
import { navigateTo } from "@totara/lib/navigation";
import { itemToRouteMap } from "@totara/lib/constants";
import Restriction from "./Restriction";
import { borderRadius, margins, paddings } from "@totara/theme/constants";
import { deviceScreen } from "@totara/lib/tools";
import { TotaraTheme } from "@totara/theme/Theme";

const LearningItemCarousel = withNavigation(
  ({ navigation, currentLearning, loading, onRefresh }) => {
    const [activeSlide, setActiveSlide] = useState(0);
    const sliderRef = useRef(null);

    if (!currentLearning) return;

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
            backgroundColor: TotaraTheme.colorNeutral6
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
            sliderWidth={deviceScreen.width}
            itemWidth={deviceScreen.width * 0.8}
            sliderHeight={deviceScreen.height}
            inactiveSlideOpacity={0.6}
            onSnapToItem={(index) => setActiveSlide(index)}
          />
        </ScrollView>
      </View>
    );
  }
);

const renderItem = (navigation) => {
  const LearningItem = ({ item }) => (
    <View style={styles.itemWithBadgeContainer}>
      <View style={{ zIndex: 1 }}>
        <LearningItemWithSummaryAndNavigation
          item={item}
          navigation={navigation}
        />
      </View>

      <View style={{ zIndex: 2, position: "absolute", right: 0, top: 0 }}>
        <AddBadge status={item.progress} size={24} />
      </View>
    </View>
  );

  LearningItem.propTypes = {
    item: PropTypes.object.isRequired
  };
  return LearningItem;
};

const LearningItemWithSummaryAndNavigation = ({ item, navigation }) => {
  const { isConnected, isInternetReachable } = useNetInfo();
  const [showRestriction, setShowRestriction] = useState(false);
  const isOnline = isConnected && isInternetReachable;
  const itemStyle = StyleSheet.create({
    container: {
      borderRadius: borderRadius.borderRadiusM,
      shadowColor: TotaraTheme.colorNeutral8,
      shadowOpacity: 0.3,
      shadowRadius: borderRadius.borderRadiusM,
      backgroundColor: TotaraTheme.colorNeutral1,
      borderWidth: 1,
      borderColor: TotaraTheme.colorNeutral3,
      elevation: 6
    },
    content: {
      borderRadius: borderRadius.borderRadiusM,
      width: "100%",
      height: "99%",
      overflow: "hidden"
    },
    type: {
      marginTop: 8,
      alignSelf: "flex-start",
      paddingHorizontal: paddings.paddingL,
      paddingVertical: paddings.paddingXS,
      borderWidth: 1,
      borderRadius: borderRadius.borderRadiusS,
      backgroundColor: TotaraTheme.colorNeutral1,
      color: TotaraTheme.colorNeutral8,
      borderColor: TotaraTheme.colorNeutral6
    },
    summary: {
      flex: 1,
      alignSelf: "flex-start",
      width: "100%",
      paddingTop: 8,
      paddingBottom: 4
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
          <Text style={[TotaraTheme.textXXSmall, itemStyle.type]}>
            {item.itemtype}
          </Text>
          <Text
            style={[TotaraTheme.textSmall, itemStyle.summary]}
            ellipsizeMode="tail"
            numberOfLines={TotaraTheme.textSmall.fontSize / 2}>
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
    marginTop: margins.marginL,
    marginBottom: margins.marginL,
    marginLeft: margins.marginS,
    marginRight: margins.marginS
  }
});

export default LearningItemCarousel;
