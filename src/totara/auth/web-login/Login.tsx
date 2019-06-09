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

import React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { WebView } from "react-native-webview";
import { WebViewMessageEvent } from "react-native-webview/lib/WebViewTypes";
import CookieManager from "react-native-cookies";
import { Button } from "native-base";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";

import { config } from "@totara/lib";

export default class Login extends React.Component<Props> {
  
  static actionType = 2;
  
  didRecieveOnMessage = (event: WebViewMessageEvent) => {
    const setupSecretValue = event.nativeEvent.data;
    if ((typeof setupSecretValue !== "undefined") && (setupSecretValue != "null")) {
      this.props.onSuccessfulLogin(setupSecretValue, Login.actionType);
    }
  };

  render() {
    const jsCode = "window.ReactNativeWebView.postMessage(document.getElementById('totara_mobile-setup-secret') && document.getElementById('totara_mobile-setup-secret').getAttribute('data-totara-mobile-setup-secret'))";
    const loginUrl = config.loginUri(this.props.siteUrl);
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={{ flex: 1 }} >
          <View style={styles.navigation} >
            <Button transparent onPress={() => { this.props.onCancelLogin(Login.actionType); }} style={{padding: 8}} >
              <FontAwesomeIcon icon="times" size={24} />
            </Button>
          </View>
          <WebView
            style={{flex: 1}}
            source={{
              uri: loginUrl,
              headers: { "X-TOTARA-MOBILE-DEVICE-REGISTRATION": config.userAgent }
            }}
            userAgent={config.userAgent}
            javaScriptEnabled={true}
            onMessage={this.didRecieveOnMessage}
            injectedJavaScript={jsCode}
            useWebKit={true}
          />
        </View>
      </SafeAreaView>
    );
  }
  
  async componentWillUnmount() {
    return  CookieManager.clearAll(true);
  }
}

type Props = {
  onSuccessfulLogin: (data: string, currentAction: number) => void
  onCancelLogin: (currentAction: number) => void
  siteUrl: string
};

const styles = StyleSheet.create({
  navigation: { 
    height: 44, 
    justifyContent: "flex-end", 
    alignItems: "flex-start", 
    borderBottomColor: "#f1f1f1", 
    borderBottomWidth: 1,
    backgroundColor: "#ffffff",
  }
});
