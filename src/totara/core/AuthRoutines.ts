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

import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { RetryLink } from "apollo-link-retry";
import { HttpLink } from "apollo-link-http";
import ApolloLinkTimeout from "apollo-link-timeout";
import { onError, ErrorResponse } from "apollo-link-error";
import { InMemoryCache, NormalizedCacheObject, defaultDataIdFromObject } from "apollo-cache-inmemory";
import { setContext } from "apollo-link-context";
import AsyncStorage, { AsyncStorageStatic } from "@react-native-community/async-storage";
import { persistCache } from "apollo-cache-persist";

import { config, Log } from "@totara/lib";
import { AUTHORIZATION } from "@totara/lib/constants";
import { LearningItem, AppState, SiteInfo } from "@totara/types";
import { Setup } from "./AuthHook";
import { ServerError } from "apollo-link-http-common";
import { PersistentStorage, PersistedData } from "apollo-cache-persist/types";

/**
 * Authentication Routines, part of AuthProvider however refactored to individual functions
 * so dependency can be passed as params for testing.
 *
 * WIP, not ideal that internal implementation is exposed (export).  Working out how to do
 * have a good balance between testability and keeping implementation hidden
 *
 * Partially apply the function to an instance of AuthProvider and recommended on its constructor
 */

/**
 * Given a appState secret (temp key), retrieve the api key (a long term key) from the api via
 * fetch.  Store the api key and host in storage, return these as well.
 *
 * @param fetchData - promise that resolves to get data
 * @param asyncStorage - device storage
 *
 * @param setup - contains the appState secret to be validated by the server
 *
 * @returns promise of appState which contains the valid apiKey and which host it was obtained from
 */
export const registerDevice = (
  fetchData: <T>(input: RequestInfo, init?: RequestInit) => Promise<T>,
  asyncStorage: AsyncStorageStatic
) => async (setup: Setup): Promise<AppState> => {
  type ApiKey = {
    apikey: string;
  };

  return fetchData<ApiKey>(config.deviceRegisterUri(setup.uri), {
    method: "POST",
    body: JSON.stringify({
      setupsecret: setup.secret
    })
  })
    .then((apiKey) => {
      const siteInfoData = JSON.stringify(setup.siteInfo);
      return Promise.all([
        asyncStorage.setItem("apiKey", apiKey.apikey),
        asyncStorage.setItem("siteInfo", siteInfoData),
        asyncStorage.setItem("host", setup.uri)
      ]).then(() => {
        return apiKey;
      });
    })
    .then((apiKey) => {
      const appState = {
        apiKey: apiKey.apikey,
        host: setup.uri,
        siteInfo: setup.siteInfo
      };
      Log.debug("appState done", appState);
      return appState;
    })
    .catch((error) => {
      Log.error("unable to get apiKey", error);
      throw error;
    });
};

/**
 *
 * During logOff this will clean up the device properly.  Will perform both local and remote
 * clean up.  It would catch all errors, as a user would be logged off regardless issues on the
 * remote and local services.  It would always clear the memory state
 *
 * @param asyncStorage device storage
 *
 * @param deviceDelete - remote device deletion mutation
 */
export const deviceCleanup = (asyncStorage: AsyncStorageStatic) => async (
  deviceDelete: () => Promise<{ data: { delete_device: boolean } }>
): Promise<boolean> => {
  const remoteCleanUp = deviceDelete()
    .then(({ data: { delete_device } }) => {
      Log.debug("Device deleted from server", delete_device);
      if (!delete_device) Log.warn("Unable to delete device from server");
      return delete_device;
    })
    .catch((error) => {
      Log.warn("remote clean up had issues, but continue to do local clean up", error);
    });

  const localCleanUp = asyncStorage
    .clear()
    .then(() => {
      Log.debug("Cleared storage");
    })
    .catch((error) => {
      if (error.message.startsWith("Failed to delete storage directory")) {
        Log.warn("Fail to clear Async storage, this expected if user is sign out ", error);
      } else {
        Log.warn("Error cleaning up device, but we still continue to logout the user", error);
      }
    });

  return Promise.all([localCleanUp, remoteCleanUp]).then(() => true);
};

/**
 * Would get needed items from storage and return a valid state appState.
 *
 * @param asyncStorage device storage
 */
