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
import { View } from "react-native";
import { WebView } from "react-native-webview";
import { WebViewMessageEvent } from "react-native-webview/lib/WebViewTypes";
import CookieManager from "react-native-cookies";

import { config } from "@totara/lib";
import { SetupSecret } from "./AuthContext";

export default class WebLogin extends React.Component<Props> {

  didRecieveOnMessage = (event: WebViewMessageEvent) => {
    const setupSecretValue = event.nativeEvent.data;
    if ((typeof setupSecretValue !== "undefined") && (setupSecretValue != "null")) {
      this.props.onLoginSuccess({
        secret: setupSecretValue,
        uri: ""
      });
    }
  };

  render() {
    const jsCode = "window.ReactNativeWebView.postMessage(document.getElementById('totara_mobile-setup-secret') && document.getElementById('totara_mobile-setup-secret').getAttribute('data-totara-mobile-setup-secret'))";
    return (
      <View style={{ flex: 1, marginTop: 50 }} >
        <WebView
          source={{
            uri: config.loginUri,
            headers: { "X-TOTARA-MOBILE-DEVICE-REGISTRATION": config.userAgent }
          }}
          userAgent={config.userAgent}
          javaScriptEnabled={true}
          onMessage={this.didRecieveOnMessage}
          injectedJavaScript={jsCode}
          scrollEnabled={false}
          scalesPageToFit={true}
        />
      </View>
    );
  }
  async componentWillUnmount() {
    return  CookieManager.clearAll(true);
  }
}

type Props = {
  onLoginSuccess: (setupSecret: SetupSecret) => {}
  onLoginFailure: (error: Error) => {}
};

