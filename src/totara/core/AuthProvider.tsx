/**
 * This file is part of Totara Enterprise.
 *
 * Copyright (C) 2019 onwards Totara Learning Solutions LTD
 *
 * Totara Enterprise is provided only to Totara Learning Solutions
 * LTD’s customers and partners, pursuant to the terms and
 * conditions of a separate agreement with Totara Learning
 * Solutions LTD or its affiliate.
 *
 * If you do not have an agreement with Totara Learning Solutions
 * LTD, you may not access, use, modify, or distribute this software.
 * Please contact [sales@totaralearning.com] for more information.
 */

import React, { ReactNode } from "react";
import { AsyncStorageStatic } from "@react-native-community/async-storage";
import { ApolloProvider } from "@apollo/client";

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

/** @deprecated */
export const AuthProvider = ({ asyncStorage, children }: Props) => {
  const auth = useAuth(
    bootstrap(asyncStorage),
    // get fetch from global namespace
    // eslint-disable-next-line no-undef
    registerDevice(fetchData(fetch), asyncStorage),
    deviceCleanup(asyncStorage),
    createApolloClient
  )({ initialState: initialState });

  return (
    <AuthContext.Provider value={auth}>
      {auth.apolloClient ? <ApolloProvider client={auth.apolloClient}>{children}</ApolloProvider> : children}
    </AuthContext.Provider>
  );
};

type Props = {
  children: ReactNode;
  asyncStorage: AsyncStorageStatic;
};
