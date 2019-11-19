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
 * @author Tharaka Dushmantha <tharaka.dushmantha@totaralearning.com>
 */

import { renderHook, act } from "@testing-library/react-hooks";
import {
  useNativeLogin,
  nativeReducer,
  fetchLoginSecret,
  fetchLogin
} from "../NativeLoginHook";

const onBack = jest.fn();
const onSetupSecretSuccess = jest.fn();


describe("useNativeLogin", () => {
  const { result } = renderHook(props => useNativeLogin()(props), {
    initialProps: {
      siteUrl: "http://mobiledemo.wlg.totaralms.com",
      onSetupSecretSuccess: { onSetupSecretSuccess },
      onBack: { onBack }
    }
  });
  it("both empty 'username' and 'password'", () => {
    act(() => {
      result.current.inputUsernameWithShowError(undefined);
      result.current.inputPasswordWithShowError(undefined);
      result.current.onClickEnter();
    });

    expect(result.current.nativeLoginState.inputUsernameStatus).toBe("error");
    expect(result.current.nativeLoginState.inputPasswordStatus).toBe("error");
  });

  it("valid 'username' and empty 'password'", () => {
    act(() => {
      result.current.inputUsernameWithShowError("username");
      result.current.inputPasswordWithShowError(undefined);
      result.current.onClickEnter();
    });

    expect(result.current.nativeLoginState.inputUsernameStatus).toBe(undefined);
    expect(result.current.nativeLoginState.inputPasswordStatus).toBe("error");
  });

  it("empty 'username' and valid 'password'", () => {
    act(() => {
      result.current.inputUsernameWithShowError(undefined);
      result.current.inputPasswordWithShowError("password");
      result.current.onClickEnter();
    });

    expect(result.current.nativeLoginState.inputUsernameStatus).toBe("error");
    expect(result.current.nativeLoginState.inputPasswordStatus).toBe(undefined);
  })
});

describe("Native login reducer", () => {
  it("should handle setupSecret", () => {
    const action = {
      type: "setupsecret",
      payload: "test-setupSecret"
    };
    const newState = nativeReducer({}, action);
    expect(newState.setupSecret).toEqual("test-setupSecret");
  });

  it("should handle setusername", () => {
    const action = {
      type: "setusername",
      payload: "test-setusername"
    };
    const newState = nativeReducer({}, action);
    expect(newState.inputUsername).toEqual("test-setusername");
  });

  it("should handle setpassword", () => {
    const action = {
      type: "setpassword",
      payload: "test-setpassword"
    };
    const newState = nativeReducer({}, action);
    expect(newState.inputPassword).toEqual("test-setpassword");
  });
  it("should handle clickenter with-out username and password", () => {
    const state = {
      inputUsername: undefined,
      inputPassword: undefined
    };
    const action = {
      type: "submit",
      payload: undefined
    };
    const newState = nativeReducer(state, action);
    
    expect(newState.inputUsernameStatus).toEqual("error");
    expect(newState.inputPasswordStatus).toEqual("error");
  });
  it("should handle clickenter with invalid username and valid password", () => {
    
    const state = {
      inputUsername: undefined,
      inputPassword: "password"
    };
    const action = {
      type: "submit",
      payload: undefined
    };
    const newState = nativeReducer(state, action);
    expect(newState.inputUsernameStatus).toEqual("error");
    expect(newState.inputPasswordStatus).toEqual(undefined);
  });
  it("should handle clickenter with valid username and invalid password", () => {
    const state = {
      inputUsername: "username",
      inputPassword: undefined
    };
    const action = {
      type: "submit",
      payload: undefined
    };
    const newState = nativeReducer(state, action);
    expect(newState.inputUsernameStatus).toEqual(undefined);
    expect(newState.inputPasswordStatus).toEqual("error");
  });
});

describe("fetchData", () => {
  it("should login secret action return if it is response status code 200", async () => {
    await fetchLoginSecret(mockFetchLoginSecret)(false).then(response =>
      expect(response).toEqual("loginsecret_value")
    );
  });

  it("should call login secret action fail if the response has an error", async () => {
    const mockFetch = () =>
      Promise.resolve({
        status: 401,
        statusText: "server error"
      });
      await fetchLoginSecret(mockFetch)(false)
        .then(response => expect(response).toEqual(undefined))
        .catch((e)=> expect(e.message).toEqual("401"));
  });

  it("should dispatch native setup secret action with the login secret", async () => {
    expect.assertions(1);
    const dispatch = jest.fn();
    try {
      await fetchLogin(mockFetchLogin)(
        dispatch,
        "loginsecret",
        "username",
        "password"
      ).then(responce => expect(responce).toEqual("setupsecret_value"));
    } catch (e) {
      expect(e).toBeNull();
    }
  });

  it("should call setupSecret fail if the response has an error", async () => {
    const dispatch = jest.fn();
    const mockFetch = () =>
      Promise.resolve({
        status: 401,
        statusText: "server error"
      });
      try {
        await fetchLogin(mockFetch)(dispatch);
      } catch(e) {
        expect(e.message).toEqual("401");
      }
      expect(dispatch).toBeCalledTimes(0);
  });
});

const mockFetchLogin = () => {
  return Promise.resolve({
    status: 200,
    json: () => ({
      data: {
        setupsecret: "setupsecret_value"
      }
    })
  });
};

const mockFetchLoginSecret = () => {
  return Promise.resolve({
    status: 200,
    json: () => ({
      data: {
        loginsecret: "loginsecret_value"
      }
    })
  });
};
