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

import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import { translate } from "../../locale";
import { Text, TouchableOpacity } from "react-native";
import { paddings } from "../../theme/constants";
import { TotaraTheme } from "../../theme/Theme";
import NotificationDetails from "./NotificationDetail";
import totaraNavigationOptions from "../../components/NavigationOptions";
import Notifications from "./Notifications";

const NotificationsStack = createStackNavigator(
  {
    Notification: {
      screen: Notifications,
      navigationOptions: ({ navigation }): any => ({
        headerBackTitle: translate("general.back"),
        headerLeft: navigation.getParam("showActions") && (
          <TouchableOpacity
            testID={"test_cancel"}
            onPress={() => {
              // @ts-ignore
              navigation.emit("onCancelTap");
            }}
            style={{ paddingLeft: paddings.paddingL }}>
            <Text style={TotaraTheme.textMedium}>
              {" "}
              {translate("general.cancel")}
            </Text>
          </TouchableOpacity>
        ),
        headerRight: navigation.getParam("showActions") && (
          <TouchableOpacity
            testID={"test_markAsRead"}
            onPress={() => {
              // @ts-ignore
              navigation.emit("onMarkAsRead");
            }}
            style={{ paddingRight: paddings.paddingL }}>
            <Text
              style={[
                TotaraTheme.textMedium,
                { color: TotaraTheme.colorLink }
              ]}>
              {translate("notifications.mark_as_read")}
            </Text>
          </TouchableOpacity>
        )
      })
    },
    NotificationDetail: {
      screen: NotificationDetails
    }
  },
  {
    initialRouteName: "Notification",
    initialRouteKey: "Notification",
    defaultNavigationOptions: totaraNavigationOptions({}) as any
  }
);

export default NotificationsStack;
