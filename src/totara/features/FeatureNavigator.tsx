/**
 *
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
import { Image, ImageSourcePropType } from "react-native";
import { createStackNavigator } from "react-navigation-stack";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import totaraNavigationOptions from "@totara/components/NavigationOptions";
import { NotificationBell } from "@totara/components";
import { ThemeContext } from "@totara/theme";
import CurrentLearningStack from "./currentLearning";
import Settings from "./settings";
import Profile from "./profile";
import NotificationsStack from "./notifications";
import DownloadsStack from "./downloads";
import { useSelector } from "react-redux";
import { RootState } from "@totara/reducers";

const FeatureNavigator = () => {
  const [theme] = useContext(ThemeContext);

  return createMaterialBottomTabNavigator(
    {
      CurrentLearningTab,
      DownloadsTab,
      NotificationsTab,
      ProfileTab
    },
    {
      initialRouteName: "CurrentLearningTab",
      labeled: false,
      barStyle: { backgroundColor: theme.colorNeutral1, shadowRadius: 5 },
      activeColor: theme.tabBarActiveTintColor,
      inactiveColor: theme.tabBarInactiveTintColor
    }
  );
};

//TABS
const CurrentLearningTab = {
  screen: CurrentLearningStack,
  navigationOptions: {
    tabBarIcon: (tabIconProps: { focused: boolean; tintColor: string }) =>
      tabBarIconBuilder(
        tabIconProps.focused,
        tabIconProps.tintColor,
        tabBarIconImages.current_learning
      )
  }
};

const DownloadsTab = {
  screen: DownloadsStack,
  navigationOptions: {
    tabBarIcon: (tabIconProps: { focused: boolean; tintColor: string }) =>
      tabBarIconBuilder(
        tabIconProps.focused,
        tabIconProps.tintColor,
        tabBarIconImages.downloads
      )
  }
};

const ProfileTab = {
  screen: createStackNavigator(
    {
      Profile: Profile,
      Settings: Settings
    },
    {
      initialRouteName: "Profile",
      headerLayoutPreset: "center",
      defaultNavigationOptions: ({ screenProps }) =>
        totaraNavigationOptions({
          theme: screenProps.theme
        })
    }
  ),
  navigationOptions: {
    tabBarIcon: (tabIconProps: { focused: boolean; tintColor: string }) =>
      tabBarIconBuilder(
        tabIconProps.focused,
        tabIconProps.tintColor,
        tabBarIconImages.profile
      )
  }
};

const NotificationBellWithCounting = ({
  active,
  tintColor
}: {
  active: boolean;
  tintColor: string;
}) => {
  const notificationList = useSelector(
    (state: RootState) => state.notificationReducer.notifications
  );

  const count = notificationList.filter((n) => !n.read).length;
  return (
    <NotificationBell active={active} tintColor={tintColor} counting={count} />
  );
};

const NotificationsTab = {
  screen: NotificationsStack,
  navigationOptions: {
    // eslint-disable-next-line react/display-name
    tabBarIcon: (tabIconProps: { focused: boolean; tintColor: string }) => {
      return (
        <NotificationBellWithCounting
          active={tabIconProps.focused}
          tintColor={tabIconProps.tintColor}
        />
      );
    }
  }
};

const tabBarIconBuilder = (
  focused: boolean,
  color: string,
  imageSet: iconImageProps
) => {
  return (
    <Image
      source={focused ? imageSet.solid : imageSet.regular}
      style={{ tintColor: color, width: 24, height: 24 }}
      resizeMode="contain"
    />
  );
};

type iconImageProps = {
  solid: ImageSourcePropType;
  regular: ImageSourcePropType;
};

const tabBarIconImages: {
  current_learning: iconImageProps;
  downloads: iconImageProps;
  profile: iconImageProps;
} = {
  current_learning: {
    solid: require("@resources/images/tabbar/current_learning_solid.png"),
    regular: require("@resources/images/tabbar/current_learning_regular.png")
  },
  downloads: {
    solid: require("@resources/images/tabbar/downloads_solid.png"),
    regular: require("@resources/images/tabbar/downloads_regular.png")
  },
  profile: {
    solid: require("@resources/images/tabbar/profile_solid.png"),
    regular: require("@resources/images/tabbar/profile_regular.png")
  }
};

export default FeatureNavigator;
