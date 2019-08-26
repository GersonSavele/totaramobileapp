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
import { AppState, AppStateStatus } from "react-native";
import { Log } from "@totara/lib";

type Props = {
    onAfterActive? : () => {},
    onBackground? : () => {},
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
        AppState.addEventListener("change", this.handleAppStateChange);
    }

    componentWillUnmount() {
        AppState.removeEventListener("change", this.handleAppStateChange);
    }

    /**
     * @AppStateChange : Here, will trigger when app is background/inactive and foreground.
     * @parameter : When app goes background and foreground, next app state.
     * @return : null 
    */

    handleAppStateChange = (nextAppState : AppStateStatus) => {
        this.setState({appState: nextAppState});

        if (nextAppState === "active") {
            if (this.props.onAfterActive){
                this.props.onAfterActive();
            }
            // Do something here on app active foreground mode.
            Log.debug("App is in Active Foreground Mode.");
        }
    /**
     * @AdditionalActionModal won't use background/inactive app state. however, this is common component and it will be useful for future implementation.
    */
        if (nextAppState === "background") {
            // Do something here on app background.
            Log.debug("App is in Background Mode.");
        }
        if (nextAppState === "inactive") {
            // Do something here on app inactive mode.
            Log.debug("App is in inactive Mode.");
        }
    }

render() {
    return this.props.children != null ? this.props.children : null;
   }
}

export default AppStateListener;