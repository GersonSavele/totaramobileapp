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

import React, { useContext, useEffect } from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { Image, ImageSourcePropType, View } from "react-native";
import { ThemeContext } from "@totara/theme";
import NotificationsStack from "@totara/features/notifications";
import DownloadsStack from "@totara/features/downloads";
import ProfileStack from "@totara/features/profile";
import { countUnreadMessages, notificationsQuery } from "./features/notifications/api";
import { useQuery } from "@apollo/react-hooks";
import CurrentLearningStack from "./features/currentLearning";
import { setNotificationBadgeCount } from "@totara/lib/nativeExtensions";
import { TAB_TEST_IDS } from "./lib/testIds";
import { translate } from "./locale";

const Tab = createMaterialBottomTabNavigator();

const TabContainer = () => {
  const theme = useContext(ThemeContext);
  const { data } = useQuery(notificationsQuery);
  const notificationCount = countUnreadMessages(data);

  useEffect(() => {
    setNotificationBadgeCount(notificationCount);
  }, [notificationCount]);

  const TabBarIconBuilder = ({ image, focused, color }: { image: iconImageProps; focused: boolean; color: string }) => {
    return (
      <View>
        <Image
          source={focused ? image.solid : image.regular}
          style={{ tintColor: focused ? theme.colorPrimary : color }}
        />
      </View>
    );
  };

  return (
    <Tab.Navigator barStyle={{ backgroundColor: theme.colorNeutral1 }} shifting={false} labeled={false}>
      <Tab.Screen
        name="Learning"
        component={CurrentLearningStack}
        options={{
          tabBarAccessibilityLabel: translate("current_learning.action_primary"),
          tabBarIcon: ({ focused, color }: { focused: boolean; color: string }) => (
            <TabBarIconBuilder color={color} focused={focused} image={tabBarIconImages.current_learning} />
          ),
          tabBarTestID: TAB_TEST_IDS.CURRENT_LEARNING
        }}
      />
      <Tab.Screen
        name="Downloads"
        component={DownloadsStack}
        options={{
          tabBarAccessibilityLabel: translate("downloads.title"),
          tabBarIcon: ({ focused, color }: { focused: boolean; color: string }) => (
            <TabBarIconBuilder color={color} focused={focused} image={tabBarIconImages.downloads} />
          ),
          tabBarTestID: TAB_TEST_IDS.DOWNLOADS
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsStack}
        options={{
          tabBarAccessibilityLabel: translate("notifications.title"),
          tabBarIcon: ({ focused, color }: { focused: boolean; color: string }) => (
            <TabBarIconBuilder color={color} focused={focused} image={tabBarIconImages.notifications} />
          ),
          tabBarBadge: notificationCount > 0 && notificationCount,
          tabBarTestID: TAB_TEST_IDS.NOTIFICATIONS
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarAccessibilityLabel: translate("user_profile.title"),
          tabBarIcon: ({ focused, color }: { focused: boolean; color: string }) => (
            <TabBarIconBuilder color={color} focused={focused} image={tabBarIconImages.profile} />
          ),
          tabBarTestID: TAB_TEST_IDS.PROFILE
        }}
      />
    </Tab.Navigator>
  );
};

type iconImageProps = {
  solid: ImageSourcePropType;
  regular: ImageSourcePropType;
};

const tabBarIconImages: {
  current_learning: iconImageProps;
  downloads: iconImageProps;
  notifications: iconImageProps;
  profile: iconImageProps;
} = {
  current_learning: {
    solid: require("@resources/icons/tabbar/current_learning_solid.png"),
    regular: require("@resources/icons/tabbar/current_learning_regular.png")
  },
  downloads: {
    solid: require("@resources/icons/tabbar/downloads_solid.png"),
    regular: require("@resources/icons/tabbar/downloads_regular.png")
  },
  notifications: {
    solid: require("@resources/icons/tabbar/notificationsSolid.png"),
    regular: require("@resources/icons/tabbar/notificationsRegular.png")
  },
  profile: {
    solid: require("@resources/icons/tabbar/profile_solid.png"),
    regular: require("@resources/icons/tabbar/profile_regular.png")
  }
};

export default TabContainer;
