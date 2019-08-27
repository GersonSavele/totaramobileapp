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

import { config, Log } from "@totara/lib";
import { SetupSecret, Setup, State, Props } from "./AuthContext";

/**
 * Authentication Routines, part of AuthProvider however refactored to individual functions
 * so dependency can be passed as params for testing.
 *
 * WIP, not ideal that internal implementation is exposed (export).  Working out how to do
 * have a good balance between testability and keeping implementation hidden
 */

type AuthProviderType<P, S> = {
  clearApolloClient: () => void
  setState: <K extends keyof S>(
    state: ((prevState: Readonly<S>, props: Readonly<P>) => (Pick<S, K> | S | null)) | (Pick<S, K> | S | null),
    callback?: () => void
  ) => void
}

/**
 * Given a setup secret (temp key), retrieve the api key (a long term key) from the api via
 * fetch.  Store the api key and host in storage, return these as well.
 *
 * @param setupSecret contains the setup secret to be validated by the server
 * @param fetch http fetch
 * @param storeItem store item using key value
 *
 * @returns promise of setup which contains the valid apiKey and which host it was obtained from
 */
export const getAndStoreApiKey = async (setupSecret: SetupSecret,
                                 fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>,
                                 storeItem: (key: string, value: string) => Promise<void>,
                                 ): Promise<Setup> => (

  fetch(config.deviceRegisterUri(setupSecret.uri), {
      method: "POST",
      body: JSON.stringify({
        setupsecret: setupSecret.secret
      })
    }
  ).then(response => {
    Log.debug("server response status ", response.status);
    if (response.status === 200) return response.json();
    throw new Error(`Server Error: ${response.status}`);
  }).then(json => json.data.apikey
  ).then(apiKey =>
    Promise.all([storeItem("apiKey", apiKey), storeItem("host", setupSecret.uri)])
      .then(() => apiKey)
  ).then(apiKey => {
      const setup = {
        apiKey: apiKey,
        host: setupSecret.uri
      };
      Log.debug("setup done", setup);
      return setup;
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
 * @param deviceDelete - remote device deletion mutation
 * @param clearStorage - storage cleanup
 * @param authContext - authContext instance to clear
 */
export const deviceCleanup = async (deviceDelete: () => Promise<any>,
                                    clearStorage: () => Promise<void>,
                                    authProvider: AuthProviderType<Props, State>) => {

  const remoteCleanUp = deviceDelete().then(({ data: { delete_device } }) => {
    Log.debug("Device deleted from server", delete_device);
    if (!delete_device)
      Log.warn("Unable to delete device from server");
    return delete_device
  }).then(() => authProvider.clearApolloClient())
    .catch(error => {
      Log.warn("remote clean up had issues, but continue to do local clean up", error)
    });

  const localCleanUp = clearStorage().then(() => {
    Log.debug("Cleared storage");
  }).catch((error) => {
    if (error.message.startsWith("Failed to delete storage directory")) {
      Log.warn("Fail to clear Async storage, this expected if user is sign out ", error);
    } else {
      Log.warn("Error cleaning up device, but we still continue to logout the user", error);
    }
  });

  return Promise.all([localCleanUp, remoteCleanUp]).then(() => authProvider.setState({ setup: undefined }));

};

/**
 * Would get needed items from storage and return a valid state setup.
 *
 * @param storeGetItem - retrieve from storage using a key
 */
export const bootstrap = async (storeGetItem: (key: string) => Promise<string | null>): Promise<Pick<State, "isLoading" | "setup">> => {
  const [apiKey, host] = await Promise.all([storeGetItem("apiKey"), storeGetItem("host")]);

  if (apiKey !== null && host !== null) {
    Log.info("bootstrap with existing apiKey and host");
    return({
      setup: {
        apiKey: apiKey,
        host: host
      },
      isLoading: false
    });
  } else {
    Log.info("bootstrap with clean setup state");
    return({
      isLoading: false
    });

  }
};

