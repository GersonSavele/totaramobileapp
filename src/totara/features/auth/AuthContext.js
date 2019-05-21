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
import { AsyncStorage, Text } from "react-native";
import { ApolloClient } from "apollo-client";
import { ApolloProvider } from "react-apollo";
import { ApolloLink } from 'apollo-link';
import { RetryLink } from 'apollo-link-retry';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from "apollo-cache-inmemory";
import { setContext } from "apollo-link-context";
import SplashScreen from "react-native-splash-screen";
import PropTypes from 'prop-types';

import { config } from "@totara/lib";

import AuthLogin from "./AuthLogin";


const AuthContext = React.createContext(
  {
    setSetupSecret: () => { },
    setupSecret: undefined,
    setApiKey: () => { },
    apiKey: undefined,
    logOut: () => { }
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
class AuthProvider extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      setSetupSecret: this.setSetupSecret,
      setupSecret: undefined,
      setApiKey: this.setApiKey,
      apiKey: undefined,
      logOut: this.logOut,
      isLoading: true
    };

    this.bootstrap();
  }

  bootstrap = async () => {
    const apiKey = await AsyncStorage.getItem('apiKey');

    SplashScreen.hide();

    this.setState({
      apiKey: apiKey,
      isLoading: false
    });
    console.log("state", this.state);
    // TODO add some logging and error handling, important routine
  };

  setSetupSecret = async (setupSecret) => {
    await this.getAndStoreApiKey(setupSecret);
  };

  logOut = async () => {
    await AsyncStorage.clear();
    this.setState({
      apiKey: undefined
    });
  };

  createApolloClient = (apiKey, uri) => {

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

  getAndStoreApiKey = async (setupSecret) => {
    try {
      const apiKey = await fetch(config.deviceRegisterUri, {
        method: "POST",
        body: JSON.stringify({
          setupsecret: setupSecret
        })
      }).then((response) => {
        if (response.status === 200) return response.json();
        throw new Error(`Server Error: ${response.status}`);
      }).then((json) => json.data.apikey);

      await AsyncStorage.setItem("apiKey", apiKey);

      this.setState({
        apiKey: apiKey
      });

      return apiKey;
    } catch (error) {
      console.error(error);
      // TODO add some logging and error handling, important routine

      return undefined;
    }
  };

  render() {
    return (
      <AuthContext.Provider value={this.state}>
        {
          (this.state.isLoading)
            ? <Text>auth loading, this text should not be seen unless bootstrap failed</Text>
            : (this.state.apiKey)
              ? <ApolloProvider client={this.createApolloClient(this.state.apiKey, config.mobileApi + "/graphql")}>
                {this.props.children}
              </ApolloProvider>
              : <AuthLogin setSetupSecret={this.setSetupSecret} />
        }
      </AuthContext.Provider>
    )
  }
}



export { AuthProvider, AuthConsumer }