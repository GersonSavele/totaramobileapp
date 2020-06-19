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
import { Text, TouchableOpacity, View, Alert, StyleSheet } from "react-native";
import NetInfo from "@react-native-community/netinfo";

import ParallaxScrollView from "./ParallaxScrollView";
import { CardElement, ImageElement } from "@totara/components";
import { showMessage } from "@totara/lib";
import { normalize } from "@totara/theme";
import { CourseGroup, Course } from "@totara/types";
import { NavigationParams } from "react-navigation";
import { headerViewStyles } from "./currentLearningStyles";
import { translate } from "@totara/locale";
import { TotaraTheme } from "@totara/theme/Theme";

type Props = {
  details: CourseGroup | Course;
  navigation: NavigationParams;
  children: ReactNode;
  tabBarLeftTitle: string;
  tabBarRightTitle: string;
  onPress: () => void;
  overviewIsShown: boolean;
  badgeTitle: string;
  image?: string;
};

const LearningDetails = ({
  navigation,
  details,
  children,
  tabBarLeftTitle,
  tabBarRightTitle,
  onPress,
  overviewIsShown,
  badgeTitle,
  image = ""
}: Props) => {
  //To Do: Bug in NetInfo library, useNetInfo - isConnected initial state is false(phone and simulator):
  //https://github.com/react-native-community/react-native-netinfo/issues/295
  const [isConnected, setIsConnected] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(
        (state.isConnected as boolean) && (state.isInternetReachable as boolean)
      );
    });
    return () => unsubscribe();
  }, []);

  const renderNavigationTitle = () => {
    return (
      <CardElement item={details} cardStyle={headerViewStyles.itemCard}>
        <View style={headerViewStyles.LearningTypeLabelWrap}>
          <Text style={headerViewStyles.programLabelText}>{badgeTitle}</Text>
        </View>
      </CardElement>
    );
  };

  const renderNavigationTab = () => {
    return (
      <View style={[{ backgroundColor: TotaraTheme.colorNeutral2 }]}>
        <View style={[headerViewStyles.tabBarContainer]}>
          <View style={headerViewStyles.tabNav}>
            <TouchableOpacity
              style={[
                headerViewStyles.tabSelected,
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
                headerViewStyles.tabSelected,
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

  const backgroundViewRender = () => {
    return (
      <View style={headerViewStyles.headerContainer}>
        <ImageElement
          item={details}
          imageStyle={headerViewStyles.itemImage}
          image={image}
        />
      </View>
    );
  };

  return (
    <View style={headerViewStyles.container}>
      <ParallaxScrollView
        parallaxHeaderHeight={normalize(260)}
        renderBackground={backgroundViewRender}
        tabBar={renderNavigationTab}
        titleBar={renderNavigationTitle}
        onChangeHeaderVisibility={(value: number) => {
          if (value > 0) {
            navigation!.setParams({
              opacity: value / 100 > 0.5 ? 1 : value / 100
            });
            navigation!.setParams({ title: details.fullname });
          } else if (-value / 100 > 1) {
            navigation!.setParams({
              opacity: (100 + value) / 100 > 0.5 ? 1 : (100 + value) / 100
            });
            navigation!.setParams({ title: details.fullname });
          } else {
            navigation!.setParams({ title: "" });
          }
        }}>
        {children}
        {!isConnected &&
          showMessage({
            title: translate("no_internet_alert.title"),
            text: translate("no_internet_alert.message"),
            callback: () => {
              navigation.popToTop();
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
    fontWeight: "bold",
    color: TotaraTheme.colorNeutral8
  },
  overviewTouchableOpacity: {
    borderBottomColor: TotaraTheme.colorNeutral7,
    borderBottomWidth: 2
  }
});

export default LearningDetails;
