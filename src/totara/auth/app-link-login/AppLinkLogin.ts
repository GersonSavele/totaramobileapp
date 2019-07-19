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
import { Linking, Platform, Alert } from "react-native";
import { SetupSecret } from "../AuthContext";

export default class AuthLinkLogin extends React.Component<Props> {  
  private _keyToken: string = "token";
  private _keySite: string = "site";
  private _eventType: string = "url";
  constructor(props: Props) {
    super(props);
    this.deepLinkListener();
  };

  private deepLinkListener = () => {
    if (Platform.OS === 'android') {
      Linking.getInitialURL().then(url => {
        this.getAuthSecret(url);
      });
    } else {
      Linking.addEventListener(this._eventType, this.handleUrlOniOS);
    }
  }

  private handleUrlOniOS = (event) => { 
    this.getAuthSecret(event.url);
  }

  // componentWillUnmount() { // C
  //   Linking.removeEventListener(this._eventType, this.handleUrlOniOS);
  // }

  private getAuthSecret = (url) => { // E
    var token = this.getUrlParameter(url, this._keyToken);
    var site = this.getUrlParameter(url, this._keySite);
    if (site != "" && token != "") {
      this.props.onLoginSuccess({uri: site, secret: token});
    } else {
      var errorInfo = "Invalid request.";
      if (site == "" && token == "") {
        errorInfo = "Invalid request, cannot find site and token.";
      } else if (site == "") {
        errorInfo = "Invalid request, cannot find site.";
      } else if (token == "") {
        errorInfo = "Invalid request, cannot find token.";
      } 
      this.props.onLoginFailure(new Error(errorInfo));
    }
  }

  private getUrlParameter = (url: string, key: string) => {
    key = key.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + key + '=([^&#]*)');
    var results = regex.exec(url);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }
}

type Props = {
  onLoginSuccess: (setupSecret: SetupSecret) => {}
  onLoginFailure: (error: Error) => {}
};