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
import { useNativeLogin, nativeReducer } from "../NativeLoginHook";

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
  });
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

  it("should handle loginfailed", () => {
    const state = {
      isRequestingLogin: true,
      errorStatusUnauthorized: false
    };
    const action = {
      type: "loginfailed",
      payload: undefined
    };
    const newState = nativeReducer(state, action);

    expect(newState.isRequestingLogin).toBeFalsy();
    expect(newState.errorStatusUnauthorized).toBeTruthy();
  });

  it("should handle resetform", () => {
    const state = {
      errorStatusUnauthorized: true
    };
    const action = {
      type: "resetform",
      payload: undefined
    };
    const newState = nativeReducer(state, action);

    expect(newState.errorStatusUnauthorized).toBeFalsy();
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
