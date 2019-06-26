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

import React, {ReactNode} from "react";
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

import { config } from "@totara/lib";
import WebLogin from "./web-login";


const AuthContext = React.createContext<State>(
  {
    onLoginSuccess: (setupSecret: SetupSecret) => { return Promise.resolve() },
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

  bootstrap = async () => {
    const apiKey = await AsyncStorage.getItem('apiKey');
    const host = await AsyncStorage.getItem('host');

    SplashScreen.hide();

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

    console.log("state", this.state);
    // TODO MOB-65 add some logging and error handling, important routine
  };

  onLoginSuccess = async (setupSecret: SetupSecret) => {
    await this.getAndStoreApiKey(setupSecret);
  };

  onLoginFailure = async (error: Error) => {
    console.error(error);
  };

  logOut = async () => {
    await AsyncStorage.clear();
    this.setState({
      setup: undefined,
    });
  };

  createApolloClient = (apiKey: string, uri: string) => {

    const authLink = setContext((_, { headers }) => (
      {
        headers: {
          ...headers,
          "X-API-KEY": apiKey,
        }
      }));

    const link = ApolloLink.from([
      new RetryLink({ attempts: { max: 10 } }),
      authLink,
      new HttpLink({ uri: uri })
    ]);

    const client = new ApolloClient({
      link: link,
      cache: new InMemoryCache()
    });

    return client;
  };

  getAndStoreApiKey = async (setupSecret: SetupSecret) => {
    try {
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
      console.error(error);
      // TODO MOB-65 add some logging and error handling, important routine

      return undefined;
    }
  };

  render() {
    return (
      <AuthContext.Provider value={this.state}>
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