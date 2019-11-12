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
 */

import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { RetryLink } from "apollo-link-retry";
import { HttpLink } from "apollo-link-http";
import { onError, ErrorResponse } from "apollo-link-error";
import { InMemoryCache } from "apollo-cache-inmemory";
import { setContext } from "apollo-link-context";

import { config, Log } from "@totara/lib";
import { AUTHORIZATION } from "@totara/lib/Constant";
import { AsyncStorageStatic } from "@react-native-community/async-storage";
import { LearningItem } from "@totara/types";
import { Setup } from "./AuthContextHook";
import { AppState, SiteInfo } from "./AuthContext";
import VersionInfo from "react-native-version-info";

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
 * @param fetch http fetch
 * @param asyncStorage device storage
 *
 * @param setup contains the appState secret to be validated by the server
 *
 *
 * @returns promise of appState which contains the valid apiKey and which host it was obtained from
 */
export const getAndStoreApiKey = (
  fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>,
  asyncStorage: AsyncStorageStatic,
) => async (
  setup: Setup
): Promise<AppState> => (

    fetch(config.deviceRegisterUri(setup.uri), {
        method: "POST",
        body: JSON.stringify({
          setupsecret: setup.secret
        })
      }
    ).then(response => {
      Log.debug("server response status ", response.status);
      if (response.status === 200) return response.json();
      throw new Error(`Server Error: ${response.status}`);
    }).then(json => {
      return json.data;
    }).then(data => {
      const siteInfoData = JSON.stringify(setup.siteInfo);
      return Promise.all([asyncStorage.setItem("apiKey", data.apikey), asyncStorage.setItem("siteInfo", siteInfoData), asyncStorage.setItem("host", setup.uri)])
        .then(() => {
         return data;
        })
    }
    ).then(data => {
        const appState = {
          apiKey: data.apikey,
          host: setup.uri,
          siteInfo: setup.siteInfo,
        };
        Log.debug("appState done", appState);
        return appState;
      }
    ).catch(error => {
      Log.error("unable to get apiKey", error);
      throw error;
    })

  );

 
  
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
export const deviceCleanup = (
  asyncStorage: AsyncStorageStatic
) => async (
  deviceDelete: () => Promise<any>
): Promise<boolean> => {

    const remoteCleanUp = deviceDelete().then(({ data: { delete_device } }) => {
      Log.debug("Device deleted from server", delete_device);
      if (!delete_device)
        Log.warn("Unable to delete device from server");
      return delete_device
    }).catch(error => {
      Log.warn("remote clean up had issues, but continue to do local clean up", error)
    });

    const localCleanUp = asyncStorage.clear().then(() => {
      Log.debug("Cleared storage");
    }).catch((error) => {
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
export const bootstrap = (
  asyncStorage: AsyncStorageStatic
) => async (): Promise<AppState | undefined> => {
    const [apiKey, host, siteInfo] = await Promise.all([asyncStorage.getItem("apiKey"), asyncStorage.getItem("host"), asyncStorage.getItem("siteInfo")]);

    if (apiKey !== null && host !== null && siteInfo !== null) {
      Log.info("bootstrap with existing apiKey and host");
      return {
        apiKey: apiKey,
        host: host,
        siteInfo: JSON.parse(siteInfo) as SiteInfo
      }
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
  uri: string,
  logOut: (localOnly: boolean) => Promise<void>
) => {
  const authLink = setContext((_, { headers }) => ({
    headers: {
      ...headers,
      [AUTHORIZATION]: `Bearer ${apiKey}`
    },
    http: { includeQuery: !config.mobileApi.persistentQuery }
  }));

  const logoutLink = onError(({ response }: ErrorResponse) => {
    Log.warn("Apollo client error", response);
    if (
      response.errors[0].extensions.exception.networkError.statusCode === 401
    ) {
      // TODO MOB-231 this is not the documented way to get status code fix this
      logOut(true);
    }
  });

  const httpLink = new HttpLink({ uri: uri });

  const link = ApolloLink.from([
    logoutLink,
    new RetryLink({ attempts: { max: 10 } }),
    authLink,
    httpLink
  ]);

  return new ApolloClient({
    link: link,
    cache: new InMemoryCache({
      dataIdFromObject: object => {
        switch (object.__typename) {
          case 'totara_core_learning_item': {
            const learningItem = object as unknown as LearningItem;
            return `${learningItem.id}__${learningItem.itemtype}`; // totara_core_learning_item is generic type, need to use 1 more field discriminate different types
          }
          default: return object.id; // fall back to `id` for all other types
        }
      }
    })
  });
};

/**
 * get the siteInfo for a siteUrl
 *
 * @param siteUrl - url where to fetch the site info
 */
export const getSiteInfo = (
  fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>
) => async (
  siteUrl: string,
): Promise<SiteInfo> => {

  const infoUrl = config.infoUri(siteUrl);
  const options = {
    method: "POST",
    body: JSON.stringify({ version: VersionInfo.appVersion })
  };

  return fetch(infoUrl, options)
    .then(response => {
      Log.debug("response", response);
      if (response.status === 200) return response.json();
      else throw new Error(response.statusText);
    })
    .then(response => {
      return (response.data as unknown) as SiteInfo;
    });
};
