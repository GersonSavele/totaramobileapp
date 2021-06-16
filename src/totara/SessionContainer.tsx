
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

import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { Loading } from "./components";
import { useSession } from "./core";

const SessionContainer = () => {
  const { session } = useSession();
  const { host, apiKey } = session;
  const navigation = useNavigation();

  useEffect(() => {
    if (!host) {
      navigation.navigate('SiteUrl');
      return;
    }
  }, [host]);

  useEffect(() => {
    if (apiKey)
      navigation.navigate('ApolloWrapper')
  }, [apiKey]);

  return <Loading />
}

export default SessionContainer;