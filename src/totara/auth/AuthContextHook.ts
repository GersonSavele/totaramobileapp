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
 */
import { useEffect, useReducer, useRef } from "react";
import { ApolloClient } from "apollo-client";
import { gql } from "apollo-boost";
import { NormalizedCacheObject } from "apollo-cache-inmemory";
import SplashScreen from "react-native-splash-screen";

import { config, Log } from "@totara/lib";

import { Setup, SetupSecret } from "./AuthContext";

/**
 * Custom react hook for AuthContext.
 *
 * Manages the state of auth in authContextState
 *
 * @param bootstrap
 * @param getAndStoreApiKey
 * @param deviceCleanup
 * @param createApolloClient
 *
 * @returns {
 *  authContextState, key state of auth
 *  onLoginSuccess, call back for successful login
 *  onLoginFailure, call back for a failed login
 *  logOut, logout the current user
 *  apolloClient an authenticated apollo client
 * }
 */
export const useAuthContext = (
  bootstrap: () => Promise<Setup | undefined>,
  getAndStoreApiKey: (setupSecret: SetupSecret) => Promise<Setup>,
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

  // create or stop apolloClient depending on the state and if existing apolloClient has been setup
  if (
    authContextState.setup &&
    authContextState.setup.apiKey &&
    authContextState.isAuthenticated &&
    apolloClient.current === null
  ) {
    Log.debug("creating apolloClient");
    apolloClient.current = createApolloClient(
      authContextState.setup.apiKey,
      config.mobileApi.uri,
      logOut
    );
  } else if (apolloClient.current && !authContextState.isAuthenticated) {
    Log.debug("stopping apolloClient");
    // TODO MOB-231 review this, possibly better implementation
    apolloClient.current.stop();
    apolloClient.current = null;
  }

  /**
   * When a successful login is achieved call this with setupSecret it would start the login sequence and right authenticated state
   *
   * Can be used on either a AuthComponent react component or a promise chain
   *
   * @param setupSecret
   */
  const onLoginSuccess = async (setupSecret: SetupSecret) => {
    if (authContextState.isAuthenticated) {
      await logOut();
    }

    dispatch({ type: "register", payload: setupSecret });
  };

  /**
   * When a failure of login happens call this
   *
   * @param error
   */
  const onLoginFailure = async (error: Error) => {
    Log.error("login failure, bringing back to initial loading state", error);

    dispatch({ type: "reload" });
  };

  /**
   * turn off the splash screen and bootstrap the provider
   */
  useEffect(() => {
    const doBootStrap = () => {
      Log.debug("doBootStrap", authContextState);
      if (SplashScreen) SplashScreen.hide();
      bootstrap().then(setup => {
        dispatch({ type: "bootstrap", payload: setup });
      });
    };

    if (authContextState.authStep === AuthStep.loading) doBootStrap();
  }, [authContextState.authStep]);

  /**
   * When setupSecret has been initialiazed, perform a side affect to get the apikey
   */
  useEffect(() => {
    const doGetandStoreApiKey = () => {
      Log.debug("doGetandStoreApiKey", authContextState);
      if (authContextState.setupSecret)
        getAndStoreApiKey(authContextState.setupSecret).then(setup => {
          dispatch({ type: "setup", payload: setup });
        });
    };

    if (authContextState.authStep === AuthStep.setupSecretInit)
      doGetandStoreApiKey();
  }, [authContextState.authStep]);

  return {
    authContextState,
    onLoginSuccess,
    onLoginFailure,
    logOut,
    apolloClient: apolloClient.current
  };
};

const authContextReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "register": {
      if (action.payload && "secret" in action.payload)
        return {
          ...state,
          setupSecret: action.payload,
          authStep: AuthStep.setupSecretInit
        };
      else throw new Error(`unexpected payload in action ${action}`);
    }

    case "setup": {
      if (action.payload && "apiKey" in action.payload)
        return {
          ...state,
          setup: action.payload,
          isAuthenticated: true,
          authStep: AuthStep.setupDone
        };
      else throw new Error(`unexpected payload in action ${action}`);
    }

    case "bootstrap": {
      if (action.payload && "apiKey" in action.payload)
        return {
          ...state,
          setup: action.payload,
          isAuthenticated: true,
          isLoading: false,
          authStep: AuthStep.bootstrapDone
        };
      else
        return {
          ...state,
          isAuthenticated: false,
          isLoading: false,
          authStep: AuthStep.bootstrapDone
        };
    }

    case "deRegister":
      return {
        ...state,
        setup: undefined,
        isAuthenticated: false,
        isLoading: false,
        authStep: AuthStep.bootstrapDone
      };

    case "reload":
      return initialState;
  }
};

type Action = {
  type: "register" | "setup" | "bootstrap" | "deRegister" | "reload";
  payload?: Setup | SetupSecret;
};

export const deleteDevice = gql`
  mutation totara_mobile_delete_device {
    delete_device: totara_mobile_delete_device
  }
`;

type Props = {
  initialState: State;
};

export enum AuthStep {
  loading,
  bootstrapDone,
  setupSecretInit,
  setupDone
}

type State = {
  isLoading: boolean;
  isAuthenticated: boolean;
  setup?: Setup;
  setupSecret?: SetupSecret;
  authStep: AuthStep;
};

export const initialState: State = {
  setup: undefined,
  setupSecret: undefined,
  isLoading: true,
  isAuthenticated: false,
  authStep: AuthStep.loading
};
