
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

import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { ApolloProvider, ApolloClient, NormalizedCacheObject, InMemoryCache, defaultDataIdFromObject } from "@apollo/client";
import { Linking } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";

import { linkingHandler } from "./auth/authUtils";
import SiteUrl from "./auth/manual/SiteUrl";
import { Loading } from "./components";
import { useSession } from "./core";
import { createApolloClient, fetchData, logOut, registerDevice } from "./core/AuthRoutines";
import LocaleResolver from "./locale/LocaleResolver";
import MainContainer from "./MainContainer";
import { AsyncStorageWrapper, CachePersistor } from "apollo3-cache-persist";
import { LearningItem } from "./types";


const SessionContainer = () => {
  // eslint-disable-next-line no-undef
  const fetchDataWithFetch = fetchData(fetch);

  const { initSession, session: { host, apiKey, siteInfo } } = useSession();
  const [apolloClient, setApolloClient] = useState<ApolloClient<NormalizedCacheObject>>();
  const [persistor, setPersistor] = useState<CachePersistor<NormalizedCacheObject>>();
  const isFocused = useIsFocused();

  const onLogout = async () => {
    logOut({ apolloClient });
  }

  const setupApolloClient = async ({ apiKey }) => {
    const cache = new InMemoryCache({
      dataIdFromObject: (object) => {
        switch (object.__typename) {
          case "totara_mobile_current_learning": {
            const learningItem = (object as unknown) as LearningItem;
            return `${learningItem.id}__${learningItem.itemtype}`; // totara_core_learning_item is generic type, need to use 1 more field discriminate different types
          }
          default:
            return defaultDataIdFromObject(object); // fall back to default for all other types
        }
      }
    });

    const newPersistor = new CachePersistor({
      cache,
      storage: new AsyncStorageWrapper(AsyncStorage),
    });

    const newApolloClient = createApolloClient(
      apiKey,
      host!,
      cache,
      onLogout
    );

    return {
      apolloClient: newApolloClient,
      persistor: newPersistor
    }
  }


  useEffect(() => {
    if (apiKey && !apolloClient) {
      setupApolloClient({ apiKey }).then(({ apolloClient, persistor }) => {
        setPersistor(persistor);
        setApolloClient(apolloClient);
        persistor?.restore();
      })
    }
    else if (!apiKey && apolloClient) {
      persistor?.purge();
      setApolloClient(undefined);
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
          initSession({ apiKey: res.apiKey });
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
      if (isFocused) {
        if (!apiKey) {
          Linking.getInitialURL().then(initialURLHandler);
        }
        else {
          return () => {
            Linking.removeAllListeners("url");
          };
        }
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