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

export default class WebLogin extends React.Component<Props> {
  
  constructor(props: Props) {
    super(props);
    this.state = { 
      step: SiteUrl.actionType,
      dataSetup: {uri: null, secret: null},
    };
  };

  onSetupLoginData = (dataAction: string, currentAction: number)  => {
    switch (currentAction) {
      case SiteUrl.actionType:
        this.setState({
          step: Login.actionType,
          dataSetup: { uri: dataAction }
        });
        break;
      case Login.actionType:
        this.props.onLoginSuccess({uri: this.state.dataSetup.uri, secret: dataAction});
        break;
      default:
        break;
    }
  };

  render() {
    switch (this.state.step) {
      case SiteUrl.actionType:
        return <SiteUrl onSetupLoginData={ this.onSetupLoginData } />;
      case Login.actionType:
        return <Login onSetupLoginData={ this.onSetupLoginData } />
      default:
          return <SiteUrl onSetupLoginData={ this.onSetupLoginData } />;
    }
  }
}

type Props = {
  onLoginSuccess: (setupSecret: SetupSecret) => {}
  onLoginFailure: (error: Error) => {}
};