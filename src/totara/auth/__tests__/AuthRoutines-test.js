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

import { getAndStoreApiKey, deviceCleanup, bootstrap } from "../AuthRoutines";

describe("AuthRoutines.getAndStoreApiKey should", () => {
  it("get api key if setup secret is valid", async () => {
    expect.assertions(5);

    const setupSecret = {
      uri: "https://totarasite.com",
      secret: "secret_from_server"
    };

    const apiKey = "the_api_key";

    const mockFetch = jest.fn((url, options) => {
      expect(url).toBe("https://totarasite.com/totara/mobile/device_register.php");
      const expectedOptions = {
        method: "POST",
        body: JSON.stringify({ setupsecret: setupSecret.secret })
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

    const setState = jest.fn((state) => {
      expect(state).toMatchObject({
        setup: expectedSetup,
        isAuthenticated: true
      })
    });
    const authProvider = {
      setState: setState,
    };

    await getAndStoreApiKey(authProvider)(setupSecret, mockFetch, asyncStorageSetItem);
  });


  it("be an error is setup secret is invalid", async () => {
    expect.assertions(3);

    const setupSecret = {
      uri: "https://totarasite.com",
      secret: "secret_from_server"
    };

    const mockFetch = jest.fn((url, options) => {
      expect(url).toBe("https://totarasite.com/totara/mobile/device_register.php");
      const expectedOptions = {
        method: "POST",
        body: JSON.stringify({ setupsecret: setupSecret.secret })
      };
      expect(options).toMatchObject(expectedOptions);

      return Promise.resolve({
        status: 400
      });
    });

    const asyncStorageSetItem = jest.fn(() => {
    });

    const result = getAndStoreApiKey(null)(setupSecret, mockFetch, asyncStorageSetItem);

    await expect(result).rejects.toThrow("Server Error: 400");
  });

});


describe("AuthRoutines.deviceCleanup should", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  const clearApollo = jest.fn();
  const setState = jest.fn((state) => {
    expect(state).toMatchObject({
      setup: undefined,
      isAuthenticated: false
    })
  });
  const authProvider = {
    setState: setState,
    clearApolloClient: clearApollo
  };

  it("Successfully deregister and cleanup storage",  async () => {
    expect.assertions(3);

    const mockDeleteDevice = jest.fn(() => Promise.resolve({ data: {delete_device: true }}));
    const mockClearStorage = jest.fn(() => Promise.resolve());

    await deviceCleanup(authProvider)(mockDeleteDevice, mockClearStorage, authProvider);
    expect(clearApollo).toHaveBeenCalledTimes(1);
    expect(setState).toHaveBeenCalledTimes(1);
  });


  it("Handle error on cleanup non-existing storage", async () => {
    expect.assertions(3);

    const errorNoneExistStorage = new Error("Failed to delete storage directory with");
    const mockDeleteDevice = jest.fn(() => Promise.resolve({ data: {delete_device: true }}));
    const mockClearStorageReject = jest.fn(() => Promise.reject(errorNoneExistStorage));

    await deviceCleanup(authProvider)(mockDeleteDevice, mockClearStorageReject, authProvider);
    expect(clearApollo).toHaveBeenCalledTimes(1);
    expect(setState).toHaveBeenCalledTimes(1);
  });


  it("Handle error on deregister the device and continue to logout the user", async () => {
    expect.assertions(3);

    const unHandledErrorServer = new Error("Server error");
    const mockDeleteDevice = jest.fn(() => Promise.reject(unHandledErrorServer));
    const mockClearStorageReject = jest.fn(() => Promise.resolve());

    await deviceCleanup(authProvider)(mockDeleteDevice, mockClearStorageReject, authProvider);
    expect(setState).toHaveBeenCalledTimes(1);
    expect(clearApollo).not.toHaveBeenCalled();
  });


  it("Un-handeled error on cleanup the storage", async () => {
    expect.assertions(3);

    const unHandledErrorStorage = new Error("Un handled errors for clean storage");
    const mockDeleteDevice = jest.fn(() => Promise.resolve({ data: {delete_device: true }}));
    const mockClearStorageReject = jest.fn(() => Promise.reject(unHandledErrorStorage));

    await deviceCleanup(authProvider)(mockDeleteDevice, mockClearStorageReject, authProvider);
    expect(clearApollo).toHaveBeenCalledTimes(1);
    expect(setState).toHaveBeenCalledTimes(1);
  });

  it("All Un-handeled errors", async () => {
    expect.assertions(2);

    const unHandledErrorServer = new Error("Server error");
    const unHandledErrorStorage = new Error("Un handled errors for clean storage");
    const mockDeleteDevice = jest.fn(() => Promise.reject(unHandledErrorServer));
    const mockClearStorageReject = jest.fn(() => Promise.reject(unHandledErrorStorage));

    await deviceCleanup(authProvider)(mockDeleteDevice, mockClearStorageReject, authProvider);
    expect(setState).toHaveBeenCalledTimes(1);
  });

});


describe("AuthRoutines.bootstrap should", () => {

  it("return the apiKey and host if they exists", async () => {
    expect.assertions(1);

    const mockGetStorage = jest.fn( key => (key === "apiKey") ? "the_api_key" : "testhost");

    const setState = jest.fn((state) => {
      expect(state).toMatchObject({
        setup: {
          apiKey: "the_api_key",
          host: "testhost"
        },
        isLoading: false,
        isAuthenticated: true
      })
    });
    const authProvider = {
      setState: setState,
    };

    await bootstrap(authProvider)(mockGetStorage);
  });

  it("return no setup if apiKey and host is not stored", async () => {
    expect.assertions(1);

    const setState = jest.fn((state) => {
      expect(state).toMatchObject({
        isLoading: false,
        isAuthenticated: false
      })
    });
    const authProvider = {
      setState: setState,
    };

    await bootstrap(authProvider)(() => Promise.resolve(null));

  });

});

