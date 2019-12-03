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
 * @author Jun Yamog <jun.yamog@totaralearning.com>
 *
 */

import React, { useRef, useContext } from "react";
import { View, StyleSheet, Linking, Text } from "react-native";
import { WebView } from "react-native-webview";
// @ts-ignore no types published yet for fortawesome react-native, they do have it react so check in future and remove this ignore
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Container, Header, Content, Footer } from "native-base";

import { config } from "@totara/lib";
import { DEVICE_REGISTRATION } from "@totara/lib/Constant";
import { TouchableIcon } from "@totara/components";
import { ThemeContext } from "@totara/theme";

import { useWebviewFlow } from "./WebviewFlowHook";
import { ManualFlowChildProps } from "../ManualFlowChildProps";

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
  
  const jsCode = "window.ReactNativeWebView.postMessage(document.getElementById('totara_mobile-setup-secret') && document.getElementById('totara_mobile-setup-secret').getAttribute('data-totara-mobile-setup-secret'))";

  const refLoginWebview = useRef<WebView>(null);

  const [ theme ] = useContext(ThemeContext);

  return (
    <Container style={[{ flex: 0 }, theme.viewContainer]}>
      <Header style={[styles.navigation,  { backgroundColor: theme.colorSecondary1 }]} iosBarStyle={"default"}>
        <TouchableIcon icon={"times"} disabled={false} onPress={cancelLogin} color={ theme.navigationHeaderTintColor } />
        <View style={styles.addressContainer}>
          <FontAwesomeIcon icon={navProtocol === "https" ? "lock" : "unlock-alt"} color={ theme.navigationHeaderTintColor } />
          <Text style={[styles.addressText, {color: theme.navigationHeaderTintColor}]} numberOfLines={1} ellipsizeMode={"tail"} >{navEndPoint}</Text>
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
          <TouchableIcon icon={"chevron-left"} disabled={!canWebGoBackward} onPress={() => { refLoginWebview.current && refLoginWebview.current!.goBack(); }} color={theme.navigationHeaderTintColor} />
          <TouchableIcon icon={"chevron-right"} disabled={!canWebGoForward} onPress={() => { refLoginWebview.current && refLoginWebview.current!.goForward(); }} color={theme.navigationHeaderTintColor} />
        </View>
        <View style={styles.barContent}>
          <TouchableIcon icon={"external-link-alt"} disabled={false} onPress={() => { Linking.openURL(navProtocol + "://" + navEndPoint); }} color={theme.navigationHeaderTintColor} />
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