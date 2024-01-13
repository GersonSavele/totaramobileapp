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

import { config } from "@totara/lib";
import { InMemoryCache, defaultDataIdFromObject } from "@apollo/client";
import { AsyncStorageWrapper, CachePersistor } from "apollo3-cache-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createApolloClient } from "./AuthRoutines";
import { LearningItem } from "../types";

enum Compatible {
  Api = 1
}

const isValidApiVersion = (apiVersoin?: string) => {
  const compatibilityList = isCompatible(apiVersoin);
  return compatibilityList.length > 0;
};

const isCompatible = (version?: string) => {
  const fullCompatible = [Compatible.Api];
  if (config.minApiVersion === "disabled") {
    return fullCompatible;
  } else {
    if (version && config.minApiVersion <= version) return [Compatible.Api];
    else return [];
  }
};

const setupApolloClient = async ({ apiKey, host }) => {
  const cache = new InMemoryCache({
    dataIdFromObject: object => {
      switch (object.__typename) {
        case "totara_mobile_current_learning": {
          const learningItem = object as unknown as LearningItem;
          return `${learningItem.id}__${learningItem.itemtype}`; // totara_core_learning_item is generic type, need to use 1 more field discriminate different types
        }
        default:
          return defaultDataIdFromObject(object); // fall back to default for all other types
      }
    }
  });

  const newPersistor = new CachePersistor({
    cache,
    storage: new AsyncStorageWrapper(AsyncStorage)
  });

  const newApolloClient = createApolloClient(apiKey, host!, cache);

  return {
    apolloClient: newApolloClient,
    persistor: newPersistor
  };
};

export { isValidApiVersion, isCompatible, setupApolloClient };
export default { isValidApiVersion, isCompatible, setupApolloClient };
