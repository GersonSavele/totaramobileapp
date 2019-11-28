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


import React, { ReactNode } from "react";
import { AsyncStorageStatic } from "@react-native-community/async-storage";

import { AuthContext } from "./AuthContext";
import { useAuth, initialState } from "./AuthHook";
import { registerDevice, deviceCleanup, bootstrap, createApolloClient, fetchData } from "./AuthRoutines";


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
export const AuthProvider = ( {asyncStorage, children}: Props) => {

  const {
    authContextState,
    onLoginSuccess,
    onLoginFailure,
    logOut,
    apolloClient
    // get fetch from global namespace
    // eslint-disable-next-line no-undef
  } = useAuth(bootstrap(asyncStorage), registerDevice(fetchData(fetch), asyncStorage), deviceCleanup(asyncStorage), createApolloClient)({initialState: initialState });

  const providerValue = {
    isAuthenticated: authContextState.isAuthenticated,
    appState: authContextState.appState,
    authContextState: authContextState,
    logOut: logOut,
    onLoginSuccess: onLoginSuccess,
    onLoginFailure: onLoginFailure,
    apolloClient: apolloClient
  };

  return (
    <AuthContext.Provider value={providerValue}>
      {children}
    </AuthContext.Provider>
  );
};


type Props = {
  children: ReactNode;
  asyncStorage: AsyncStorageStatic;
};
