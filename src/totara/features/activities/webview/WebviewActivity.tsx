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
import { View, SafeAreaView, BackHandler, StyleSheet } from "react-native";
import PDFView from "react-native-view-pdf";
import { WebView, WebViewNavigation } from "react-native-webview";
import { Activity } from "@totara/types";
import { AuthenticatedWebView } from "@totara/auth";

import { NavigationStackProp } from "react-navigation-stack";
import WebviewToolbar from "../components/WebviewToolbar";
import { TotaraTheme } from "@totara/theme/Theme";
import { Loading } from "@totara/components";

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
  return (
    <SafeAreaView style={TotaraTheme.viewContainer}>
      {mimetype === PDF_TYPE ? (
        <PDFViewWrapper fileurl={fileurl} apiKey={apiKey} />
      ) : (
        <WebViewWrapper uri={uri || activity.viewurl!} backAction={backAction} />
      )}
    </SafeAreaView>
  );
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

const PDFViewWrapper = ({ fileurl, apiKey }: { fileurl?: string; apiKey?: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      <PDFView
        style={{ flex: 1 }}
        resource={fileurl!}
        resourceType={"url"}
        urlProps={{ headers: { Authorization: `Bearer ${apiKey}` } }}
        onLoad={() => setIsLoaded(true)}></PDFView>
      {!isLoaded && (
        <View style={pdfViewStyle.loadingWrapper}>
          <Loading />
        </View>
      )}
    </>
  );
};

const pdfViewStyle = StyleSheet.create({
  loadingWrapper: { position: "absolute", width: "100%", height: "100%" }
});

export { WebviewActivity };
