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

import React, { ReactNode, useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import ImageElement from "./components/ImageElement";
import { learningDetailsStyles } from "./currentLearningStyles";
import { TotaraTheme } from "@totara/theme/Theme";
import { CourseGroup, Course, LearningItem } from "@totara/types";
import { margins } from "@totara/theme/constants";
import { CL_TEST_IDS } from "@totara/lib/testIds";
import Animated, { interpolate, Extrapolate, Value, event } from "react-native-reanimated";
import LinearGradient from "react-native-linear-gradient";
import AnimatedHeader from "@totara/components/AnimatedHeader";

const { marginXL } = margins;

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
  navigation: any;
};

type TitleBarProps = {
  item: LearningItem;
  badgeTitle: string;
};

const TitleBar = ({ item, badgeTitle }: TitleBarProps) => {
  return (
    <View style={learningDetailsStyles.itemCard}>
      <View style={{ flexDirection: "row" }}>
        <Text style={learningDetailsStyles.itemFullName}>{item.fullname}</Text>
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
            style={[
              learningDetailsStyles.tabViewItem,
              overviewIsShown && { ...learningDetailsStyles.tabViewItemSelected }
            ]}
            onPress={onPress}>
            <Text
              style={[
                learningDetailsStyles.tabViewTitle,
                overviewIsShown && learningDetailsStyles.tabViewTitleSelected
              ]}>
              {tabBarLeftTitle}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              learningDetailsStyles.tabViewItem,
              { marginLeft: marginXL },
              !overviewIsShown && { ...learningDetailsStyles.tabViewItemSelected }
            ]}
            onPress={onPress}
            testID={CL_TEST_IDS.TAB_2}>
            <Text
              style={[
                learningDetailsStyles.tabViewTitle,
                !overviewIsShown && { ...learningDetailsStyles.tabViewTitleSelected }
              ]}>
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

  const scrollValue = useRef(new Value(0)).current;

  const { fullname } = item;

  return (
    <View style={learningDetailsStyles.container}>
      <AnimatedHeader scrollValue={scrollValue} title={fullname!} subTitle={badgeTitle} leftAction={() => navigation?.goBack()} />
      <Animated.ScrollView
        onScrollEndDrag={(event) => {
          const yOffset = event.nativeEvent.contentOffset.y;
          if (yOffset < 100) {
            onPullToRefresh();
          }
        }}
        onScroll={event(
          [{ nativeEvent: { contentOffset: { y: scrollValue } } }],
          {
            useNativeDriver: true
          }
        )}
        scrollEventThrottle={16}
      >

        <Animated.View style={{
          flex: 1,
          alignItems: 'center',
          height: 300,
          transform: [
            {
              scale: interpolate(scrollValue, {
                inputRange: [-300, 0],
                outputRange: [3, 1],
                extrapolate: Extrapolate.CLAMP
              })
            }
          ]
        }}>
          <View style={learningDetailsStyles.imageViewContainer}>
            <ImageElement
              item={item as LearningItem}
              image={image}
              itemType={itemType}
              imageStyle={learningDetailsStyles.imageView}
            />
          </View>
          <View style={learningDetailsStyles.imageViewGradient}>
            <LinearGradient colors={['rgba(0, 0, 0, 0.6)', 'rgba(0, 0, 0, 0)']} style={{ height: 100, zIndex: 100 }} />
          </View>

        </Animated.View>
        <TitleBar badgeTitle={badgeTitle} item={item as LearningItem} />

        <View>
          <TabBar
            onPress={onPress}
            overviewIsShown={overviewIsShown}
            tabBarLeftTitle={tabBarLeftTitle}
            tabBarRightTitle={tabBarRightTitle}
          />
        </View>
        <View>
          {children}
        </View>
      </Animated.ScrollView>
    </View >
  );
};



export default LearningDetails;
