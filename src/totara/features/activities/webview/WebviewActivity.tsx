/**
 * This file is part of Totara Mobile
 *
 * Copyright (C) 2019 onwards Totara Learning Solutions LTD
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @author Jun Yamog <jun.yamog@totaralearning.com
 */

import React, { useRef, useState, useEffect } from "react";
import { View, SafeAreaView, BackHandler } from "react-native";

import { Activity } from "@totara/types";
import { AuthenticatedWebView } from "@totara/auth";
import { WebView, WebViewNavigation } from "react-native-webview";
import { NavigationStackProp } from "react-navigation-stack";
import WebviewToolbar from "../components/WebviewToolbar";
import { TotaraTheme } from "@totara/theme/Theme";

/**
 * WebviewActivity opens an activity with the given url
 */

type WebviewActivityParams = {
  activity: Activity;
  uri: string;
  backAction: () => void;
};

type WebviewActivityProps = {
  navigation: NavigationStackProp<WebviewActivityParams>;
};

const WebviewActivity = ({ navigation }: WebviewActivityProps) => {
  const { uri, backAction, activity } = navigation.state.params as WebviewActivityParams;
  const refWebview = useRef<WebView>(null);
  const [navState, setNavState] = useState<WebViewNavigation>();

  const onNavigationStateChange = (navState: WebViewNavigation) => {
    setNavState(navState);
  };

  useEffect(() => {
    if (uri) {
      const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
      return () => backHandler.remove();
    }
  }, [uri]);

  return (
    <View style={TotaraTheme.viewContainer}>
      <View style={{ flex: 1 }}>
        <AuthenticatedWebView
          uri={uri || activity.viewurl!}
          ref={refWebview}
          onNavigationStateChange={onNavigationStateChange}
        />
      </View>
      <WebviewToolbar refWebview={refWebview} navState={navState} />
      <SafeAreaView style={{ backgroundColor: TotaraTheme.colorSecondary1 }} />
    </View>
  );
};

export { WebviewActivity };
