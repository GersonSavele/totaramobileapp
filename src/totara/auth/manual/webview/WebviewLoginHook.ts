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
 * @author: Kamala Tennakoon <kamala.tennakoon@totaralearning.com>
 */

import { useState, useEffect } from "react";
import { WebViewMessageEvent, WebViewNavigation } from "react-native-webview/lib/WebViewTypes";
import CookieManager from "react-native-cookies";
import { config } from "@totara/lib";

export const useWebviewLogin = ({
  siteUrl,
  onCancelWebviewLogin,
  onRecievedSetupSecret
}: Props): OutProps => {
  const getProtocolEndpoint = (url: string) => url.split("://");

  const cancelLogin = () => {
    onCancelWebviewLogin();
  };

  const didReceiveOnMessage = (event: WebViewMessageEvent) => {
    const setupSecretValue = event.nativeEvent.data;
    if (typeof setupSecretValue !== "undefined" && setupSecretValue != "null") {
      onRecievedSetupSecret(setupSecretValue);
    }
  };

  const onLogViewNavigate = (navState: WebViewNavigation) => {
    setCanWebGoBackward(navState.canGoBack);
    setCanWebGoForward(navState.canGoForward);
    let spiltedUrl = getProtocolEndpoint(navState.url);
    setNavProtocol(spiltedUrl[0]);
    setNavEndPoint(spiltedUrl[1]);
  };

  const loginUrl = config.loginUri(siteUrl);

  let spiltedLoginUrl = getProtocolEndpoint(loginUrl);
  const [navProtocol, setNavProtocol] = useState(spiltedLoginUrl[0]);
  const [navEndPoint, setNavEndPoint] = useState(spiltedLoginUrl[1]);

  const [canWebGoBackward, setCanWebGoBackward] = useState(false);
  const [canWebGoForward, setCanWebGoForward] = useState(false);
  const [isInitialize, setIsInitialize] = useState(true);

  useEffect(() => {
    if (isInitialize) {
      CookieManager.clearAll(true);
      setIsInitialize(false);
    }
  }, [isInitialize]);

  return {
    loginUrl,
    navProtocol,
    navEndPoint,
    canWebGoBackward,
    canWebGoForward,
    cancelLogin,
    didReceiveOnMessage,
    onLogViewNavigate
  };
};

type Props = {
  siteUrl: string;
  onCancelWebviewLogin: () => void;
  onRecievedSetupSecret: (setsecret: string) => void;
};

export type OutProps = {
  loginUrl: string;
  navProtocol: string;
  navEndPoint: string;
  canWebGoForward: boolean;
  canWebGoBackward: boolean;
  cancelLogin: () => void;
  didReceiveOnMessage: (event: WebViewMessageEvent) => void;
  onLogViewNavigate: (navState: WebViewNavigation) => void;
};