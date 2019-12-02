/*
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
 * @author Jun Yamog <jun.yamog@totaralearning.com>
 */


import React from "react";

import { config } from "@totara/lib";

import { AuthContextState, initialState, Setup } from "./AuthHook";

export const AuthContext = React.createContext<State>({
  authContextState: initialState,
  logOut: () => {
    return Promise.resolve();
  },
  onLoginSuccess: () => {},
  onLoginFailure: () => {},
});

type State = {
  authContextState: AuthContextState;
  logOut: (local?: boolean) => Promise<void>;
  onLoginSuccess: (setup: Setup) => void;
  onLoginFailure: (error: Error) => void;
}

enum Compatible {
  Api = 1
}

export const AuthConsumer = AuthContext.Consumer;

//TODO MOB-273 Need to integrate correct logic
export const isValidApiVersion = (apiVersoin?: string) => {
  const compatibilityList = isCompatible(apiVersoin);
  return compatibilityList.length > 0;
};

export const isCompatible = (version?: string) => {
  const fullCompatible = [Compatible.Api];
  if (config.minApiVersion === "disabled") {
    return fullCompatible;
  } else {
    if (version && config.minApiVersion <= version) 
      return [Compatible.Api];
    else 
    return [];
  }
};