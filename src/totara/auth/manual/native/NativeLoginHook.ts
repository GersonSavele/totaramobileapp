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

import React, { useReducer, useEffect } from "react";

import { config, Log } from "@totara/lib";
import { DEVICE_REGISTRATION } from "@totara/lib/Constant";

const initialState = {
  setupSecret: undefined,
  inputUsername: "",
  inputPassword: "",
  inputUsernameStatus: undefined,
  inputPasswordStatus: undefined,
  isRequestingLogin: false,
  errorStatusUnauthorized: false
};

export const useNativeLogin = ({
  onSetupSecretSuccess,
  siteUrl,
  onBack
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

  useEffect(() => {
    let didCancel = false;
    if (nativeLoginState.isRequestingLogin) {
      // eslint-disable-next-line no-undef
      fetchLoginSecret(fetch)(didCancel, siteUrl)
        .then(loginsecret => (
          //  eslint-disable-next-line no-undef
          fetchLogin(fetch)(
            dispatch,
            loginsecret,
            nativeLoginState.inputUsername,
            nativeLoginState.inputPassword,
            siteUrl
          )
        ))
        .then(setupsecret => {
          if(setupsecret)
            dispatch({ type: "setupsecret", payload: setupsecret });
          else
            dispatch({ type: "loginfailed"});
        })
        .catch(error => {
          Log.debug("Error fetchLoginSecret:", error);
          if ((error as Error).message === "401") {
            dispatch({ type: "loginfailed"});
          } else {
            throw error;
          }
        })
    }
    return () => {
      didCancel = true; // need to create a lock for async stuff
    };
  }, [nativeLoginState.isRequestingLogin]);

  useEffect(() => {
    if ( nativeLoginState.setupSecret ) {
      Log.debug("Setup Secret", nativeLoginState.setupSecret);
      onSetupSecretSuccess(String(nativeLoginState.setupSecret));
    }
  }, [nativeLoginState.setupSecret]);

  return {
    nativeLoginState,
    onBack,
    siteUrl,
    onClickEnter,
    inputUsernameWithShowError,
    inputPasswordWithShowError
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
          inputPasswordStatus: undefined
        };
      } else {
        if (
          (!state.inputUsername || state.inputUsername == "") &&
          (state.inputPassword && state.inputPassword != "")
        ) {
          return {
            ...state,
            inputUsernameStatus: "error",
            inputPasswordStatus: undefined
          };
        } else if (
          (!state.inputPassword || state.inputPassword == "") &&
          (state.inputUsername && state.inputUsername != "")
        ) {
          return {
            ...state,
            inputUsernameStatus: undefined,
            inputPasswordStatus: "error"
          };
        } else {
          return {
            ...state,
            inputUsernameStatus: "error",
            inputPasswordStatus: "error"
          };
        }
      }
    default:
      return state;
  }
};

/**@A
 * @class Fetch the login secret key from the server, This method use for get random secret value from server before login
 */

export const fetchLoginSecret = (
  fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>
) => async (didCancel: boolean, siteUrl:string) => {
  const nativeLoginSetupUri = config.nativeLoginSetupUri(siteUrl);
  const options = {
    method: "GET",
    headers: { [DEVICE_REGISTRATION]: config.userAgent }
  };
  const loginSecretData = await fetch(nativeLoginSetupUri, options)
    .then(response => {
      Log.debug("response", response);
      if (response.status === 200) {
        return (response.json() as unknown) as LoginSecret;
      } else {
        throw new Error(response.status.toString());
      }
    });
    
  if (!didCancel && loginSecretData) {
    return loginSecretData.data.loginsecret;
  } else {
    Log.warn("Did not dispatch loginSetup:");
    return undefined;
  }
};

/**
 * @class fetch the setup secret value from server using those value (loginsecret,username,password)
 */

export const fetchLogin = (
  fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>
) => async (
  dispatch: React.Dispatch<Action>,
  loginsecret: string | undefined,
  username: string,
  password: string,
  siteUrl:string
) => {
  const nativeLoginUri = config.nativeLoginUri(siteUrl);
  const options = {
    method: "POST",
    body: JSON.stringify({
      loginsecret: loginsecret,
      username: username,
      password: password
    }),
    headers: { [DEVICE_REGISTRATION]: config.userAgent }
  };

  const login = await fetch(nativeLoginUri, options)
    .then(response => {
      if (response.status === 200) {
        return (response.json() as unknown) as Login;
      } else {
        throw new Error(response.status.toString());
      }
    });

  if (login && login.data.setupsecret != undefined) {
    return login.data.setupsecret;
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
};

type Action = {
  type:
    | "setupsecret"
    | "setusername"
    | "setpassword"
    | "submit"
    | "loginfailed";

  payload?: string | boolean;
};

type LoginSecret = {
  data: {
    loginsecret: string;
  };
};

type Login = {
  data: {
    setupsecret: string;
  };
};

type Props = {
  onSetupSecretSuccess: (data: string) => void;
  siteUrl: string;
  onBack: () => void;
};

export type OutProps = {
  nativeLoginState: NativeLoginState;
  onBack: () => void;
  siteUrl: string;
  onClickEnter: () => void;
  inputUsernameWithShowError: (text: string) => void;
  inputPasswordWithShowError: (text: string) => void;
};
