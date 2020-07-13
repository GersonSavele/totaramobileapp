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

import { createStackNavigator } from "react-navigation-stack";
import { Text, TouchableOpacity } from "react-native";
import { paddings } from "@totara/theme/constants";
import { TotaraTheme } from "@totara/theme/Theme";
import { translate } from "@totara/locale";
import totaraNavigationOptions from "@totara/components/NavigationOptions";
import React from "react";
import Downloads from "@totara/features/downloads/Downloads";

const DownloadsStack = createStackNavigator(
  {
    Downloads: {
      screen: Downloads,
      navigationOptions: ({ navigation }) => ({
        headerLeft: navigation.getParam("showActions") && (
          <TouchableOpacity
            onPress={() => {
              // @ts-ignore
              navigation.emit("onCancelTap");
            }}
            style={{ paddingLeft: paddings.paddingL }}>
            <Text style={TotaraTheme.textMedium}>
              {translate("general.cancel")}
            </Text>
          </TouchableOpacity>
        ),
        headerRight: navigation.getParam("showActions") && (
          <TouchableOpacity
            onPress={() => {
              // @ts-ignore
              navigation.emit("onDeleteTap");
            }}
            style={{ paddingRight: paddings.paddingL }}>
            <Text
              style={[
                TotaraTheme.textMedium,
                { color: TotaraTheme.colorDestructive }
              ]}>
              {translate("general.delete")}
            </Text>
          </TouchableOpacity>
        )
      })
    }
  },
  {
    initialRouteName: "Downloads",
    initialRouteKey: "Downloads",
    defaultNavigationOptions: totaraNavigationOptions({})
  }
);

export default DownloadsStack;
