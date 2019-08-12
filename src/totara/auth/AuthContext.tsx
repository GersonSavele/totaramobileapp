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

import React, { ReactNode } from "react";
import { Text } from "react-native";
import { ApolloClient } from "apollo-client";
import { ApolloProvider } from "react-apollo";
import { ApolloLink } from 'apollo-link';
import { RetryLink } from 'apollo-link-retry';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from "apollo-cache-inmemory";
import { setContext } from "apollo-link-context";
import SplashScreen from "react-native-splash-screen";
import AsyncStorage from "@react-native-community/async-storage";

import { config, Log } from "@totara/lib";
import WebLogin from "./web-login";

import { X_API_KEY } from "@totara/lib/Constant";
import AppLinkLogin from "./app-link-login";

const AuthContext = React.createContext<State>(
  {
    onLoginSuccess: () => { return Promise.resolve() },
    setup: undefined,
    isLoading: true,
    logOut: () => { return Promise.resolve() }
  }
);

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
class AuthProvider extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      onLoginSuccess: this.onLoginSuccess,
      setup: undefined,
      logOut: this.logOut,
      isLoading: true
    };

    this.bootstrap();
  }

  /**
   * bootstrap would initialize AuthProvider is the right state
   */
  bootstrap = async () => {
    SplashScreen.hide();

    const [apiKey, host] = await Promise.all([AsyncStorage.getItem('apiKey'), AsyncStorage.getItem('host')]);

    if (apiKey !== null && host !== null) {
      this.setState({
        setup: {
          apiKey: apiKey,
          host: host
        },
        isLoading: false
      });
    } else {
      this.setState({
        isLoading: false
      });

    }

    Log.info("state", this.state);
  };

  /**
   * When a successful login is achieved call this with setupSecret it would start the login sequence and right authenticated state
   *
   * Can be used on either a AuthComponent react component or a promise chain
   *
   * @param setupSecret
   */
  onLoginSuccess = async (setupSecret: SetupSecret) => {
    await this.logOut().then(()=> {
      this.getAndStoreApiKey(setupSecret);
    });
  };

  /**
   * When a failure of login happens call this
   *
   * @param error
   */
  onLoginFailure = async (error: Error) => {
    Log.error("login failure", error);
  };

  /**
   * call logOut to clean any state of auth
   */
  logOut = async () => {
    await AsyncStorage.clear().catch((error) => {
      if (error.message.startsWith("Failed to delete storage directory")) {
        Log.warn("Fail to clear Async storage, this expected if user is sign out ", error);
      } else {
        Log.error("Fail to clear Async storage ", error);
      }
    });
    this.setState({
      setup: undefined,
    });
  };

  /**
   * create an authenticated Apollo client that has the right credentials to the api
   */
  private createApolloClient = (apiKey: string, uri: string) => {

    const authLink = setContext((_, { headers }) => (
      {
        headers: {
          ...headers,
          [X_API_KEY]: apiKey,
        }
      }));

    const link = ApolloLink.from([
      new RetryLink({ attempts: { max: 10 } }),
      authLink,
      new HttpLink({ uri: uri })
    ]);

    return new ApolloClient({
      link: link,
      cache: new InMemoryCache()
    });
  };

  /**
   * using the setup secret (a temp key), retrieve the api key (a long term key) for the api
   *
   * @param setupSecret
   */
  private getAndStoreApiKey = async (setupSecret: SetupSecret) => {
    try {
      // fetch is in global space
      // eslint-disable-next-line no-undef
      const apiKey = await fetch(config.deviceRegisterUri(setupSecret.uri), {
        method: "POST",
        body: JSON.stringify({
          setupsecret: setupSecret.secret
        })
      }).then((response) => {
        if (response.status === 200) return response.json();
        throw new Error(`Server Error: ${response.status}`);
      }).then((json) => json.data.apikey);

      await AsyncStorage.setItem("apiKey", apiKey);
      await AsyncStorage.setItem("host", setupSecret.uri);

      this.setState({
        setup: {
          apiKey: apiKey,
          host: setupSecret.uri
        }
      });

      return apiKey;
    } catch (error) {
      Log.error("unable to get apiKey", error);

      return undefined;
    }
  };

  render() {
    return (
      <AuthContext.Provider value={this.state}>
        <AppLinkLogin onLoginFailure={this.onLoginFailure} onLoginSuccess={this.onLoginSuccess} />
        {
          (this.state.isLoading)
            ? <Text>auth loading, this text should not be seen unless bootstrap failed</Text>
            : (this.state.setup && this.state.setup.apiKey)
              ? <ApolloProvider client={this.createApolloClient(this.state.setup.apiKey, config.mobileApi + "/graphql")}>
                {this.props.children}
              </ApolloProvider>
              : <WebLogin onLoginSuccess={this.onLoginSuccess} onLoginFailure={this.onLoginFailure} />
        }
      </AuthContext.Provider>
    )
  }
}


type Props = {
  children: ReactNode
}

type State = {
  isLoading: boolean,
  setup?: Setup,
  onLoginSuccess: (setupSecret: SetupSecret) => Promise<void>
  logOut: () => Promise<void>
}

type Setup = {
  apiKey: string,
  host: string
}

export interface SetupSecret {
  secret: string
  uri: string
}


export { AuthProvider, AuthConsumer }