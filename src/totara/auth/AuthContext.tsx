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

import { config } from "@totara/lib";
import { Theme } from "@totara/theme";

export const AuthContext = React.createContext<State>({
  isAuthenticated: false,
  appState: undefined,
  logOut: () => {
    return Promise.resolve();
  }
});

export type State = {
  isAuthenticated: boolean;
  appState?: AppState;
  logOut: () => Promise<void>;
};

export type SiteInfo = {
  auth: string;
  siteMaintenance: boolean;
  theme?: Theme;
  version: string;
};

export type AppState = {
  apiKey: string;
  host: string;
  siteInfo: SiteInfo;
};

enum Compatible {
  Api = 1
}

//TODO-Need to integrate correct logic
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