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
 * @author: Kamala Tennakoon <kamala.tennakoon@totaralearning.com>
 */

import { Log } from "@totara/lib";

/**
 * Call this to clear user session and local states
 */
const deviceCleanup = async (deviceDelete: Promise<any>, clearStorage: Promise<void>, clearApolloClient: () => void, clearSetupState: () => void) => {
  return deviceDelete.then(() => {
    Log.debug("Clear apollo client");
    clearApolloClient();
    return clearStorage
  }).then(() => {
    Log.debug("Clear setup");
    clearSetupState();
  }).catch((error) => {
    if (error.message.startsWith("Failed to delete storage directory")) {
      Log.warn("Fail to clear Async storage, this expected if user is sign out ", error);
    } else {
      Log.error("Fail to clear Async storage ", error);
      throw error;
    }
  });
}
export default deviceCleanup;