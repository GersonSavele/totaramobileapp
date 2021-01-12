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

import React, { useRef, useContext } from "react";
import { View, StyleSheet, Linking, Text } from "react-native";
import { WebView } from "react-native-webview";
// @ts-ignore no types published yet for fortawesome react-native, they do have it react so check in future and remove this ignore
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Container, Header, Content, Footer } from "native-base";

import { config } from "@totara/lib";
import { DEVICE_REGISTRATION } from "@totara/lib/constants";
import { TouchableIcon } from "@totara/components";
import { ThemeContext } from "@totara/theme";

import { useWebviewFlow } from "./WebviewFlowHook";
import { ManualFlowChildProps } from "../ManualFlowChildProps";
import CloseButton from "@totara/components/CloseButton";

const WebviewLogin = (props: ManualFlowChildProps) => {
  const {
    loginUrl,
    navProtocol,
    navEndPoint,
    cancelLogin,
    didReceiveOnMessage,
    canWebGoBackward,
    canWebGoForward,
    onLogViewNavigate
  } = useWebviewFlow(props);

  const jsCode =
    "window.ReactNativeWebView.postMessage(document.getElementById('totara_mobile-setup-secret') && document.getElementById('totara_mobile-setup-secret').getAttribute('data-totara-mobile-setup-secret'))";

  const refLoginWebview = useRef<WebView>(null);

  const [theme] = useContext(ThemeContext);

  return (
    <Container style={[theme.viewContainer, { flex: 0 }]}>
      <Header style={[styles.navigation, { backgroundColor: theme.colorSecondary1 }]} iosBarStyle={"default"}>
        <CloseButton onPress={cancelLogin} />
        <View style={styles.addressContainer}>
          <FontAwesomeIcon icon={navProtocol === "https" ? "lock" : "unlock-alt"} color={theme.colorNeutral7} />
          <Text style={[styles.addressText, { color: theme.colorNeutral7 }]} numberOfLines={1} ellipsizeMode={"tail"}>
            {navEndPoint}
          </Text>
        </View>
      </Header>
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
