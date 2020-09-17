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
 */

import React, { useState, useRef, useContext } from "react";
import { Text, TouchableOpacity, View, ScrollView, RefreshControl } from "react-native";
import { NavigationContext } from "react-navigation";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { AddBadge } from "@totara/components";
import { navigateTo, itemToRouteMap } from "@totara/lib/navigation";
import NativeAccessRestriction from "../NativeAccessRestriction";
import { iconSizes, paddings } from "@totara/theme/constants";
import { deviceScreen } from "@totara/lib/tools";
import { LearningItemCard } from "../components/LearningItemCard";
import carouselItemStyles from "./carouselItemStyles";
import { capitalizeFirstLetter } from "@totara/lib/tools";
import { extractTargetId } from "../utils";

type CurrentLearningCarouselProps = {
  currentLearning?: any;
  loading: boolean;
  onRefresh: () => void;
};

const CurrentLearningCarousel = ({ currentLearning, loading, onRefresh }: CurrentLearningCarouselProps) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const sliderRef = useRef(null);
  const navigation = useContext(NavigationContext);

  const renderItem = ({ item }: any) => {
    return <LearningItems navigation={navigation} item={item} />;
  };
  return (
    <View>
      <Pagination
        activeDotIndex={activeSlide}
        dotsLength={currentLearning.length}
        containerStyle={carouselItemStyles.pagination}
        dotStyle={[carouselItemStyles.dot, { width: deviceScreen.width / currentLearning.length }]}
        dotContainerStyle={{
          marginHorizontal: 0
        }}
        carouselRef={sliderRef.current}
        tappableDots={sliderRef && !sliderRef.current}
        inactiveDotOpacity={0}
        inactiveDotScale={1}
      />
      <ScrollView
        style={{ height: "100%" }}
        contentContainerStyle={{ height: "100%" }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}>
        <Carousel
          inactiveSlideScale={1}
          ref={sliderRef}
          data={currentLearning}
          renderItem={renderItem}
          sliderWidth={deviceScreen.width}
          itemWidth={deviceScreen.width - paddings.paddingXL * 2}
          sliderHeight={deviceScreen.height}
          inactiveSlideOpacity={0.6}
          onSnapToItem={(index) => setActiveSlide(index)}
        />
      </ScrollView>
    </View>
  );
};

const LearningItems = ({ item, navigation }: any) => (
  <View style={carouselItemStyles.itemWithBadgeContainer}>
    <View style={carouselItemStyles.badgeContainer}>
      <LearningItemWithSummaryAndNavigation item={item} navigation={navigation} />
    </View>
    <View style={carouselItemStyles.learningItem}>
      <AddBadge status={item.progress} size={iconSizes.sizeM} />
    </View>
  </View>
);

const LearningItemWithSummaryAndNavigation = ({ item }: any) => {
  const navigation = useContext(NavigationContext);
  const [showRestriction, setShowRestriction] = useState(false);
  const clickedLearningItem = () => {
    if (item.native) {
      const targetId = extractTargetId(item.id);
      navigateTo({
        navigate: navigation.navigate,
        routeId: itemToRouteMap[item.itemtype],
        props: { targetId: targetId, courseGroupType: item.itemtype }
      });
    } else {
      setShowRestriction(true);
    }
  };

  const onClose = () => {
    setShowRestriction(!showRestriction);
  };

  return (
    <TouchableOpacity
      style={carouselItemStyles.container}
      key={item.id}
      onPress={clickedLearningItem}
      activeOpacity={1.0}>
      <View style={carouselItemStyles.content}>
        <LearningItemCard item={item} image={item.imageSrc} itemType={item.itemtype}>
          <View style={{ flexGrow: 1 }}>
            <Text style={carouselItemStyles.type}>{capitalizeFirstLetter(item.itemtype)}</Text>
            <View style={{ flex: 1, paddingVertical: paddings.paddingM }}>
              <Text style={carouselItemStyles.summary} numberOfLines={30}>
                {item.summary}
              </Text>
            </View>
          </View>
        </LearningItemCard>
      </View>
      {showRestriction && <NativeAccessRestriction onClose={onClose} urlView={item.urlView} />}
    </TouchableOpacity>
  );
};

export default CurrentLearningCarousel;
