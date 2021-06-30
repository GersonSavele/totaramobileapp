
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

import { useFocusEffect } from "@react-navigation/native";
import { ApolloClient, NormalizedCacheObject } from "apollo-boost";
import React, { useCallback, useEffect, useState } from "react";
import { ApolloProvider } from "react-apollo";
import { Linking } from "react-native";
import { linkingHandler } from "./auth/authUtils";
import SiteUrl from "./auth/manual/SiteUrl";
import { Loading } from "./components";
import { useSession } from "./core";
import { createApolloClient, fetchData, logOut, registerDevice } from "./core/AuthRoutines";
import LocaleResolver from "./locale/LocaleResolver";
import MainContainer from "./MainContainer";
import AsyncStorage from "@react-native-community/async-storage";

const SessionContainer = () => {
  // eslint-disable-next-line no-undef
  const fetchDataWithFetch = fetchData(fetch);

  const { login, session: { host, apiKey, siteInfo } } = useSession();
  const [apolloClient, setApolloClient] = useState<ApolloClient<NormalizedCacheObject>>();

  const onLogout = async () => {
    logOut({ apolloClient });
  }

  useEffect(() => {
    //only init apolloclient if apiKey exists and apolloClient dont
    if (apiKey && !apolloClient) {
      const apc = createApolloClient(
        apiKey,
        host!,
        onLogout
      );
      setApolloClient(apc)
    }
  }, [apiKey, apolloClient]);

  const initialURLHandler = (url) => {
    if (url) {
      linkingHandler(url, ({ secret, uri }) => {
        registerDevice(fetchDataWithFetch, AsyncStorage)({
          uri: uri,
          secret: secret,
          siteInfo: siteInfo
        }).then(res => {
          login({ apiKey: res.apiKey });
        }).catch(ee => {
          console.warn(ee);
        });
      }, () => {
        console.warn('fail');
      })
    }
  }

  useFocusEffect(
    useCallback(() => {
      if (!apiKey) {
        Linking.getInitialURL().then(initialURLHandler);
      }
      else {
        return () => {
          Linking.removeAllListeners("url");
        };
      }
    }, [apiKey])
  );

  if (!host || !apiKey) {
    return <SiteUrl />
  }

  if (!apolloClient)
    return <Loading />

  return <ApolloProvider client={apolloClient!}>
    <LocaleResolver>
      <MainContainer />
    </LocaleResolver>
  </ApolloProvider>
}

export default SessionContainer;