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
 *
 */

import React, { useRef } from "react";
import { View, StyleSheet, Linking, Text } from "react-native";
import { SafeAreaView } from "react-navigation";
import { WebView } from "react-native-webview";
// @ts-ignore no types published yet for fortawesome react-native, they do have it react so check in future and remove this ignore
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { config } from "@totara/lib";
import { DEVICE_REGISTRATION } from "@totara/lib/Constant";
import { OutProps } from "./WebviewLoginHook";
import { TouchableIcon } from "@totara/components";

const WebviewLogin = ({
  loginUrl,
  navProtocol,
  navEndPoint,
  cancelLogin,
  didReceiveOnMessage,
  canWebGoBackward,
  canWebGoForward,
  onLogViewNavigate
}: OutProps) => {
  
  const jsCode = "window.ReactNativeWebView.postMessage(document.getElementById('totara_mobile-setup-secret') && document.getElementById('totara_mobile-setup-secret').getAttribute('data-totara-mobile-setup-secret'))";

  const refLoginWebview = useRef<WebView>(null);

  return (
    <SafeAreaView style={{ flex: 1 }} forceInset={{ vertical: "always", horizontal: "always" }}>
        <View style={styles.navigation}>
          <TouchableIcon icon={"times"} disabled={false} onPress={cancelLogin} />
          <View style={styles.addressContainer}>
            <FontAwesomeIcon icon={navProtocol === "https" ? "lock" : "unlock-alt"} />
            <Text style={styles.addressText} numberOfLines={1} ellipsizeMode={"tail"} >
              {navEndPoint}
            </Text>
          </View>
        </View>
        <WebView
          ref={refLoginWebview}
          style={styles.webContainer}
          source={{
            uri: loginUrl,
            headers: { [DEVICE_REGISTRATION]: config.userAgent }
          }}
          userAgent={config.userAgent}
          javaScriptEnabled={true}
          onMessage={didReceiveOnMessage}
          injectedJavaScript={jsCode}
          useWebKit={true}
          onNavigationStateChange={onLogViewNavigate}
        />
        <View style={styles.footer}>
          <View style={{ flexDirection: "row" }}>
            <TouchableIcon icon={"chevron-left"} disabled={!canWebGoBackward} onPress={() => { refLoginWebview.current && refLoginWebview.current!.goBack(); }} />
            <TouchableIcon icon={"chevron-right"} disabled={!canWebGoForward} onPress={() => { refLoginWebview.current && refLoginWebview.current!.goForward(); }} />
          </View>
          <View style={{ flexDirection: "row" }}>
            <TouchableIcon icon={"external-link-alt"} disabled={false} onPress={() => { Linking.openURL(navProtocol+"://"+navEndPoint); }} />
          </View>
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  navigation: {
    height: 44,
    flexDirection: "row",
    borderBottomColor: "#f1f1f1",
    borderBottomWidth: 1,
    backgroundColor: "#fff"
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
    height: 44,
    flexDirection: "row",
    borderTopColor: "#f1f1f1",
    borderTopWidth: 1,
    backgroundColor: "#fff",
    justifyContent: "space-between"
  },
  webContainer: {
    flexGrow: 1
  }
});

export default WebviewLogin;