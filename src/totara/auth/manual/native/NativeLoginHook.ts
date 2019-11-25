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
import { DEVICE_REGISTRATION } from "@totara/lib/Constant";

import { asyncEffectWrapper } from "../../AuthRoutines";

const initialState = {
  setupSecret: undefined,
  inputUsername: "",
  inputPassword: "",
  inputUsernameStatus: undefined,
  inputPasswordStatus: undefined,
  isRequestingLogin: false,
  errorStatusUnauthorized: false,
  unhandleLoginError: undefined
};

export const useNativeLogin = (
  fetchData: <T>(input: RequestInfo, init?: RequestInit) => Promise<T>
) => ({
  onSetupSecretSuccess,
  onSetupSecretFailure,
  siteUrl,
  onSetupSecretCancel
}: Props): OutProps => {
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
    dispatch({ type: "resetform"});
  };

  const fetchLogin = () => fetchData<LoginSetup>(
    config.nativeLoginSetupUri(siteUrl),
    {
      method: "GET",
      headers: { [DEVICE_REGISTRATION]: config.userAgent }
    }).then(loginSetup => {
    // eslint-disable-next-line no-undef
    return fetchData<SetupSecret>(
      config.nativeLoginUri(siteUrl),
      {
        method: "POST",
        body: JSON.stringify({
          loginsecret: loginSetup.loginsecret,
          username: nativeLoginState.inputUsername,
          password: nativeLoginState.inputPassword
        }),
        headers: { [DEVICE_REGISTRATION]: config.userAgent }
      });

  });

  useEffect(
    asyncEffectWrapper(
      fetchLogin,
      () => nativeLoginState.isRequestingLogin,
      (setupSecret) => dispatch({ type: "setupsecret", payload: setupSecret.setupsecret }),
      (error) => {
        if (error.message === "401") {
          dispatch({ type: "loginfailed"});
        } else {
          dispatch({ type: "unhandledloginfail", payload: error});
        }
      }
    ), [nativeLoginState.isRequestingLogin]);
    
  if ( nativeLoginState.unhandleLoginError ) {
    onSetupSecretFailure(nativeLoginState.unhandleLoginError);
  }

  if ( nativeLoginState.setupSecret ) {
    Log.debug("Setup Secret", nativeLoginState.setupSecret);
    onSetupSecretSuccess(nativeLoginState.setupSecret);
  }

  return {
    nativeLoginState,
    onSetupSecretCancel,
    siteUrl,
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
export const nativeReducer = (
  state: NativeLoginState = initialState,
  action: Action
): NativeLoginState => {
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
          unhandleLoginError: action.payload as Error
        };
    case "submit":
      if (
        state.inputUsername &&
        state.inputUsername != "" &&
        state.inputPassword &&
        state.inputPassword != ""
      ) {
        return {
          ...state,
          isRequestingLogin: true,
          inputUsernameStatus: undefined,
          inputPasswordStatus: undefined,
          errorStatusUnauthorized: false,
          unhandleLoginError: undefined
        };
      } else {
        if (
          (!state.inputUsername || state.inputUsername == "") &&
          (state.inputPassword && state.inputPassword != "")
        ) {
          return {
            ...state,
            inputUsernameStatus: "error",
            inputPasswordStatus: undefined,
            errorStatusUnauthorized: false
          };
        } else if (
          (!state.inputPassword || state.inputPassword == "") &&
          (state.inputUsername && state.inputUsername != "")
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
  unhandleLoginError?: Error
};

type Action = {
  type:
    | "setupsecret"
    | "setusername"
    | "setpassword"
    | "submit"
    | "loginfailed"
    | "resetform"
    | "unhandledloginfail";

  payload?: string | boolean | Error;
};

type LoginSetup = {
  loginsecret: string;
};

type SetupSecret = {
  setupsecret: string;
};

type Props = {
  onSetupSecretSuccess: (data: string) => void;
  onSetupSecretFailure: (error: Error) => void;
  siteUrl: string;
  onSetupSecretCancel: () => void;
};

export type OutProps = {
  nativeLoginState: NativeLoginState;
  onSetupSecretCancel: () => void;
  siteUrl: string;
  onClickEnter: () => void;
  inputUsernameWithShowError: (text: string) => void;
  inputPasswordWithShowError: (text: string) => void;
  onFocusInput: () => void;
};
