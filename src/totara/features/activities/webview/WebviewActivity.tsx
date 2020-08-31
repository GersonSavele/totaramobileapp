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

import React, { useRef, useState, useEffect } from "react";
import { View, SafeAreaView, BackHandler } from "react-native";
import PDFView from "react-native-view-pdf";
import { WebView, WebViewNavigation } from "react-native-webview";
import { Activity } from "@totara/types";
import { AuthenticatedWebView } from "@totara/auth";

import { NavigationStackProp } from "react-navigation-stack";
import WebviewToolbar from "../components/WebviewToolbar";
import { TotaraTheme } from "@totara/theme/Theme";
import { activityModType } from "@totara/lib/constants";

const PDF_TYPE = "application/pdf";
/**
 * WebviewActivity opens an activity with the given url
 */

type WebviewActivityParams = {
  activity: Activity;
  uri: string;
  backAction: () => void;
  fileurl?: string;
  mimetype?: string;
  apiKey?: string;
};

type WebviewActivityProps = {
  navigation: NavigationStackProp<WebviewActivityParams>;
};

const WebviewActivity = ({ navigation }: WebviewActivityProps) => {
  const { uri, backAction, activity, fileurl, mimetype, apiKey } = navigation.state.params as WebviewActivityParams;

  if (activity.modtype === activityModType.resource) {
    return (
      <SafeAreaView style={{ ...TotaraTheme.viewContainer, backgroundColor: TotaraTheme.colorSecondary1 }}>
        {mimetype === PDF_TYPE ? (
          <PDFView
            style={{ flex: 1 }}
            resource={fileurl!}
            resourceType={"url"}
            urlProps={{ headers: { Authorization: `Bearer ${apiKey}` } }}
          />
        ) : (
          <WebViewWrapper uri={uri || activity.viewurl!} backAction={backAction} />
        )}
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={{ ...TotaraTheme.viewContainer, backgroundColor: TotaraTheme.colorSecondary1 }}>
        <WebViewWrapper uri={uri || activity.viewurl!} backAction={backAction} />
      </SafeAreaView>
    );
  }
};

type WebViewWrapperProps = {
  uri: string;
  backAction: () => void;
};

const WebViewWrapper = ({ uri, backAction }: WebViewWrapperProps) => {
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
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <AuthenticatedWebView uri={uri} ref={refWebview} onNavigationStateChange={onNavigationStateChange} />
      </View>
      <WebviewToolbar refWebview={refWebview} navState={navState} />
    </View>
  );
};

export { WebviewActivity };
