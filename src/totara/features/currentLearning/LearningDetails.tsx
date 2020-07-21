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

import React, { ReactNode, useState, useEffect } from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { NavigationStackProp } from "react-navigation-stack";
import ParallaxScrollView from "./ParallaxScrollView";
import { CardElement, ImageElement } from "./components/LearningItemCard";
import { showMessage } from "@totara/lib";
import { learningDetailsStyles } from "./currentLearningStyles";
import { translate } from "@totara/locale";
import { TotaraTheme } from "@totara/theme/Theme";
import { fontWeights } from "@totara/theme/constants";
import { deviceScreen } from "@totara/lib/tools";

type Props = {
  details: any;
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

const LearningDetails = ({
  details,
  children,
  tabBarLeftTitle,
  tabBarRightTitle,
  onPress,
  overviewIsShown,
  badgeTitle,
  image,
  onPullToRefresh,
  navigation
}: Props) => {
  //To Do: Bug in NetInfo library, useNetInfo - isConnected initial state is false(phone and simulator):
  //https://github.com/react-native-community/react-native-netinfo/issues/295
  const [isConnected, setIsConnected] = useState<boolean>(true);
  useEffect(() => {
    return NetInfo.addEventListener((state) => {
      setIsConnected(
        (state.isConnected as boolean) && (state.isInternetReachable as boolean)
      );
    });
  }, []);

  const renderHeaderTitle = () => {
    return (
      <CardElement item={details} cardStyle={learningDetailsStyles.itemCard}>
        <View style={learningDetailsStyles.LearningTypeLabelWrap}>
          <Text style={learningDetailsStyles.programLabelText}>
            {badgeTitle}
          </Text>
        </View>
      </CardElement>
    );
  };

  const renderNavigationTab = () => {
    return (
      <View style={[{ backgroundColor: TotaraTheme.colorNeutral2 }]}>
        <View style={[learningDetailsStyles.tabBarContainer]}>
          <View style={learningDetailsStyles.tabNav}>
            <TouchableOpacity
              style={[
                learningDetailsStyles.tabSelected,
                overviewIsShown && { ...styles.overviewTouchableOpacity }
              ]}
              onPress={onPress}>
              <Text
                style={[
                  styles.tabViewTitle,
                  overviewIsShown && styles.overviewTextTouchableOpacity
                ]}>
                {tabBarLeftTitle}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                learningDetailsStyles.tabSelected,
                !overviewIsShown && { ...styles.overviewTouchableOpacity }
              ]}
              onPress={onPress}>
              <Text
                style={[
                  styles.tabViewTitle,
                  !overviewIsShown && { ...styles.overviewTextTouchableOpacity }
                ]}>
                {tabBarRightTitle}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderHeaderBackground = () => {
    return (
      <View style={learningDetailsStyles.headerContainer}>
        <ImageElement item={details} image={image} />
      </View>
    );
  };

  return (
    <View style={learningDetailsStyles.container}>
      <ParallaxScrollView
        onPullToRefresh={onPullToRefresh}
        parallaxHeaderHeight={deviceScreen.height * 0.3}
        renderBackground={renderHeaderBackground}
        titleBar={renderHeaderTitle}
        tabBar={renderNavigationTab}
        onChangeHeaderVisibility={(headerValue: number) => {
          navigation!.setParams({ title: details.fullname });

          const expectedOpacity = headerValue > 0 ? 1 : 0;
          const currentOpacity = navigation!.getParam("opacity");

          if (expectedOpacity !== currentOpacity) {
            navigation!.setParams({ opacity: expectedOpacity });
          }
        }}>
        {children}
        {!isConnected &&
          showMessage({
            title: translate("no_internet_alert.title"),
            text: translate("no_internet_alert.message"),
            callback: () => {
              navigation.goBack();
            }
          })}
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
  }
});

export default LearningDetails;
