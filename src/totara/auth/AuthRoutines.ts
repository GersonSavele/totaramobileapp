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
import { SetupSecret, Setup } from "./AuthContext";

/**
 * Given a setup secret (temp key), retrieve the api key (a long term key) from the api via
 * fetch.  Also store the api key and host in storage
 *
 * @param setupSecret contains the setup secret to be validated by the server
 * @param fetch http fetch
 * @param storeItem store item using key value
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