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
import { View, StyleSheet, Linking, Text, StatusBar} from "react-native";
import { WebView } from "react-native-webview";
// @ts-ignore no types published yet for fortawesome react-native, they do have it react so check in future and remove this ignore
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Container, Header, Content, Footer } from "native-base";

import { config } from "@totara/lib";
import { DEVICE_REGISTRATION } from "@totara/lib/Constant";
import { OutProps } from "./WebviewLoginHook";
import { TouchableIcon } from "@totara/components";
import { colorSecondary4, colorSecondary3, colorNeutral3, textColorDark } from "@totara/theme";

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
    <Container style={{ flex: 1, backgroundColor: colorSecondary4 }}>
      <Header style={styles.navigation}>
        <StatusBar barStyle={"default"} />
        <TouchableIcon icon={"times"} disabled={false} onPress={cancelLogin} />
        <View style={styles.addressContainer}>
          <FontAwesomeIcon icon={navProtocol === "https" ? "lock" : "unlock-alt"} color={textColorDark} />
          <Text style={styles.addressText} numberOfLines={1} ellipsizeMode={"tail"} >{navEndPoint}</Text>
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
          useWebKit={true}
          onNavigationStateChange={onLogViewNavigate}
        />
      </Content>
      <Footer style={styles.footer}>
        <View style={styles.barContent}>
          <TouchableIcon icon={"chevron-left"} disabled={!canWebGoBackward} onPress={() => { refLoginWebview.current && refLoginWebview.current!.goBack(); }} />
          <TouchableIcon icon={"chevron-right"} disabled={!canWebGoForward} onPress={() => { refLoginWebview.current && refLoginWebview.current!.goForward(); }} />
        </View>
        <View style={styles.barContent}>
          <TouchableIcon icon={"external-link-alt"} disabled={false} onPress={() => { Linking.openURL(navProtocol + "://" + navEndPoint); }} />
        </View>
      </Footer>
    </Container>
  );
};

const styles = StyleSheet.create({
  navigation: {
    flexDirection: "row",
    borderBottomColor: colorNeutral3,
    borderBottomWidth: 1,
    backgroundColor: colorSecondary3
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
    flex: 1,
    color: textColorDark
  },
  footer: {
    flexDirection: "row",
    borderTopColor: colorNeutral3,
    borderTopWidth: 1,
    backgroundColor: colorSecondary3,
    justifyContent: "space-between"
  },
  barContent: {
    flexDirection: "row",
    alignSelf: "flex-start"
  }
});

export default WebviewLogin;