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
import { Modal, View } from "react-native";

import SiteUrl from "../SiteUrl";
import NativeLogin from "./NativeLogin";
import { AuthComponent, AuthProviderStateLift } from "../AuthComponent";
import { StyleProvider } from "native-base";
import { theme, getTheme } from "@totara/theme";
import { Log } from "@totara/lib";

class NativeFlow extends AuthComponent<{}, States> {
  
  constructor(props: AuthProviderStateLift) {
    super(props);
    this.state = { 
      step: SiteUrl.actionType,
      uri: undefined, 
      secret: undefined
    };
    this.setBrandTheme("http://10.0.8.153");
  }

  onSetupLoginData = (data: string, currentAction: number) => {
    switch (currentAction) {
      case SiteUrl.actionType:
        this.setBrandTheme(data);
        this.setState({
          step: NativeLogin.actionType,
          uri: data
        });
        
        break;
      case NativeLogin.actionType:
        if ( this.state.uri && data ) {
          this.props.onLoginSuccess({uri: this.state.uri, secret: data});
        } else {
          this.props.onLoginFailure(new Error(`Missing data: ${data}`));
        }
        break;
      default:
        break;
    }
  };

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

  setBrandTheme = (site: string) => {
    Log.info("site: ", site);
    theme.brandPrimary = "#ff0000";
  };

  render() {
    switch (this.state.step) {
      case NativeLogin.actionType:
        
        return (
          <StyleProvider style={getTheme(theme)}>
          <NativeLogin onSuccessfulSiteUrl={ (siteUrl, action) => this.onSetupLoginData(siteUrl, action) } siteUrl={ this.state.uri } brandLogo={ "https://trademe.tmcdn.co.nz/tm/agentimages/jobs/wide/1846418-1.jpg" } />
           </StyleProvider>
          );
      default:
        return <SiteUrl onSuccessfulSiteUrl={ (siteUrl, action) => this.onSetupLoginData(siteUrl, action) } siteUrl={ this.state.uri } />;
    }
  }
}

type States = {
  step: number,
  uri?: string, 
  secret?: string
};

export default  NativeFlow;