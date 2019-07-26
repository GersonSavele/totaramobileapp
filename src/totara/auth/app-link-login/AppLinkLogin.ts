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

export default class AuthLinkLogin extends React.Component<Props> { 

  private keySecret: string = "setupsecret";
  private keySite: string = "site";
  private eventType: string = "url";
  private requestRegister: string[] = ["register", "register/", "mobile.totaralearning.com/register", "mobile.totaralearning.com/register/"];

  constructor(props: Props) {
    super(props);
    this.deepLinkListener();
  }

  private deepLinkListener = () => {
    if (Platform.OS === "android") {
      Linking.getInitialURL().then(url => {
        this.getAuthSecret(url);
      });
    } else {
      Linking.addEventListener(this.eventType, this.handleUrlOniOS);
    }
  };

  private handleUrlOniOS = (event: { url: string }) => { 
    this.getAuthSecret(event.url);
  };

  // componentWillUnmount() { 
  //   Linking.removeEventListener(this.eventType, this.handleUrlOniOS);
  // }

  private getAuthSecret = (url: string | null) => { 
    if (url) {
      const requstApi: string = url.replace(/(^\w+:\/\/)?(?:www\.)?/i, "").split("?")[0];
      if (this.requestRegister.includes(requstApi)) {
        const secret = this.getUrlParameter(url, this.keySecret);
        const site = this.getUrlParameter(url, this.keySite);
        if (site != "" && secret != "") {
          this.props.onLoginSuccess({secret: secret, uri: site});
        } else {
          var errorInfo = "Invalid request.";
          if (site == "" && secret == "") {
            errorInfo = "Invalid request, cannot find site and token.";
          } else if (site == "") {
            errorInfo = "Invalid request, cannot find site.";
          } else if (secret == "") {
            errorInfo = "Invalid request, cannot find token.";
          } 
          this.props.onLoginFailure(new Error(errorInfo));
        }
      }
    }
  };

  private getUrlParameter = (url: string, key: string) => {
    key = key.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + key + '=([^&#]*)');
    var results = regex.exec(url);
    return results === null ? '' : results[1].replace(/\+/g, ' ');
  };

}

type Props = {
  onLoginSuccess: (setupSecret: SetupSecret) => {}
  onLoginFailure: (error: Error) => {}
};