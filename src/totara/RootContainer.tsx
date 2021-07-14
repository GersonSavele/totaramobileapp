/**
 * This file is part of Totara Enterprise.
 *
 * Copyright (C) 2021 onwards Totara Learning Solutions LTD
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

import React from "react";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { TotaraTheme } from "./theme/Theme";
import SiteUrl from "./auth/manual/SiteUrl";
import NativeLogin from "./auth/manual/native/NativeLogin";
import WebviewLogin from "./auth/manual/webview/WebviewLogin";
import { cardModalOptions, NAVIGATION } from "./lib/navigation";
import SessionContainer from "./SessionContainer";
import BrowserLogin from "./auth/manual/browser";
import { OverviewModal } from "./features/findLearning/OverviewModal";
import { translate } from "./locale";

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: TotaraTheme.viewContainer.backgroundColor!
  }
};

const Stack = createStackNavigator();

const RootContainer = () => {
  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        mode={"modal"}
        screenOptions={{
          headerShown: false
        }}>
        <Stack.Screen name="SessionContainer" component={SessionContainer} />
        <Stack.Screen name={NAVIGATION.SITE_URL} component={SiteUrl} />
        <Stack.Screen name={NAVIGATION.NATIVE_LOGIN} component={NativeLogin} options={{ ...cardModalOptions, headerBackTitle: translate('general.cancel'), headerBackTitleVisible: true }} />
        <Stack.Screen name={NAVIGATION.WEBVIEW_LOGIN} component={WebviewLogin} options={{ ...cardModalOptions, headerBackTitle: translate('general.cancel'), headerBackTitleVisible: true }} />
        <Stack.Screen name={NAVIGATION.BROWSER_LOGIN} component={BrowserLogin} options={{ ...cardModalOptions, headerBackTitle: translate('general.cancel'), headerBackTitleVisible: true }} />
        <Stack.Screen name={NAVIGATION.FIND_LEARNING_OVERVIEW} component={OverviewModal} options={cardModalOptions} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootContainer;
