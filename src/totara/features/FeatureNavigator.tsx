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
import { faCloudDownloadAlt } from "@fortawesome/free-solid-svg-icons";
import totaraNavigationOptions from "@totara/components/NavigationOptions";
import { NotificationBell, TouchableIcon } from "@totara/components";
import { ThemeContext } from "@totara/theme";
import { header } from "@totara/theme/constants";

// @ts-ignore //TODO: PLEASE REMOVE TS-IGNORE WHEN FEATURE IS MIGRATED TO TYPESCRIPT
import MyLearning from "./myLearning";
// @ts-ignore //TODO: PLEASE REMOVE TS-IGNORE WHEN FEATURE IS MIGRATED TO TYPESCRIPT
import CourseDetails from "./currentLearning/courseDetails";
// @ts-ignore //TODO: PLEASE REMOVE TS-IGNORE WHEN FEATURE IS MIGRATED TO TYPESCRIPT
import ProgramDetails from "./currentLearning/programDetails";
// @ts-ignore //TODO: PLEASE REMOVE TS-IGNORE WHEN FEATURE IS MIGRATED TO TYPESCRIPT
import CertificationDetails from "./currentLearning/certificationDetails";
// @ts-ignore //TODO: PLEASE REMOVE TS-IGNORE WHEN FEATURE IS MIGRATED TO TYPESCRIPT
import Settings from "./settings";
// @ts-ignore //TODO: PLEASE REMOVE TS-IGNORE WHEN FEATURE IS MIGRATED TO TYPESCRIPT

import Profile from "./profile";
import NotificationsStack from "./notifications";
import DownloadsStack from "./downloads";

const FeatureNavigator = () => {
  const [theme] = useContext(ThemeContext);

  return createMaterialBottomTabNavigator(
    {
      MyLearningTab,
      DownloadsTab,
      notificationTab: NotificationsTab(),
      ProfileTab,
    },
    {
      initialRouteName: "MyLearningTab",
      labeled: false,
      barStyle: { backgroundColor: theme.colorNeutral1, shadowRadius: 5 },
      activeColor: theme.tabBarActiveTintColor,
      inactiveColor: theme.tabBarInactiveTintColor,
    }
  );
};

//TABS
const MyLearningTab = {
  screen: createStackNavigator(
    {
      MyLearning: {
        screen: MyLearning,
        navigationOptions: ({ screenProps, navigation }) =>
          totaraNavigationOptions({
            theme: screenProps!.theme,
            title: navigation.getParam("title"),
            opacity: navigation.getParam(
              "opacity"
            ) /*rightIcon: faCloudDownloadAlt*/,
          }), //TODO: MOB-373 hiding it for beta release
      },
      CourseDetails: {
        screen: CourseDetails,
        navigationOptions: ({ screenProps, navigation }) =>
          totaraNavigationOptions({
            theme: screenProps!.theme,
            title: navigation.getParam("title"),
            opacity: navigation.getParam("opacity"),
          }),
      },
      ProgramDetails: {
        screen: ProgramDetails,
        navigationOptions: ({ screenProps, navigation }) =>
          totaraNavigationOptions({
            theme: screenProps!.theme,
            rightAction: (
              <TouchableIcon
                icon={faCloudDownloadAlt}
                disabled={false}
                size={header.icon.size}
                color={screenProps!.theme.navigationHeaderTintColor}
              />
            ),
            title: navigation.getParam("title"),
            opacity: navigation.getParam("opacity"),
          }),
      },
      CertificationDetails: {
        screen: CertificationDetails,
        navigationOptions: ({ screenProps, navigation }) =>
          totaraNavigationOptions({
            theme: screenProps!.theme,
            rightAction: (
              <TouchableIcon
                icon={faCloudDownloadAlt}
                disabled={false}
                size={header.icon.size}
                color={screenProps!.theme.navigationHeaderTintColor}
              />
            ),
            title: navigation.getParam("title"),
            opacity: navigation.getParam("opacity"),
          }),
      },
    },
    {
      initialRouteName: "MyLearning",
      defaultNavigationOptions: ({ screenProps }) =>
        totaraNavigationOptions({ theme: screenProps.theme }),
    }
  ),
  navigationOptions: {
    tabBarIcon: (tabIconProps: { focused: boolean; tintColor: string }) =>
      tabBarIconBuilder(
        tabIconProps.focused,
        tabIconProps.tintColor,
        tabBarIconImages.current_learning
      ),
  },
};

const DownloadsTab = {
  screen: DownloadsStack,
  navigationOptions: {
    tabBarIcon: (tabIconProps: { focused: boolean; tintColor: string }) =>
      tabBarIconBuilder(
        tabIconProps.focused,
        tabIconProps.tintColor,
        tabBarIconImages.downloads
      ),
  },
};

const ProfileTab = {
  screen: createStackNavigator(
    {
      Profile: Profile,
      Settings: Settings,
    },
    {
      initialRouteName: "Profile",
      defaultNavigationOptions: ({ screenProps }) =>
        totaraNavigationOptions({ theme: screenProps.theme }),
    }
  ),
  navigationOptions: {
    tabBarIcon: (tabIconProps: { focused: boolean; tintColor: string }) =>
      tabBarIconBuilder(
        tabIconProps.focused,
        tabIconProps.tintColor,
        tabBarIconImages.profile
      ),
  },
};

const NotificationsTab = () => {
  // TODO: load counting from redux store. This is not possible yet because this tab needs to have its own context to avoid
  // const notificationList = useSelector(
  //   (state) => state.notificationReducer.notifications
  // );

  return {
    screen: NotificationsStack,
    navigationOptions: {
      tabBarIcon: (tabIconProps: { focused: boolean; tintColor: string }) =>
        NotificationBell({
          active: tabIconProps.focused,
          tintColor: tabIconProps.tintColor,
          counting: 0,
        }),
    },
  };
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
    regular: require("@resources/images/tabbar/current_learning_regular.png"),
  },
  downloads: {
    solid: require("@resources/images/tabbar/downloads_solid.png"),
    regular: require("@resources/images/tabbar/downloads_regular.png"),
  },
  profile: {
    solid: require("@resources/images/tabbar/profile_solid.png"),
    regular: require("@resources/images/tabbar/profile_regular.png"),
  },
};

export default FeatureNavigator;
