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

import { SetupSecret } from "../AuthContext";
import SiteUrl from "./SiteUrl";
import Login from "./Login";

export default class WebLogin extends React.Component<Props, States> {
  
  constructor(props: Props) {
    super(props);
    this.state = { 
      step: SiteUrl.actionType,
      uri: undefined, 
      secret: undefined
    };
  };

  onSetupLoginData = (data: string, currentAction: number) => {
    switch (currentAction) {
      case SiteUrl.actionType:
        this.setState({
          step: Login.actionType,
          uri: data
        });
        break;
      case Login.actionType:
        if ( this.state.uri && data ) {
          this.props.onLoginSuccess({uri: this.state.uri, secret: data});
        } else {
          console.log("Login failed.");
        }
        break;
      default:
        break;
    }
  };

  onCancelLogin = (currentAction: number) => {
    switch (currentAction) {
      case Login.actionType:
        this.setState({
          step: SiteUrl.actionType,
          uri: this.state.uri
        });
        break;
      default:
        break;
    }
  };

  render() {
    switch (this.state.step) {
      case SiteUrl.actionType:
        return <SiteUrl onSuccessfulSiteUrl={ (siteUrl, action) => this.onSetupLoginData(siteUrl, action) } siteUrl={ this.state.uri } />;
      case Login.actionType:
        return <Login onSuccessfulLogin={ (setupSecret, action) => this.onSetupLoginData(setupSecret, action) } siteUrl={ this.state.uri! } onCancelLogin={(action) => this.onCancelLogin(action)} />;
      default:
        return <SiteUrl onSuccessfulSiteUrl={ (siteUrl, action) => this.onSetupLoginData(siteUrl, action) } siteUrl={ this.state.uri } />;
    }
  }
}

type Props = {
  onLoginSuccess: (setupSecret: SetupSecret) => {}
  onLoginFailure: (error: Error) => {}
};

type States = {
  step: number,
  uri?: string, 
  secret?: string
};