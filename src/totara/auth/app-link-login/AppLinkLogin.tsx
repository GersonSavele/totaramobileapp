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

import React from "react";
import { Linking, Platform } from "react-native";

import { SetupSecret } from "../AuthContext";

export default class AppLinkLogin extends React.Component<Props> { 

  private eventType: string = "url";
  private requestRegister: string[] = ["register", "register/", "mobile.totaralearning.com/register", "mobile.totaralearning.com/register/"];

  constructor(props: Props) {
    super(props);
    this.appLinkListener();
  }

  private appLinkListener = () => {
    if (Platform.OS === "android") {
      Linking.getInitialURL().then(url => {
        this.handleAppLink(url);
      });
    } else {
      Linking.addEventListener(this.eventType, this.handleUrlOniOS);
    }
  };

  private handleUrlOniOS = (event: { url: string }) => { 
    this.handleAppLink(event.url);
  };

  private handleAppLink = (encodedUrl: string | null) => {
    if (encodedUrl) {
      const url = decodeURIComponent(encodedUrl);
      const requestRegister: string[] = ["register", "register/", "mobile.totaralearning.com/register", "mobile.totaralearning.com/register/"];
      
      const requstApi: string = url.replace(/(^\w+:\/\/)?(?:www\.)?/i, "").split("?")[0];
      if (requestRegister.includes(requstApi)) {
        this.handleAppLinkRegister(url);
      }
    } 
  };

  private getValueForUrlQueryParameter = (url: string, key: string) => {
    key = key.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + key + '=([^&#]*)');
    var results = regex.exec(url);
    return results === null ? null : results[1].replace(/\+/g, ' ');
  };

  private handleAppLinkRegister = (url: string) => {
    const keySecret: string = "setupsecret";
    const keySite: string = "site";

    const secret = this.getValueForUrlQueryParameter(url, keySecret);
    const site = this.getValueForUrlQueryParameter(url, keySite);
    if (site != null && secret != null && site != "" && secret != "") {
      this.props.onLoginSuccess({ secret: secret, uri: site });
    } else {
      var errorInfo = "Invalid request.";
      if ((site == "" || site == null) && (secret == null || secret == "")) {
        errorInfo = "Invalid request, 'site' and 'token' cannot be null or empty.";
      } else if (site == "" || site == null) {
        errorInfo = "Invalid request, 'site' cannot be null or empty.";
      } else if (secret == null || secret == "") {
        errorInfo = "Invalid request, 'token' cannot be null or empty.";
      }
      this.props.onLoginFailure(new Error(errorInfo));
    }
  };

  render() {
    return null;
  }

}

type Props = {
  onLoginSuccess: (setupSecret: SetupSecret) => {}
  onLoginFailure: (error: Error) => {}
};