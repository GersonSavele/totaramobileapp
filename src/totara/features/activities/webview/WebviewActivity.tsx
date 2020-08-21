/**
 * This file is part of Totara Enterprise.
 *
 * Copyright (C) 2019 onwards Totara Learning Solutions LTD
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
    <SafeAreaView style={{ ...TotaraTheme.viewContainer, backgroundColor: TotaraTheme.colorSecondary1 }}>
      <View style={{ flex: 1 }}>
        <AuthenticatedWebView
          uri={uri || activity.viewurl!}
          ref={refWebview}
          onNavigationStateChange={onNavigationStateChange}
        />
      </View>
      <WebviewToolbar refWebview={refWebview} navState={navState} />
    </SafeAreaView>
  );
};

export { WebviewActivity };
