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
import { Linking, Platform } from "react-native";

import VersionInfo from "react-native-version-info";

import { SiteInfo } from "@totara/types";
import { Log, config } from "@totara/lib";
import { fetchData } from "@totara/core/AuthRoutines";

import { AuthFlowChildProps, AuthComponent } from "../AuthComponent";


export default class AppLinkFlow extends AuthComponent {

  constructor(props: AuthFlowChildProps) {
    super(props);
  }
  
  async componentDidMount() {
    if (Platform.OS === "android") {
      Linking.getInitialURL().then(url => {
        this.handleAppLink(url);
      });
    } else {
      Linking.addEventListener("url", this.handlerForiOS);
    }
  }

  private handlerForiOS = async (event: { url: string }) => {
    this.handleAppLink(event.url);
  };

  private handleAppLink = async (encodedUrl: string | null) => {
    Log.info("handleAppLink", encodedUrl);
    if (encodedUrl) {
      const url = decodeURIComponent(encodedUrl);
      const requestUrl= url.split("?")[0];
      const requestRegister: string[] = [`${config.appLinkDomain}/register`, `${config.appLinkDomain}/register/`, `${config.deepLinkSchema}/register`, `${config.deepLinkSchema}/register/`];
      
      if (requestRegister.includes(requestUrl)) {
        try {
          const resultRegistration = this.getDeviceRegisterData(url);
          // fetch from global
          // eslint-disable-next-line no-undef
          await fetchData(fetch)<SiteInfo>(
            config.infoUri(resultRegistration.uri),
            {
              method: "POST",
              body: JSON.stringify({ version: VersionInfo.appVersion })
            }
          )
            .then(siteInfo => {
              this.props.onLoginSuccess({
                secret: resultRegistration.secret,
                uri: resultRegistration.uri,
                siteInfo: siteInfo
              });
            })
            .catch(error => this.props.onLoginFailure(error));
        } catch (error) {
          this.props.onLoginFailure(error);
        }
      }
    } 
  };

  private getValueForUrlQueryParameter = (url: string, key: string) => {
    key = key.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + key + '=([^&#]*)');
    var results = regex.exec(url);
    return results === null ? null : results[1].replace(/\+/g, ' ');
  };
  
  private getDeviceRegisterData = (url: string) => {
    const keySecret: string = "setupsecret";
    const keySite: string = "site";

    const secret = this.getValueForUrlQueryParameter(url, keySecret);
    const site = this.getValueForUrlQueryParameter(url, keySite);
    if (site != null && secret != null && site != "" && secret != "") {
      return { secret: secret, uri: site };
    } else {
      var errorInfo = "Invalid request.";
      if ((site == "" || site == null) && (secret == null || secret == "")) {
        errorInfo = "Invalid request, 'site' and 'token' cannot be null or empty.";
      } else if (site == "" || site == null) {
        errorInfo = "Invalid request, 'site' cannot be null or empty.";
      } else if (secret == null || secret == "") {
        errorInfo = "Invalid request, 'token' cannot be null or empty.";
      }
      throw new Error(errorInfo);
    }
  };
  
  render() {
    return null;
  }
}