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
import { useNavigation } from '@react-navigation/native';
import { AddBadge } from '@totara/components';
import { learningItemToRouteMap, navigateTo } from '@totara/lib/navigation';
import { activeOpacity } from '@totara/lib/styles/base';
import { CL_TEST_IDS } from '@totara/lib/testIds';
import { deviceScreen } from '@totara/lib/tools';
import { iconSizes, paddings } from '@totara/theme/constants';
import React, { useState } from 'react';
import { FlatList, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import LearningItemCard from '../components/LearningItemCard';
import NativeAccessRestriction from '../NativeAccessRestriction';
import { extractTargetId } from '../utils';
import carouselItemStyles from './carouselItemStyles';

type CurrentLearningCarouselProps = {
  currentLearning?: any;
  onRefresh: () => void;
};

const CurrentLearningCarousel = ({ currentLearning, onRefresh }: CurrentLearningCarouselProps) => {
  const [_, setActiveSlide] = useState(0);

  const slideOverlap = 23;
  const slideWidth = deviceScreen.width - slideOverlap * 2;

  const renderItem = ({ item, index }: any) => {
    return (
      <View style={{ width: slideWidth, padding: paddings.paddingS }}>
        <LearningItems item={item} index={index} />
      </View>
    );
  };

  return (
    <View>
      <ScrollView
        style={{ height: '100%' }}
        contentContainerStyle={{ height: '100%' }}
        showsVerticalScrollIndicator={false}
        testID={CL_TEST_IDS.CAROUSEL_WRAPPER_ID}
        refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}>
        <FlatList
          style={{ flex: 1, paddingStart: slideOverlap }}
          data={currentLearning}
          renderItem={renderItem}
          horizontal={true}
          pagingEnabled={false}
          snapToInterval={slideWidth}
          snapToAlignment="start"
          decelerationRate={0}
          showsHorizontalScrollIndicator={true}
          testID={CL_TEST_IDS.CAROUSEL}
          onViewableItemsChanged={({ viewableItems }) => viewableItems[0] && setActiveSlide(viewableItems[0].index)}
        />
      </ScrollView>
    </View>
  );
};

const LearningItems = ({ item, index }: any) => {
  const navigation = useNavigation();
  return (
    <View style={carouselItemStyles.itemWithBadgeContainer} testID={`${CL_TEST_IDS.LEARNING_ITEM}${index}`}>
      <View style={carouselItemStyles.badgeContainer}>
        <LearningItemWithSummaryAndNavigation item={item} navigation={navigation} />
      </View>
      <View style={carouselItemStyles.learningItem}>
        <AddBadge status={item.progress} size={iconSizes.sizeM} />
      </View>
    </View>
  );
};

const LearningItemWithSummaryAndNavigation = ({ item }: any) => {
  const navigation = useNavigation();
  const [showRestriction, setShowRestriction] = useState(false);
  const clickedLearningItem = () => {
    if (item.native) {
      const targetId = extractTargetId(item.id);
      navigateTo({
        navigate: navigation.navigate,
        routeId: learningItemToRouteMap[item.itemtype],
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
      activeOpacity={activeOpacity}>
      <View style={carouselItemStyles.content}>
        <LearningItemCard item={item} />
      </View>
      {showRestriction && <NativeAccessRestriction onClose={onClose} urlView={item.urlView} />}
    </TouchableOpacity>
  );
};

export default CurrentLearningCarousel;
