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

import React from "react";

import { config } from "@totara/lib";

import { AuthContextState, initialState, Setup } from "./AuthHook";

export const AuthContext = React.createContext<State>({
  authContextState: initialState,
  logOut: () => Promise.resolve(),
  onLoginSuccess: () => Promise.resolve(),
  onLoginFailure: () => Promise.resolve()
});

type State = {
  authContextState: AuthContextState;
  logOut: (local?: boolean) => Promise<void>;
  onLoginSuccess: (setup: Setup) => Promise<void>;
  onLoginFailure: (error: Error) => Promise<void>;
};

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
    if (version && config.minApiVersion <= version) return [Compatible.Api];
    else return [];
  }
};
