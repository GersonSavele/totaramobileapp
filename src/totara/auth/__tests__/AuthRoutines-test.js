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
 * @author Jun Yamog <jun.yamog@totaralearning.com>
 *
 */

import { registerDevice, deviceCleanup, bootstrap, asyncEffectWrapper, fetchData } from "../AuthRoutines";
import { Log } from "@totara/lib";

describe("AuthRoutines.registerDevice", () => {
  it("should get api key if setup secret is valid", async () => {
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
        apikey: apiKey
      });
    });

    const mockAsyncStorage = {
      setItem: jest.fn((key, value) => {
        if (key === "apiKey") expect(value).toBe(apiKey);
        if (key === "host") expect(value).toBe(setupSecret.uri);
      })
    };

    const expectedSetup = {
      apiKey: apiKey,
      host: setupSecret.uri
    };

    const setup = await registerDevice(mockFetch, mockAsyncStorage)(setupSecret);

    expect(setup).toMatchObject(expectedSetup);
  });


  it("should be an error is setup secret is invalid", async () => {
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

      return Promise.reject(new Error("400"));
    });

    const mockAsyncStorage = {
      setItem: () => {}
    };

    const result = registerDevice(mockFetch, mockAsyncStorage)(setupSecret);

    await expect(result).rejects.toThrow("400");
  });

});


describe("AuthRoutines.deviceCleanup", () => {

  Log.debug = jest.fn();
  Log.warn = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully deregister and cleanup storage",  async () => {
    expect.assertions(3);

    const mockDeleteDevice = jest.fn(() => Promise.resolve({ data: {delete_device: true }}));
    const mockClearStorage = jest.fn(() => Promise.resolve());
    const mockAsyncStorage = {
      clear: mockClearStorage
    };

      const result = await deviceCleanup(mockAsyncStorage)(mockDeleteDevice);
    expect(result).toBeTruthy();
    expect(Log.debug).toHaveBeenCalledTimes(2);
    expect(Log.warn).not.toHaveBeenCalled();
  });


  it("should handle error on cleanup non-existing storage", async () => {
    expect.assertions(3);

    const errorNoneExistStorage = new Error("Failed to delete storage directory with");
    const mockDeleteDevice = jest.fn(() => Promise.resolve({ data: {delete_device: true }}));
    const mockClearStorage = jest.fn(() => Promise.reject(errorNoneExistStorage));
    const mockAsyncStorage = {
      clear: mockClearStorage
    };

    const result = await deviceCleanup(mockAsyncStorage)(mockDeleteDevice);
    expect(result).toBeTruthy();
    expect(Log.debug).toHaveBeenCalledTimes(1);
    expect(Log.warn).toHaveBeenCalledTimes(1);
  });


  it("should handle error on deregister the device", async () => {
    expect.assertions(3);

    const unHandledErrorServer = new Error("Server error");
    const mockDeleteDevice = jest.fn(() => Promise.reject(unHandledErrorServer));
    const mockClearStorage = jest.fn(() => Promise.resolve());
    const mockAsyncStorage = {
      clear: mockClearStorage
    };

    const result = await deviceCleanup(mockAsyncStorage)(mockDeleteDevice);
    expect(result).toBeTruthy();
    expect(Log.debug).toHaveBeenCalledTimes(1);
    expect(Log.warn).toHaveBeenCalledTimes(1);
  });


  it("should handle unsuccessful deregister", async () => {
    expect.assertions(3);

    const mockDeleteDevice = jest.fn(() => Promise.resolve({ data: {delete_device: false }}));
    const mockClearStorage = jest.fn(() => Promise.resolve());
    const mockAsyncStorage = {
      clear: mockClearStorage
    };

    const result = await deviceCleanup(mockAsyncStorage)(mockDeleteDevice);
    expect(result).toBeTruthy();
    expect(Log.debug).toHaveBeenCalledTimes(2);
    expect(Log.warn).toHaveBeenCalledTimes(1);
  });

  it("should handle errors on deregister and clean up storage", async () => {
    expect.assertions(3);

    const unHandledErrorServer = new Error("Server error");
    const unHandledErrorStorage = new Error("Un handled errors for clean storage");
    const mockDeleteDevice = jest.fn(() => Promise.reject(unHandledErrorServer));
    const mockClearStorage = jest.fn(() => Promise.reject(unHandledErrorStorage));
    const mockAsyncStorage = {
      clear: mockClearStorage
    };

    const result = await deviceCleanup(mockAsyncStorage)(mockDeleteDevice);
    expect(result).toBeTruthy();
    expect(Log.debug).not.toHaveBeenCalled();
    expect(Log.warn).toHaveBeenCalledTimes(2);
  });

});


