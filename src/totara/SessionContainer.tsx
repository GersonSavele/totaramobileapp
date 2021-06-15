
/**
 * This file is part of Totara Enterprise.
 *
 * Copyright (C) 2021 onwards Totara Learning Solutions LTD
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

import React from "react";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { useSession } from "./core";
import { TotaraTheme } from "./theme/Theme";
import SiteUrl from "./auth/manual/SiteUrl";
import NativeLogin from "./auth/manual/native/NativeLogin";
import RootContainer from "./RootContainer";
import { cardModalOptions } from "./lib/navigation";
import { ApolloProvider } from "@apollo/react-hooks";
import { useState } from "react";
import { Loading } from "./components";
import { useEffect } from "react";
import { createApolloClient } from "./core/AuthRoutines";
import { ApolloClient, NormalizedCacheObject } from "apollo-boost";

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: TotaraTheme.viewContainer.backgroundColor!
  }
};

const ApolloWrapper = () => {
  const { session } = useSession();
  const { apiKey, host } = session;

  const [apolloClient, setApolloClient] = useState<ApolloClient<NormalizedCacheObject>>();


  const logOut = async (localOnly: boolean = false) => {
    //console.warn('logout');
  }

  useEffect(() => {
    if (apiKey) {
      const apc = createApolloClient(
        apiKey,
        host!,
        logOut
      );
      setApolloClient(apc)
    }

  }, [apiKey]);

  console.debug(apiKey, host);

  if (!apolloClient)
    return <Loading text={"Waiting for apolloclient"} />

  return <ApolloProvider client={apolloClient!}>
    <RootContainer />
  </ApolloProvider>
}

const Stack = createStackNavigator()

const SessionContainer = () => {
  const { session } = useSession();
  const { host, apiKey } = session;

  return <NavigationContainer theme={navigationTheme}>
    <Stack.Navigator mode={"modal"} screenOptions={{
      headerShown: false
    }} >
      {host && apiKey && <Stack.Screen name="RootContainer" component={ApolloWrapper} />}
      <Stack.Screen name="SiteUrl" component={SiteUrl} />
      <Stack.Screen name="NativeLogin" component={NativeLogin} options={cardModalOptions} />
    </Stack.Navigator>
  </NavigationContainer>
}

export default SessionContainer;