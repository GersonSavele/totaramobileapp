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
import SiteUrl from "./SiteUrl";

export default class Login extends React.Component<Props> {
  
  static actionType = 2;
  
  didRecieveOnMessage = (event: WebViewMessageEvent) => {
    const setupSecretValue = event.nativeEvent.data;
    if ((typeof setupSecretValue !== "undefined") && (setupSecretValue != "null")) {
      this.props.callBack(setupSecretValue, Login.actionType);
    }
  };

  render() {
    const jsCode = "window.ReactNativeWebView.postMessage(document.getElementById('totara_mobile-setup-secret') && document.getElementById('totara_mobile-setup-secret').getAttribute('data-totara-mobile-setup-secret'))";
    const loginUrl = config.loginUri(this.props.siteUrl);//+"/login/index.php";
    return (
      <View style={{ flex: 1}} >
        <WebView
          source={{
            uri: loginUrl,
            headers: { "X-TOTARA-MOBILE-DEVICE-REGISTRATION": config.userAgent }
          }}
          userAgent={config.userAgent}
          javaScriptEnabled={true}
          onMessage={this.didRecieveOnMessage}
          injectedJavaScript={jsCode}
          scrollEnabled={false} 
          />
      </View>
    );
  }
  async componentWillUnmount() {
    return  CookieManager.clearAll(true);
  }
}

type Props = {
  callBack: (data: string, currentAction: number) => void
  siteUrl: string
};