describe("AuthRoutines.bootstrap", () => {

  it("should return the apiKey and host if they exists", async () => {
    expect.assertions(1);
    const mockAsyncStorage = {
      getItem: jest.fn(key => {
        switch (key) {
          case "apiKey":
            return Promise.resolve("the_api_key");
          case "host":
            return Promise.resolve("testhost");
          case "siteInfo":
            return Promise.resolve(JSON.stringify({ version: "testhost" }));
          default:
            return Promise.resolve(null);
        }
      })
    };

    const result = await bootstrap(mockAsyncStorage)();

    expect(result).toMatchObject({
      apiKey: "the_api_key",
      host: "testhost"
    });
  });

  it("should return no setup if apiKey and host is not stored", async () => {
    expect.assertions(1);

    const mockAsyncStorage = {
      getItem: jest.fn( () => Promise.resolve(null))
    };

    const result = await bootstrap(mockAsyncStorage)();

    expect(result).toBeFalsy();
  });

});


describe("asyncEffectWrapper", () => {
  const asyncOperationSuccess =
    Promise.resolve({
      test: "object"
    });

  it("should call dispatchOnSuccess when it isn't cancelled and asyncOperation is resolved", async () => {
    expect.assertions(1);
    const dispatch = jest.fn((payload) => {
      expect(payload).toMatchObject({
        test: "object"
      });
    });
    asyncEffectWrapper(
      () => asyncOperationSuccess,
      () => true,
      dispatch
    )();

    await asyncOperationSuccess;
  });

  it("should call dispatchOnFailure if the promise is rejected with an error", async () => {
    expect.assertions(1);

    const onLoginFailure = jest.fn((error) => expect(error.message).toBe("server error"));
    const asyncOperationFailed = () => Promise.reject(new Error("server error"));

    asyncEffectWrapper(
      asyncOperationFailed,
      () => true,
      () => {},
      onLoginFailure
    )();
  });

  it("should not perform the asyncOperation if the useEffectIfTrue false", async done => {
    const asyncOperationFailed = () => { done.fail("this code should never be executed, test failed") };

    asyncEffectWrapper(
      asyncOperationFailed,
      () => false,
      () => { done.fail("this code should never be executed, test failed") },
      () => { done.fail("this code should never be executed, test failed") }
    )();

    done();
  });


  it("should ignore dispatchOnSuccess when it is cancelled even when asyncOperation is resolved", async done => {
    expect.assertions(1);

    let resolveOutside;

    const promise = new Promise(resolve => {
      resolveOutside = resolve
    });

    const fn = jest.fn(() => promise);

    const effectCallBack = asyncEffectWrapper(
      fn,
      () => true,
      () => { done.fail("this code should never be called") },
      () => { done.fail("this code should never be called") }
    )();
    effectCallBack(); // cancel the effect

    resolveOutside({data: "test"}); // resolve and wait for the promise
    await promise;

    expect(fn).toBeCalledTimes(1);
    done();
  });

});

describe("fetchData", () => {

  it("should return data from json when fetch response with http 200", async () =>{
    expect.assertions(3);

    const successResponse = jest.fn( (input, init) => {
      expect(input).toBe("http://apisite.com");
      expect(init).toMatchObject({
        method: "GET"
      });

      return Promise.resolve({
        status: 200,
        json: () =>
          ({
            data: {
              test: "data"
            }
          })
      })
    });

    const data = await fetchData(successResponse)(
      "http://apisite.com",
      {
        method: "GET"
      }
    );

    expect(data).toMatchObject({
      test: "data"
    });
  });

  it("should return an error if the response is not http 200", async () =>{
    expect.assertions(1);
    const failedResponse = jest.fn( () => {
      return Promise.resolve({
        status: 500,
      })
    });

    await fetchData(failedResponse)(
      "http://apisite.com",
      {
        method: "GET"
      }
    ).catch(error => {
      expect(error.message).toBe("500");
    });
  });

  it("should return an error if the response is not json even with a http 200 response", async () =>{
    expect.assertions(1);
    const failedResponse = jest.fn( () => {
      return Promise.resolve({
        status: 200,
        json: () => {throw new Error("error")} // can't mock json error but should be good enough
      })
    });

    await fetchData(failedResponse)(
      "http://apisite.com",
      {
        method: "GET"
      }
    ).catch(error => {
      expect(error.message).toBe("error");
    });
  });

  it("should return an error if the response is not the expected json format", async () =>{
    expect.assertions(1);
    const failedResponse = jest.fn( () => {
      return Promise.resolve({
        status: 200,
        json: () => ({
          wrongFormatJson: "can't process payload"
        })
      })
    });

    await fetchData(failedResponse)(
      "http://apisite.com",
      {
        method: "GET"
      }
    ).catch(error => {
      expect(error.message).toBe("json expected to have data attribute");
    });
  });

});