export const bootstrap = (asyncStorage: AsyncStorageStatic) => async (): Promise<AppState | undefined> => {
  const [apiKey, host, siteInfo] = await Promise.all([
    asyncStorage.getItem("apiKey"),
    asyncStorage.getItem("host"),
    asyncStorage.getItem("siteInfo")
  ]);

  if (apiKey !== null && host !== null && siteInfo !== null) {
    Log.info("bootstrap with existing apiKey and host");
    return {
      apiKey: apiKey,
      host: host,
      siteInfo: JSON.parse(siteInfo) as SiteInfo
    };
  } else {
    Log.info("bootstrap with clean appState state");
    return undefined;
  }
};

/**
 * create an authenticated Apollo client that has the right credentials to the api
 */
export const createApolloClient = (
  apiKey: string,
  host: string,
  logOut: (localOnly: boolean) => Promise<void>
): ApolloClient<NormalizedCacheObject> => {
  const authLink = setContext((_, { headers }) => ({
    headers: {
      ...headers,
      [AUTHORIZATION]: `Bearer ${apiKey}`
    },
    http: { includeQuery: !config.mobileApi.persistentQuery }
  }));

  const logoutLink = onError(({ networkError }: ErrorResponse) => {
    Log.warn("Apollo client network error", networkError);
    if (networkError && (networkError as ServerError).statusCode === 401) {
      logOut(true);
    }
  });

  const httpLink = new HttpLink({ uri: config.apiUri(host) });
  const timeOutLinkWithHttpLink = new ApolloLinkTimeout(10 * 1000).concat(httpLink);
  const link = ApolloLink.from([
    logoutLink,
    new RetryLink({
      attempts: {
        max: 2,
        retryIf: (error) => {
          if (error.statusCode && error.statusCode === 401) {
            return false; // do not retry on 401 errors, fail fast
          } else {
            return !!error;
          }
        }
      }
    }),
    authLink,
    timeOutLinkWithHttpLink
  ]);

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

  persistCache({
    cache,
    storage: AsyncStorage as PersistentStorage<PersistedData<NormalizedCacheObject>>
  });

  return new ApolloClient({
    link: link,
    cache
  });
};

/**
 * fetch the json data from http endpoint.  The response is expected to be json with a data then return payload
 * { data: payload } as the object
 *
 * @param fetch - pass the fetch implementation, usually in test this is a mock fetch
 * @param input - input such as url to fetch to
 * @param init - optional options for the fetch request
 *
 * @example
 *
 * const totaraApi = fetchData(globalFetch)
 *
 * totaraApi<MyType>(
 *   "https://totarasite/api.php",
 *   {
 *      method: "GET"
 *   }
 *
 */
export const fetchData = (fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>) => async <T>(
  input: RequestInfo,
  init?: RequestInit
): Promise<T> => {
  return fetch(input, init)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        Log.warn("fetch error response", response);
        throw new Error(response.status.toString());
      }
    })
    .then((json) => {
      Log.debug("json response", json);
      if (json.data) return (json.data as unknown) as T;
      else throw new Error("json expected to have data attribute");
    });
};

/**
 * When using async operation with React.useEffect use this wrapper
 * For now async operation is not officially supported in useEffect.
 * see more details here: https://github.com/facebook/react/issues/14326
 *
 * This currently codifies this pattern: https://www.robinwieruch.de/react-hooks-fetch-data
 *
 * @param asyncOperation - a function that returns a promise that will be executed as the effect
 * @param useEffectIfTrue - condition to check before executing the asyncOperation
 * @param dispatchOnSuccess - when the promise is resolve and effect hasn't been cancelled this function is called with
 * value resolved
 * @param dispatchOnFailure - when promise is rejected calls this function with error
 *
 * @example
 *
 * useEffect(
 *   asyncEffectWrapper(
 *      ...
 *   ), [deps]);
 */
export const asyncEffectWrapper = <T>(
  asyncOperation: () => Promise<T>,
  useEffectIfTrue: () => boolean,
  dispatchOnSuccess: (t: T) => void,
  dispatchOnFailure: (error: Error) => void
): React.EffectCallback => {
  return () => {
    let didCancel = false;

    if (useEffectIfTrue()) {
      asyncOperation()
        .then((data) => {
          if (!didCancel && data) {
            Log.debug("Not cancelled and successfully got data: ", data);
            dispatchOnSuccess(data);
          } else {
            Log.warn("Cancelled and ignoring data: ", data);
          }
        })
        .catch((error) => {
          Log.debug("Error on asyncOperation with error: ", error);
          dispatchOnFailure(error);
        });
    }

    return () => {
      didCancel = true; // need to create a lock for async stuff
    };
  };
};
