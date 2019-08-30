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
import { Modal } from "react-native";

import SiteUrl from "../manual/SiteUrl";
import NativeLogin from "./NativeLogin";
import { AuthComponent, AuthProviderStateLift } from "../AuthComponent";
import { StyleProvider } from "native-base";
import { theme, getTheme } from "@totara/theme";

class NativeFlow extends AuthComponent<{}, States> {

  constructor(props: AuthProviderStateLift) {
    super(props);
    this.state = {
      step: SiteUrl.actionType,
      uri: undefined,
      secret: undefined
    };
  }

  onSetupLoginData = (data: string, currentAction: number) => {
    switch (currentAction) {
      case SiteUrl.actionType:
        this.getSiteConfiguration().then((response)=> {
          if (response.status ===  200) {
            return response.json();
          }
        }).then((siteInfo) => {
          if(siteInfo && siteInfo.theme) {
            this.setSiteTheme(siteInfo.theme);
          }
          this.setState({
            step: NativeLogin.actionType,
            uri: data
          });
        });
        break;
      case NativeLogin.actionType:
        if (this.state.uri && data) {
          this.props.onLoginSuccess({ uri: this.state.uri, secret: data });
        } else {
          this.props.onLoginFailure(new Error(`Missing data: ${data}`));
        }
        break;
      default:
        break;
    }
  };

  setSiteTheme = (data: Theme) => {
    if(data && data.brandPrimary) {
      theme.brandPrimary = data.brandPrimary;
    }
    if(data && data.logoUrl) {
      theme.logoUrl = data.logoUrl;
    }
  }

  onCancelLogin = (currentAction: number) => {
    switch (currentAction) {
      case NativeLogin.actionType:
        this.setState({
          step: SiteUrl.actionType,
          uri: this.state.uri
        });
        break;
      default:
        break;
    }
  };

  getSiteConfiguration = () => {
    //TODO will be covered in MOB-172
    return Promise.resolve({
      status: 200,
      json: () => ({
          version: "2019061900",
          auth: "native",
          siteMaintenance: false,
          theme: {
             logoUrl: "https://webcasts.td.org/uploads/assets/2300/logo.png",
             brandPrimary: "#69BD45"
          }
        })       
    });
  };

  render() {
    switch (this.state.step) {
      case NativeLogin.actionType:
        return (
          <StyleProvider style={getTheme(theme)}>
            <Modal animationType="slide" transparent={false} >
              {/* //TODO will be covered in MOB-172 */}
              <NativeLogin 
                onSuccessfulSiteUrl={(siteUrl, action) => this.onSetupLoginData(siteUrl, action)} 
                siteUrl={this.state.uri}
                onBack={this.onCancelLogin} />
            </Modal>
          </StyleProvider>
        );
      default:
        return <SiteUrl onSuccessfulSiteUrl={(siteUrl, action) => this.onSetupLoginData(siteUrl, action)} siteUrl={this.state.uri} />;
    }
  }
}

type States = {
  step: number,
  uri?: string,
  secret?: string,
};

type Theme = {
  logoUrl?: string,
  brandPrimary?: string
};

type SiteInfo = {
  version: string,
  auth: string,
  siteMaintenance: boolean,
  theme?: Theme
};

export default NativeFlow;