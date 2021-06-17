
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

import { ApolloClient, NormalizedCacheObject } from "apollo-boost";
import React, { useEffect, useState } from "react";
import { ApolloProvider } from "react-apollo";
import SiteUrl from "./auth/manual/SiteUrl";
import { Loading } from "./components";
import { useSession } from "./core";
import { createApolloClient } from "./core/AuthRoutines";
import MainContainer from "./MainContainer";

const SessionContainer = () => {
  const { session } = useSession();
  const { host, apiKey, } = session;
  const [apolloClient, setApolloClient] = useState<ApolloClient<NormalizedCacheObject>>();

  const logOut = async (localOnly: boolean = false) => {
    //console.warn('logout');
  }

  useEffect(() => {
    //only init apolloclient if apiKey exists and apolloClient dont
    if (apiKey && !apolloClient) {
      const apc = createApolloClient(
        apiKey,
        host!,
        logOut
      );
      setApolloClient(apc)
    }
  }, [apiKey, apolloClient]);


  console.log(host, apiKey);
  if (!host || !apiKey) {
    return <SiteUrl />
  }

  if (!apolloClient)
    return <Loading />

  return <ApolloProvider client={apolloClient!}>
    <MainContainer />
  </ApolloProvider>
}

export default SessionContainer;