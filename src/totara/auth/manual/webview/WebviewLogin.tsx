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

import React, { useRef, useContext, useEffect } from "react";
import { View, StyleSheet, Linking } from "react-native";
import { WebView } from "react-native-webview";
import { Container, Content, Footer } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { config } from "@totara/lib";
import { DEVICE_REGISTRATION } from "@totara/lib/constants";
import { TouchableIcon } from "@totara/components";
import { ThemeContext } from "@totara/theme";
import { useWebviewFlow } from "./WebviewFlowHook";
import { useSession } from "@totara/core";
import { fetchData, registerDevice } from "@totara/core/AuthRoutines";
import AsyncStorage from "@react-native-community/async-storage";

const WebviewLogin = () => {
  const { initSession, session: { siteInfo, host, apiKey } } = useSession();
  // eslint-disable-next-line no-undef
  const fetchDataWithFetch = fetchData(fetch);
  const navigation = useNavigation();
  const {
    loginUrl,
    navProtocol,
    navEndPoint,
    setupSecret,
    didReceiveOnMessage,
    canWebGoBackward,
    canWebGoForward,
    onLogViewNavigate
  } = useWebviewFlow({ siteInfo: siteInfo!, siteUrl: host! });

  useEffect(() => {
    if (setupSecret && !apiKey) {
      registerDevice(
        fetchDataWithFetch,
        AsyncStorage
      )({
        uri: host!,
        secret: setupSecret,
        siteInfo: siteInfo
      }).then((res) => {
        initSession({ apiKey: res.apiKey });
        navigation.goBack();
      });
    }
  }, [setupSecret, apiKey]);

  const jsCode =
    "window.ReactNativeWebView.postMessage(document.getElementById('totara_mobile-setup-secret') && document.getElementById('totara_mobile-setup-secret').getAttribute('data-totara-mobile-setup-secret'))";

  const refLoginWebview = useRef<WebView>(null);

  const theme = useContext(ThemeContext);

  return (
    <Container style={[theme.viewContainer, { flex: 0 }]}>
      <Content contentContainerStyle={{ flex: 1 }}>
        <WebView
          ref={refLoginWebview}
          source={{
            uri: loginUrl,
            headers: { [DEVICE_REGISTRATION]: config.userAgent }
          }}
          userAgent={config.userAgent}
          javaScriptEnabled={true}
          onMessage={didReceiveOnMessage}
          injectedJavaScript={jsCode}
          onNavigationStateChange={onLogViewNavigate}
        />
      </Content>
      <Footer style={[styles.footer, { backgroundColor: theme.colorSecondary1 }]}>
        <View style={styles.barContent}>
          <TouchableIcon
            icon={"chevron-left"}
            disabled={!canWebGoBackward}
            onPress={() => {
              refLoginWebview.current && refLoginWebview.current!.goBack();
            }}
            color={theme.colorNeutral7}
            size={theme.textH3.fontSize}
          />
          <TouchableIcon
            icon={"chevron-right"}
            disabled={!canWebGoForward}
            onPress={() => {
              refLoginWebview.current && refLoginWebview.current!.goForward();
            }}
            color={theme.colorNeutral7}
            size={theme.textH3.fontSize}
          />
        </View>
        <View style={styles.barContent}>
          <TouchableIcon
            icon={"external-link-alt"}
            onPress={() => {
              Linking.openURL(navProtocol + "://" + navEndPoint);
            }}
            color={theme.colorNeutral7}
            size={theme.textH3.fontSize}
          />
        </View>
      </Footer>
    </Container>
  );
};

const styles = StyleSheet.create({
  navigation: {
    flexDirection: "row",
    borderBottomWidth: 0
  },
  addressContainer: {
    marginHorizontal: 40,
    flexDirection: "row",
    flex: 1,
    alignSelf: "center",
    justifyContent: "space-between"
  },
  addressText: {
    marginLeft: 4,
    flex: 1
  },
  footer: {
    flexDirection: "row",
    borderTopWidth: 0,
    justifyContent: "space-between"
  },
  barContent: {
    flexDirection: "row",
    alignSelf: "flex-start"
  }
});

export default WebviewLogin;
