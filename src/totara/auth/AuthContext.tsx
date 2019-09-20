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

import React, { ReactNode, useEffect, useReducer, useRef } from "react";
import { Text } from "react-native";
import { ApolloClient } from "apollo-client";
import { ApolloProvider } from "react-apollo";
import { ApolloLink } from "apollo-link";
import { RetryLink } from "apollo-link-retry";
import { HttpLink } from "apollo-link-http";
import { onError, ErrorResponse } from "apollo-link-error";
import { gql } from "apollo-boost";
import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import { setContext } from "apollo-link-context";
import SplashScreen from "react-native-splash-screen";
import { AsyncStorageStatic } from "@react-native-community/async-storage";

import { config, Log } from "@totara/lib";
import { X_API_KEY } from "@totara/lib/Constant";


import {
  getAndStoreApiKey,
  deviceCleanup,
  bootstrap
} from "./AuthRoutines";
import AppLinkFlow from "./app-link";
import ManualFlow from "./manual/ManualFlow";

const AuthContext = React.createContext<State2>({
  isAuthenticated: false,
  logOut: () => {
    return Promise.resolve();
  }
});

const AuthConsumer = AuthContext.Consumer;

/**
 * AuthProvider will provide the auth states and data needed for any components inside
 * the scope.  Auth states, methods should be use with AuthConsumer
 *
 * This will also provide the switching from a component used to authenticate a user,
 * Once authenticated it would load the children with an ApolloProvider with a authenticated
 * client.
 *
 * @example
 *
 * <AuthProvider>
 *   <ElementsThatWillHaveAuthenticatedUserAndGraphQLApi/>
 * </AuthProvider>
 *
 */

const AuthProvider = (props: Props) => {

  const {
    authContextState,
    onLoginSuccess,
    onLoginFailure,
    logOut,
    apolloClient
  } = useAuthContext(props);

  const providerValue = {
    isAuthenticated: authContextState.isAuthenticated,
    logOut: logOut
  };

  return (
    <AuthContext.Provider value={providerValue}>
      <AppLinkFlow
        onLoginFailure={onLoginFailure}
        onLoginSuccess={onLoginSuccess}
      />
      {authContextState.isLoading ? (
        <Text>TODO replace with error feedback screen see MOB-117</Text>
      ) : apolloClient ? (
        <ApolloProvider client={apolloClient}>
          {props.children}
        </ApolloProvider>
      ) : (
        (authContextState.authStep !== AuthStep.setupSecretInit) && <ManualFlow
          onLoginSuccess={onLoginSuccess}
          onLoginFailure={onLoginFailure}
        />
      )}
    </AuthContext.Provider>
  );
};

const useAuthContext = ({asyncStorage}: Props) => {

  const [authContextState, dispatch] = useReducer(authContextReducer,
    {
      setup: undefined,
      isLoading: true,
      isAuthenticated: false,
      authStep: AuthStep.loading
    });

  /**
   * call logOut to clean any state of auth
   */
  const logOut = async (localOnly: boolean = false) => { // TODO MOB-231 should remove this localOnly flag, a bit of a hack
    Log.debug("logging out");
    const mutationPromise = () => apolloClient.current && !localOnly
      ? apolloClient.current.mutate({
        mutation: deleteDevice
      })
      : Promise.resolve({ data: { delete_device: true } });

    const clearStoragePromise = () => asyncStorage.clear();

    return deviceCleanup(
      mutationPromise,
      clearStoragePromise
    ).then( () => dispatch({type: "logOutSuccess"}));
  };

  // instance of apollo client this is valid as per faq
  // https://reactjs.org/docs/hooks-faq.html#is-there-something-like-instance-variables
  const apolloClient = useRef<ApolloClient<NormalizedCacheObject> | null>(null);

  if (
    authContextState.setup &&
    authContextState.setup.apiKey &&
    authContextState.isAuthenticated &&
    apolloClient.current === null
  ) {
    Log.debug("creating apolloClient");
    apolloClient.current = createApolloClient(
      authContextState.setup.apiKey,
      config.mobileApi + "/graphql",
      logOut
    );
  } else if (apolloClient.current) {
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

    dispatch({type: "loginInit", payload: setupSecret});
  };

  /**
   * When a failure of login happens call this
   *
   * @param error
   */
  const onLoginFailure = async (error: Error) => {
    Log.error("login failure", error);

    // TODO add a dispatch here for failure state
  };


  /**
   * turn off the splash screen and bootstrap the provider
   */
  useEffect(() => {
    const doBootStrap = () => {
      Log.debug("doBootStrap", authContextState);
      SplashScreen.hide();
      bootstrap(asyncStorage.getItem)
        .then( setup => {
          dispatch({ type: "bootstrapSuccess", payload: setup})
        })
    };

    if (authContextState.authStep === AuthStep.loading) doBootStrap();
  }, [authContextState.authStep]);


  useEffect(() => {
    const doGetandStoreApiKey = () => {
      Log.debug("doGetandStoreApiKey", authContextState);
      if (authContextState.setupSecret)
        getAndStoreApiKey(
          authContextState.setupSecret,
          // fetch is in global space
          // eslint-disable-next-line no-undef
          fetch,
          asyncStorage.setItem
        ).then( setup => {
          dispatch({type: "loginSuccess", payload: setup})
        });
    };

    if (authContextState.authStep === AuthStep.setupSecretInit) doGetandStoreApiKey()

    }, [authContextState.authStep]
  );

  return {
    authContextState,
    onLoginSuccess,
    onLoginFailure,
    logOut,
    apolloClient: apolloClient.current
  }
};

const authContextReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "loginInit": {
      if (action.payload && "secret" in action.payload)
        return {
          ...state,
          setupSecret: action.payload,
          authStep: AuthStep.setupSecretInit
        };
      else throw new Error(`unexpected payload in action ${action}`)
    }

    case "loginSuccess": {
      if (action.payload && "apiKey" in action.payload)
        return {
          ...state,
          setup: action.payload,
          isAuthenticated: true,
          authStep: AuthStep.setupDone
        };
      else throw new Error(`unexpected payload in action ${action}`)
    }

    case "bootstrapSuccess": {
      if (action.payload && "apiKey" in action.payload)
        return {
          ...state,
          setup: action.payload,
          isAuthenticated: true,
          isLoading: false,
        };
      else
        return {
          ...state,
          isAuthenticated: false,
          isLoading: false,
        }
    }

    case "logOutSuccess":
      return {
        ...state,
        setup: undefined,
        isAuthenticated: false,
        authStep: AuthStep.bootstrapDone
      }
  }
};


/**
 * create an authenticated Apollo client that has the right credentials to the api
 */
const createApolloClient = (apiKey: string, uri: string, logOut: (localOnly: boolean) => Promise<void>) => {
  const authLink = setContext((_, { headers }) => ({
    headers: {
      ...headers,
      [X_API_KEY]: apiKey
    }
  }));

  const httpLink = new HttpLink({ uri: uri });

  const logoutLink = onError(( {response} : ErrorResponse) => {
    Log.warn("Apollo client error", response);
    if (response.errors[0].extensions.exception.networkError.statusCode === 401) { // TODO MOB-231 this is not the documented way to get status code fix this
      logOut(true);
    }
  });

  const link = ApolloLink.from([
    logoutLink,
    new RetryLink({ attempts: { max: 10 } }),
    authLink,
    httpLink,

  ]);

  return new ApolloClient({
    link: link,
    cache: new InMemoryCache()
  });

};


type Action = {
  type: "logOutSuccess" | "loginInit" | "loginSuccess" | "bootstrapSuccess";
  payload?: Setup | SetupSecret;
};

export const deleteDevice = gql`
  mutation totara_mobile_delete_device {
    delete_device: totara_mobile_delete_device
  }
`;

export type Props = {
  children: ReactNode;
  asyncStorage: AsyncStorageStatic;
};

enum AuthStep {
  loading,
  bootstrapDone,
  setupSecretInit,
  setupDone,
}

export type State = {
  isLoading: boolean;
  isAuthenticated: boolean;
  setup?: Setup;
  setupSecret?: SetupSecret;
  authStep: AuthStep
};

export type State2 = {
  isAuthenticated: boolean;
  logOut: () => Promise<void>;
};


export type Setup = {
  apiKey: string;
  host: string;
};

export interface SetupSecret {
  secret: string;
  uri: string;
}

export { AuthProvider, AuthConsumer };
