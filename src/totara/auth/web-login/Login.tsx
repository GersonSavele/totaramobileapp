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
import { WebViewMessageEvent, WebViewNavigation } from "react-native-webview/lib/WebViewTypes";
import CookieManager from "react-native-cookies";
import { Button } from "native-base";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { config } from "@totara/lib";


class Login extends React.Component<Props, States> {
  
  static actionType = 2;
  webviewLogin = React.createRef<WebView>();
  constructor(props: Props) {
    super(props);
    this.state = { 
      canWebGoBack: false,
      canWebGoForward: false
    };
  }

  didReceiveOnMessage = (event: WebViewMessageEvent) => {
    const setupSecretValue = event.nativeEvent.data;
    if ((typeof setupSecretValue !== "undefined") && (setupSecretValue != "null")) {
      this.props.onSuccessfulLogin(setupSecretValue, Login.actionType);
    }
  };

  onLogViewNavigate = (navState: WebViewNavigation) => {
    this.setState({
      canWebGoBack: navState.canGoBack,
      canWebGoForward: navState.canGoForward
    });
  }

  async componentWillUnmount() {
    return  CookieManager.clearAll(true);
  }

  cancelLogin = () =>{
    this.props.onCancelLogin(Login.actionType);
  }

  goBack = () => {
    this.webviewLogin.current!.goBack();
  }

  goForward = () => {
    this.webviewLogin.current!.goForward();
  }

  render() {
    const header = {"X-TOTARA-MOBILE-DEVICE-REGISTRATION" : config.userAgent}
    const jsCode = "window.ReactNativeWebView.postMessage(document.getElementById('totara_mobile-setup-secret') && document.getElementById('totara_mobile-setup-secret').getAttribute('data-totara-mobile-setup-secret'))";
    const loginUrl = config.loginUri(this.props.siteUrl);
    const {navigation, actionItem} = styles;


    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }} >
          <View style={navigation} >
            <Button transparent onPress={this.cancelLogin} style= {actionItem} >
              <FontAwesomeIcon icon="times" size={24} />
            </Button>
            <View style={{ flexDirection: "row" }}>
              <Button transparent onPress={this.goBack} style={actionItem} disabled={!(this.state.canWebGoBack)} >
                <FontAwesomeIcon icon="arrow-left" size={22} color={(this.state.canWebGoBack ? "#000000": "#D1D5D8")} />
              </Button>
              <Button transparent onPress={this.goForward} style={actionItem}  disabled={!(this.state.canWebGoForward)} >
                <FontAwesomeIcon icon="arrow-right" size={22} color={(this.state.canWebGoForward ? "#000000": "#D1D5D8")} />
              </Button>
            </View>
          </View>
          <WebView
            ref={this.webviewLogin}
            style={{ flex: 1 }}
            source={{
              uri: loginUrl,
              headers: header
            }}
            userAgent={config.userAgent}
            javaScriptEnabled={true}
            onMessage={this.didReceiveOnMessage}
            injectedJavaScript={jsCode}
            useWebKit={true}
            onNavigationStateChange={this.onLogViewNavigate}
          />
        </View>
      </SafeAreaView>
    );
  }
}

type Props = {
  onSuccessfulLogin: (data: string, currentAction: number) => void
  onCancelLogin: (currentAction: number) => void
  siteUrl: string
};
type States = {
  canWebGoBack: boolean,
  canWebGoForward: boolean
};


const styles = StyleSheet.create({
  navigation: { 
    height: 44, 
    alignItems: "flex-start", 
    borderBottomColor: "#f1f1f1", 
    borderBottomWidth: 1,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  actionItem: {
    padding: 8
  }
});

export default Login;