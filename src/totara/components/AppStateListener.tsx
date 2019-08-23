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
 * @author Tharaka Dushmantha <tharaka.dushmantha@totaralearning.com
**/

import React , { ReactNode } from "react";
import { AppState } from "react-native";
import ConsoleLogger from "@totara/lib/logger/ConsoleLogger";

type Props = {
    onAfterActive? : () => void,
    onBackground? : () => void,
    children? : ReactNode
}

class AppStateListener extends React.Component <Props>{

    constructor(props: Props) {
        super(props);
      }
    state = {
        appState: AppState.currentState
    }

    componentDidMount() {
        AppState.addEventListener("change", this._handleAppStateChange);
    }

    componentWillUnmount() {
        AppState.removeEventListener("change", this._handleAppStateChange);
    }
    _handleAppStateChange = (nextAppState :any) => {
        this.setState({appState: nextAppState});
        if (nextAppState === "background") {
            // Do something here on app background.
            ConsoleLogger.debug("App is in Background Mode.");
        }
        if (nextAppState === "active") {
            if (this.props.onAfterActive){
                this.props.onAfterActive();
            }
            // Do something here on app active foreground mode.
            ConsoleLogger.debug("App is in Active Foreground Mode.");
        }
        if (nextAppState === "inactive") {
            // Do something here on app inactive mode.
            ConsoleLogger.debug("App is in inactive Mode.");
        }
    }

render() {
    return this.props.children;
   }
}

export default AppStateListener;