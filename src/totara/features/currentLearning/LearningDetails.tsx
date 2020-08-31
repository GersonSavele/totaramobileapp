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

import React, { ReactNode } from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { NavigationStackProp } from "react-navigation-stack";
import ParallaxScrollView from "./ParallaxScrollView";
import { ImageElement } from "./components/LearningItemCard";
import { learningDetailsStyles } from "./currentLearningStyles";
import { TotaraTheme } from "@totara/theme/Theme";
import { fontSizes, fontWeights } from "@totara/theme/constants";
import { viewHeight } from "./constants";
import { CourseGroup, Course, LearningItem } from "@totara/types";

type LearningDetailsProps = {
  item: Course | CourseGroup | LearningItem;
  itemType: string;
  children: ReactNode;
  tabBarLeftTitle: string;
  tabBarRightTitle: string;
  onPress: () => void;
  overviewIsShown: boolean;
  badgeTitle: string;
  image?: string;
  onPullToRefresh: () => void;
  navigation: NavigationStackProp;
};

type TitleBarProps = {
  item: LearningItem;
  badgeTitle: string;
};

const TitleBar = ({ item, badgeTitle }: TitleBarProps) => {
  return (
    <View style={learningDetailsStyles.itemCard}>
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.itemFullName}>{item.fullname}</Text>
      </View>
      <View style={learningDetailsStyles.learningTypeLabelWrap}>
        <Text style={learningDetailsStyles.programLabelText}>{badgeTitle}</Text>
      </View>
    </View>
  );
};

type TabBarProps = {
  onPress: () => void;
  overviewIsShown: boolean;
  tabBarLeftTitle: string;
  tabBarRightTitle: string;
};

const TabBar = ({ onPress, overviewIsShown, tabBarLeftTitle, tabBarRightTitle }: TabBarProps) => {
  return (
    <View style={[{ backgroundColor: TotaraTheme.colorNeutral2 }]}>
      <View style={[learningDetailsStyles.tabBarContainer]}>
        <View style={learningDetailsStyles.tabNav}>
          <TouchableOpacity
            style={[learningDetailsStyles.tabSelected, overviewIsShown && { ...styles.overviewTouchableOpacity }]}
            onPress={onPress}>
            <Text style={[styles.tabViewTitle, overviewIsShown && styles.overviewTextTouchableOpacity]}>
              {tabBarLeftTitle}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[learningDetailsStyles.tabSelected, !overviewIsShown && { ...styles.overviewTouchableOpacity }]}
            onPress={onPress}>
            <Text style={[styles.tabViewTitle, !overviewIsShown && { ...styles.overviewTextTouchableOpacity }]}>
              {tabBarRightTitle}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const LearningDetails = ({
  item,
  itemType,
  children,
  tabBarLeftTitle,
  tabBarRightTitle,
  onPress,
  overviewIsShown,
  badgeTitle,
  image,
  onPullToRefresh,
  navigation
}: LearningDetailsProps) => {
  const renderTitleBar = () => <TitleBar badgeTitle={badgeTitle} item={item as LearningItem} />;
  const renderTabBar = () => (
    <TabBar
      onPress={onPress}
      overviewIsShown={overviewIsShown}
      tabBarLeftTitle={tabBarLeftTitle}
      tabBarRightTitle={tabBarRightTitle}
    />
  );

  const renderImage = () => (
    <ImageElement
      item={item as LearningItem}
      image={image}
      itemType={itemType}
      imageStyle={learningDetailsStyles.imageView}
    />
  );

  return (
    <View style={learningDetailsStyles.container}>
      <ParallaxScrollView
        onPullToRefresh={onPullToRefresh}
        parallaxHeaderHeight={viewHeight.learningItemCard}
        renderBackground={renderImage}
        titleBar={renderTitleBar}
        tabBar={renderTabBar}
        onChangeHeaderVisibility={(headerValue: number) => {
          navigation!.setParams({ title: item.fullname });
          const expectedOpacity = headerValue > 0 ? 1 : 0;
          const currentOpacity = navigation!.getParam("opacity");
          if (expectedOpacity !== currentOpacity) {
            navigation!.setParams({ opacity: expectedOpacity });
          }
        }}>
        {children}
      </ParallaxScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  tabViewTitle: {
    color: TotaraTheme.colorNeutral6
  },
  overviewTextTouchableOpacity: {
    ...TotaraTheme.textRegular,
    fontWeight: fontWeights.fontWeightSemiBold
  },
  overviewTouchableOpacity: {
    borderBottomColor: TotaraTheme.colorNeutral7,
    borderBottomWidth: 2
  },
  itemFullName: {
    flexWrap: "wrap",
    ...TotaraTheme.textHeadline,
    fontWeight: fontWeights.fontWeightSemiBold,
    fontSize: fontSizes.fontSizeL
  },
  itemCard: {}
});

export default LearningDetails;
