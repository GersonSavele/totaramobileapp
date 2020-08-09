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
 * @author Tharaka Dushmantha <tharaka.dushmantha@totaralearning.com>
 */

import { useReducer, useEffect } from "react";

import { config, Log } from "@totara/lib";
import { DEVICE_REGISTRATION } from "@totara/lib/constants";
import { ManualFlowChildProps } from "../ManualFlowChildProps";
import { NetworkError } from "@totara/types/Error";

const initialState = {
  setupSecret: undefined,
  inputUsername: config.userName || "",
  inputPassword: config.password || "",
  inputUsernameStatus: undefined,
  inputPasswordStatus: undefined,
  isRequestingLogin: false,
  errorStatusUnauthorized: false,
  unhandledLoginError: undefined
};

export const useNativeFlow = (fetchData: <T>(input: RequestInfo, init?: RequestInit) => Promise<T>) => ({
  onSetupSecretSuccess,
  onSetupSecretFailure,
  siteUrl,
  onManualFlowCancel
}: ManualFlowChildProps) => {
  const [nativeLoginState, dispatch] = useReducer(nativeReducer, initialState);

  const inputUsernameWithShowError = (username: string) => {
    dispatch({ type: "setusername", payload: username });
  };

  const inputPasswordWithShowError = (password: string) => {
    dispatch({ type: "setpassword", payload: password });
  };

  const onClickEnter = () => {
    dispatch({ type: "submit", payload: undefined });
  };

  const onFocusInput = () => {
    dispatch({ type: "resetform" });
  };

  const fetchLoginPromise = () =>
    fetchData<LoginSetup>(config.nativeLoginSetupUri(siteUrl), {
      method: "GET",
      headers: { [DEVICE_REGISTRATION]: config.userAgent }
    }).then((loginSetup) => {
      // eslint-disable-next-line no-undef
      return fetchData<SetupSecret>(config.nativeLoginUri(siteUrl), {
        method: "POST",
        body: JSON.stringify({
          loginsecret: loginSetup.loginsecret,
          username: nativeLoginState.inputUsername,
          password: nativeLoginState.inputPassword
        }),
        headers: { [DEVICE_REGISTRATION]: config.userAgent }
      });
    });

  useEffect(() => {
    const run = nativeLoginState.isRequestingLogin;
    if (run) {
      fetchLoginPromise()
        .then((setupSecret) => {
          dispatch({ type: "setupsecret", payload: setupSecret.setupsecret });
        })
        .catch((error) => {
          if (error.status === 401) {
            dispatch({ type: "loginfailed" });
          } else {
            dispatch({ type: "unhandledloginfail", payload: error });
          }
        });
    }
  }, [nativeLoginState.isRequestingLogin]);

  if (nativeLoginState.unhandledLoginError) {
    onSetupSecretFailure(nativeLoginState.unhandledLoginError);
  }

  if (nativeLoginState.setupSecret) {
    Log.debug("Setup Secret", nativeLoginState.setupSecret);
    onSetupSecretSuccess(nativeLoginState.setupSecret);
  }

  return {
    nativeLoginState,
    onManualFlowCancel,
    onClickEnter,
    inputUsernameWithShowError,
    inputPasswordWithShowError,
    onFocusInput
  };
};

/**
 * Reducer to manage Navigation reducer to proper states
 * @param state - input state
 * @param action - dispatched action to change state
 * @returns - output state
 */
export const nativeReducer = (state: NativeLoginState = initialState, action: Action): NativeLoginState => {
  switch (action.type) {
    case "setupsecret":
      return {
        ...state,
        setupSecret: action.payload as string
      };
    case "setusername":
      return {
        ...state,
        inputUsername: action.payload as string
      };
    case "setpassword":
      return {
        ...state,
        inputPassword: action.payload as string
      };
    case "loginfailed":
      return {
        ...state,
        isRequestingLogin: false,
        errorStatusUnauthorized: true
      };
    case "resetform":
      return {
        ...state,
        errorStatusUnauthorized: false
      };
    case "unhandledloginfail":
      return {
        ...state,
        unhandledLoginError: action.payload as NetworkError
      };
    case "submit":
      if (state.inputUsername && state.inputUsername != "" && state.inputPassword && state.inputPassword != "") {
        return {
          ...state,
          isRequestingLogin: true,
          inputUsernameStatus: undefined,
          inputPasswordStatus: undefined,
          errorStatusUnauthorized: false,
          unhandledLoginError: undefined
        };
      } else {
        if ((!state.inputUsername || state.inputUsername == "") && state.inputPassword && state.inputPassword != "") {
          return {
            ...state,
            inputUsernameStatus: "error",
            inputPasswordStatus: undefined,
            errorStatusUnauthorized: false
          };
        } else if (
          (!state.inputPassword || state.inputPassword == "") &&
          state.inputUsername &&
          state.inputUsername != ""
        ) {
          return {
            ...state,
            inputUsernameStatus: undefined,
            inputPasswordStatus: "error",
            errorStatusUnauthorized: false
          };
        } else {
          return {
            ...state,
            inputUsernameStatus: "error",
            inputPasswordStatus: "error",
            errorStatusUnauthorized: false
          };
        }
      }
  }
};

type NativeLoginState = {
  setupSecret?: string;
  inputUsername: string;
  inputPassword: string;
  inputUsernameStatus?: "error" | undefined;
  inputPasswordStatus?: "error" | undefined;
  isRequestingLogin: boolean;
  errorStatusUnauthorized: boolean;
  unhandledLoginError?: NetworkError;
};

type Action = {
  type: "setupsecret" | "setusername" | "setpassword" | "submit" | "loginfailed" | "resetform" | "unhandledloginfail";

  payload?: string | boolean | NetworkError;
};

type LoginSetup = {
  loginsecret: string;
};

type SetupSecret = {
  setupsecret: string;
};
