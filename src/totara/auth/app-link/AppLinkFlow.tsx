/**
 * This file is part of Totara Enterprise.
 *
 * Copyright (C) 2019 onwards Totara Learning Solutions LTD
 *
 * Totara Enterprise is provided only to Totara Learning Solutions
 * LTD’s customers and partners, pursuant to the terms and
 * conditions of a separate agreement with Totara Learning
 * Solutions LTD or its affiliate.
 *
 * If you do not have an agreement with Totara Learning Solutions
 * LTD, you may not access, use, modify, or distribute this software.
 * Please contact [sales@totaralearning.com] for more information.
 */

import { Linking, Platform } from "react-native";
import DeviceInfo from "react-native-device-info";

import { SiteInfo } from "@totara/types";
import { Log, config } from "@totara/lib";
import { fetchData } from "@totara/core/AuthRoutines";
import { AuthFlowChildProps, AuthComponent } from "../AuthComponent";

/**
 * AppLinkFlow uses deep linking to capture the setup secret from the link
 */
export default class AppLinkFlow extends AuthComponent {
  constructor(props: AuthFlowChildProps) {
    super(props);
  }

  async componentDidMount() {
    if (Platform.OS === "android") {
      Linking.getInitialURL().then((url) => {
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
      const requestUrl = url.split("?")[0];
      const requestRegister: string[] = [
        `${config.appLinkDomain}/register`,
        `${config.appLinkDomain}/register/`,
        `${config.deepLinkSchema}/register`,
        `${config.deepLinkSchema}/register/`
      ];

      if (requestRegister.includes(requestUrl)) {
        try {
          const resultRegistration = this.getDeviceRegisterData(url);
          // fetch from global
          // eslint-disable-next-line no-undef
          await fetchData(fetch)<SiteInfo>(config.infoUri(resultRegistration.uri), {
            method: "POST",
            body: JSON.stringify({ version: DeviceInfo.getBuildNumber() })
          })
            .then((siteInfo) => {
              this.props.onLoginSuccess({
                secret: resultRegistration.secret,
                uri: resultRegistration.uri,
                siteInfo: siteInfo
              });
            })
            .catch((error) => this.props.onLoginFailure(error));
        } catch (error) {
          this.props.onLoginFailure(error);
        }
      }
    }
  };

  private getValueForUrlQueryParameter = (url: string, key: string) => {
    key = key.replace(/[[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + key + "=([^&#]*)");
    var results = regex.exec(url);
    return results === null ? null : results[1].replace(/\+/g, " ");
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
