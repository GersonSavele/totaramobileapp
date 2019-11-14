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
 */
import { AuthStep, initialState, useAuthContext } from "@totara/auth/AuthContextHook";
import { renderHook, act } from "@testing-library/react-hooks";

describe("useAuthContext", () => {

  it("should cleanup device during logout", async () => {

    const mockBootstrap = jest.fn();
    const mockGetAndStoreApiKey = jest.fn();
    const mockDeviceCleanup = jest.fn(() => Promise.resolve(true));
    const mockCreateApolloClient = jest.fn();

    const state = {
      appState: {},
      setup: undefined,
      isLoading: false,
      isAuthenticated: true,
      authStep: AuthStep.registered
    };

    const { result, waitForNextUpdate } = renderHook((props) => useAuthContext(mockBootstrap, mockGetAndStoreApiKey, mockDeviceCleanup, mockCreateApolloClient)(props),
      { initialProps: { initialState: state } }
    );

    act(() => {
      result.current.logOut();
    });

    await mockDeviceCleanup;
    act(async () => waitForNextUpdate());

    expect(result.current.authContextState.appState).toBeFalsy();
    expect(result.current.authContextState.isAuthenticated).toBeFalsy();
    expect(result.current.authContextState.isLoading).toBeFalsy();
    expect(result.current.authContextState.authStep).toBe(AuthStep.bootstrapDone);
  });

  it("should register device when login is successful", async () => {
    expect.assertions(5);

    const setup = {
      secret: "secret",
      uri: "https://site.com",
      siteInfo: {
        version: "2019101802"
      }
    };

    const expectedAppState = {
      apiKey: "apiKey",
      host: "https://site.com",
      siteInfo: {
        version: "2019101802"
      }
    };

    const mockBootstrap = jest.fn();
    const mockGetAndStoreApiKey = jest.fn((ss) => {

      expect(ss).toMatchObject(setup);

      return Promise.resolve({
        apiKey: "apiKey",
        host: "https://site.com",
        siteInfo: {
          version: "2019101802"
        }
      })
    });
    const mockDeviceCleanup = jest.fn(() => Promise.resolve(true));
    const mockCreateApolloClient = jest.fn();

    const state = {
      appState: undefined,
      setup: undefined,
      isLoading: false,
      isAuthenticated: false,
      authStep: AuthStep.bootstrapDone
    };

    const { result, waitForNextUpdate } = renderHook((props) => useAuthContext(mockBootstrap, mockGetAndStoreApiKey, mockDeviceCleanup, mockCreateApolloClient)(props),
      { initialProps: { initialState: state } }
    );

    act(() => {
      result.current.onLoginSuccess(setup);
    });

    await mockDeviceCleanup; 
    await act(async () => waitForNextUpdate());

    expect(result.current.authContextState.appState).toMatchObject(expectedAppState);
    expect(result.current.authContextState.isAuthenticated).toBeTruthy();
    expect(result.current.authContextState.isLoading).toBeFalsy();
    expect(result.current.authContextState.authStep).toBe(AuthStep.setupDone);

  });

  it("should bootstrap when it starts with nothing stored", async () => {

    const mockBootstrap = jest.fn(() => Promise.resolve(undefined));
    const mockGetAndStoreApiKey = jest.fn();
    const mockDeviceCleanup = jest.fn();
    const mockCreateApolloClient = jest.fn();

    const { result, waitForNextUpdate } = renderHook((props) => useAuthContext(mockBootstrap, mockGetAndStoreApiKey, mockDeviceCleanup, mockCreateApolloClient)(props),
      { initialProps: { initialState: initialState } }
    );

    await mockBootstrap;
    await act(async () => waitForNextUpdate());

    expect(result.current.authContextState.setup).toBeFalsy();
  });

  it("should bootstrap when it starts loading with stored apiKey", async () => {

    const mockBootstrap = jest.fn(() => Promise.resolve({
      apiKey: "apikey",
      host: "http://totarasite.com",
      siteInfo: {
        version: "2019101802"
      }
    }));
    const mockGetAndStoreApiKey = jest.fn();
    const mockDeviceCleanup = jest.fn();
    const mockCreateApolloClient = jest.fn();

    const { result, waitForNextUpdate } = renderHook((props) => useAuthContext(mockBootstrap, mockGetAndStoreApiKey, mockDeviceCleanup, mockCreateApolloClient)(props),
      { initialProps: { initialState: initialState } }
    );

    await mockBootstrap;
    await act(async () => waitForNextUpdate());

    expect(result.current.authContextState.appState.apiKey).toBe("apikey");
    expect(mockCreateApolloClient).toBeCalledTimes(1);
  });


  it("should get and store the api key when setup secret is initialized", async () => {
    const setup = {
      secret: "secret",
      uri: "https://thesite.com",
      siteInfo: {
        version: "2019101802"
      }
    };

    const mockBootstrap = jest.fn();
    const mockGetAndStoreApiKey = jest.fn((ss) => {

      expect(ss).toMatchObject(setup);

      return Promise.resolve({
        apiKey: "apiKey",
        host: "https://host.com",
        siteInfo: {
          version: "2019101802"
        }
      })
    });
    const mockDeviceCleanup = jest.fn();
    const mockCreateApolloClient = jest.fn();

    const state = {
      appState: {},
      setup: setup,
      isLoading: false,
      isAuthenticated: false,
      authStep: AuthStep.setupSecretInit
    };

    const { result, waitForNextUpdate } = renderHook((props) => useAuthContext(mockBootstrap, mockGetAndStoreApiKey, mockDeviceCleanup, mockCreateApolloClient)(props),
      { initialProps: { initialState: state } }
    );

    await mockGetAndStoreApiKey;
    await act(async () => waitForNextUpdate());

    expect(result.current.authContextState.appState.apiKey).toBe("apiKey");
    expect(result.current.authContextState.isAuthenticated).toBeTruthy();
    expect(result.current.authContextState.isLoading).toBeFalsy();
    expect(result.current.authContextState.authStep).toBe(AuthStep.setupDone);
  });

  it("should be setup error when register is not successful", async () => {
    expect.assertions(5);

    const setup = {
      secret: "secret",
      uri: "https://site.com",
      siteInfo: {
        version: "2019101802"
      }
    };

    const mockBootstrap = jest.fn();
    const mockGetAndStoreApiKey = jest.fn((ss) => {

      expect(ss).toMatchObject(setup);

      return Promise.reject(new Error("server error"))
    });
    const mockDeviceCleanup = jest.fn(() => Promise.resolve(true));
    const mockCreateApolloClient = jest.fn();

    const state = {
      appState: undefined,
      setup: undefined,
      isLoading: false,
      isAuthenticated: false,
      authStep: AuthStep.bootstrapDone
    };

    const { result, waitForNextUpdate } = renderHook((props) => useAuthContext(mockBootstrap, mockGetAndStoreApiKey, mockDeviceCleanup, mockCreateApolloClient)(props),
      { initialProps: { initialState: state } }
    );

    act(() => {
      result.current.onLoginSuccess(setup);
    });

    await act(async () => waitForNextUpdate());

    expect(result.current.authContextState.appState).toBeFalsy();
    expect(result.current.authContextState.isAuthenticated).toBeFalsy();
    expect(result.current.authContextState.isLoading).toBeFalsy();
    expect(result.current.authContextState.authStep).toBe(AuthStep.authError);

  });


});