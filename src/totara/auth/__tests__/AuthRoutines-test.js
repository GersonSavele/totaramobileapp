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
 *
 */

import { getAndStoreApiKey } from "../AuthRoutines";

describe("AuthRoutines should", () => {
  it("get api key if setup secret is valid", async () => {

    const setupSecret = {
      uri: "https://totarasite.com",
      secret: "secret_from_server"
    };

    const apiKey = "the_api_key";

    const mockFetch = jest.fn((url, options) => {
      expect(url).toBe("https://totarasite.com/totara/mobile/device_register.php");
      const expectedOptions = {
        method: "POST",
        body: JSON.stringify({setupsecret: setupSecret.secret})
      };
      expect(options).toMatchObject(expectedOptions);

      return Promise.resolve({
        status: 200,
        json: () => ({
          data: {
            apikey: apiKey
          }
        })
      });
    });

    const asyncStorageSetItem = jest.fn((key, value) => {
      if (key === "apiKey") expect(value).toBe(apiKey);
      if (key === "host") expect(value).toBe(setupSecret.uri);
    });

    const expectedSetup = {
      apiKey: apiKey,
      host: setupSecret.uri
    };

    const setup = await getAndStoreApiKey(setupSecret, mockFetch, asyncStorageSetItem);

    expect(setup).toMatchObject(expectedSetup);
  });


  it("be an error is setup secret is invalid", async () => {

    const setupSecret = {
      uri: "https://totarasite.com",
      secret: "secret_from_server"
    };

    const mockFetch = jest.fn((url, options) => {
      expect(url).toBe("https://totarasite.com/totara/mobile/device_register.php");
      const expectedOptions = {
        method: "POST",
        body: JSON.stringify({setupsecret: setupSecret.secret})
      };
      expect(options).toMatchObject(expectedOptions);

      return Promise.resolve({
        status: 400
      });
    });

    const asyncStorageSetItem = jest.fn(() => {
    });

    const setup = getAndStoreApiKey(setupSecret, mockFetch, asyncStorageSetItem);

    await expect(setup).rejects.toThrow("Server Error: 400");
  });

});
