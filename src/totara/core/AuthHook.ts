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
import { useEffect, useReducer, useRef } from "react";
import { ApolloClient } from "apollo-client";
import { gql } from "apollo-boost";
import { NormalizedCacheObject } from "apollo-cache-inmemory";
import SplashScreen from "react-native-splash-screen";

import { config, Log } from "@totara/lib";
import { AppState, SiteInfo } from "@totara/types";

/**
 * Custom react hook and its primary role is managing the auth state which is in authContextState.
 * Provides state lift functions to change state
 *
 * Requires external dep routines
 *
 * @param bootstrap
 * @param registerDevice
 * @param deviceCleanup
 * @param createApolloClient
 *
 * @returns {
 *  authContextState - key state of auth
 *  onLoginSuccess - on a successful login, pass setup parameter and it would do device registration process
 *  onLoginFailure - call this function if an error can't be handled locally
 *  logOut - logout the current user and start clean up process locally and on the server
 *  apolloClient - an authenticated apollo client
 * }
 */
export const useAuth = (
  bootstrap: () => Promise<AppState | undefined>,
  registerDevice: (setup: Setup) => Promise<AppState>,
  deviceCleanup: (deviceDelete: () => Promise<any>) => Promise<boolean>,
  createApolloClient: (
    apiKey: string,
    uri: string,
    logOut: (localOnly: boolean) => Promise<void>
  ) => ApolloClient<NormalizedCacheObject>
) => ({ initialState }: Props) => {

  const [authContextState, dispatch] = useReducer(
    authContextReducer,
    initialState
  );

  // instance of apollo client this is valid as per faq
  // https://reactjs.org/docs/hooks-faq.html#is-there-something-like-instance-variables
  const apolloClient = useRef<ApolloClient<NormalizedCacheObject> | null>(null);

  /**
   * call logOut to clean any state of auth
   */
  const logOut = async (localOnly: boolean = false) => {
    // TODO MOB-231 should remove this localOnly flag, a bit of a hack
    Log.debug("logging out");
    const mutationPromise = () =>
      apolloClient.current && !localOnly
        ? apolloClient.current.mutate({
            mutation: deleteDevice
          })
        : Promise.resolve({ data: { delete_device: true } });

    return deviceCleanup(mutationPromise).then(() =>
      dispatch({ type: "deRegister" })
    );
  };

  // create or stop apolloClient depending on the state and if existing apolloClient has been appState
  if (
    authContextState.appState &&
    authContextState.appState.apiKey &&
    authContextState.isAuthenticated &&
    apolloClient.current === null
  ) {
    Log.debug("creating apolloClient");
    apolloClient.current = createApolloClient(
      authContextState.appState.apiKey,
      authContextState.appState.host,
      logOut
    );
  } else if (apolloClient.current && !authContextState.isAuthenticated) {
    Log.debug("stopping apolloClient");
    // TODO MOB-231 review this, possibly better implementation
    apolloClient.current.stop();
    apolloClient.current = null;
  }

  /**
   * When a successful login is achieved call this with setup it would start the login sequence and right authenticated state
   *
   * Can be used on either a AuthComponent react component or a promise chain
   *
   * @param setup
   */
  const onLoginSuccess = async (setup: Setup) => {
    if (authContextState.isAuthenticated) {
      await logOut();
    }

    dispatch({ type: "register", payload: setup });
  };

  /**
   * When a failure of login happens call this
   *
   * @param error
   */
  const onLoginFailure = async (error: Error) => {
    Log.error("login failure, bringing back to initial loading state", error);

    dispatch({ type: "authError" });
  };

  /**
   * turn off the splash screen and bootstrap the provider
   */
  useEffect(() => {
    const doBootStrap = () => {
      Log.debug("doBootStrap", authContextState);
      if (SplashScreen) SplashScreen.hide();
      bootstrap().then(appState => {
        dispatch({ type: "bootstrap", payload: appState });
      });
    };

    if (authContextState.authStep === "loading") doBootStrap();
  }, [authContextState.authStep]);

  /**
   * When setup has been initialiazed, perform a side affect to get the apikey
   */
  useEffect(() => {
    const doRegisterDevice = () => {
      Log.debug("doRegisterDevice", authContextState);
      if (authContextState.setup) {
        registerDevice(authContextState.setup).then(appState => {
          dispatch({ type: "registered", payload: appState });
        }).catch(error => {
            Log.error("error on registering", error);
            dispatch({ type: "authError" });
          }
        )
      }
    };

    if (authContextState.authStep === "setupSecretInit")
      doRegisterDevice();
  }, [authContextState.authStep, authContextState.isAuthenticated]);

  return {
    authContextState,
    onLoginSuccess,
    onLoginFailure,
    logOut,
    apolloClient: apolloClient.current
  };
};

const authContextReducer = (state: AuthContextState, action: Action): AuthContextState => {
  Log.debug("authContextReducer: state", state, "action", action);
  switch (action.type) {
    case "register": {
      if (action.payload && "secret" in action.payload)
        return {
          ...state,
          setup: action.payload,
          authStep: "setupSecretInit"
        };
      else throw new Error(`unexpected payload in action ${action}`);
    }

    case "registered": {
      if (action.payload && "apiKey" in action.payload)
        return {
          ...state,
          appState: action.payload,
          isAuthenticated: true,
          authStep: "setupDone"
        };
      else throw new Error(`unexpected payload in action ${action}`);
    }

    case "bootstrap": {
      if (action.payload && "apiKey" in action.payload)
        return {
          ...state,
          appState: action.payload,
          isAuthenticated: true,
          isLoading: false,
          authStep: "bootstrapDone"
        };
      else
        return {
          ...state,
          isAuthenticated: false,
          isLoading: false,
          authStep: "bootstrapDone"
        };
    }

    case "deRegister":
      return {
        ...state,
        appState: undefined,
        isAuthenticated: false,
        isLoading: false,
        authStep: "bootstrapDone"
      };

    case "authError":
      return {
        ...state,
        setup: undefined,
        appState: undefined,
        isAuthenticated: false,
        isLoading: false,
        authStep: "authError"
      };

    case "reload":
      return initialState;
  }
};

type Action = {
  type: "register" | "registered" | "bootstrap" | "deRegister" | "reload" | "authError";
  payload?: AppState | Setup;
};

export const deleteDevice = gql`
  mutation totara_mobile_delete_device {
    delete_device: totara_mobile_delete_device
  }
`;

type Props = {
  initialState: AuthContextState;
};

export type AuthContextState = {
  isLoading: boolean;
  isAuthenticated: boolean;
  appState?: AppState;
  setup?: Setup;
  authStep:
    | "loading"
    | "bootstrapDone"
    | "setupSecretInit"
    | "setupDone"
    | "authError";
};

export const initialState: AuthContextState = {
  appState: undefined,
  setup: undefined,
  isLoading: true,
  isAuthenticated: false,
  authStep: "loading"
};

export interface Setup {
  secret: string;
  uri: string;
  siteInfo: SiteInfo;
}
