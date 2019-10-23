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

const { result } = renderHook(props => useNativeLogin(props), {
    initialProps: {
      siteUrl: "http://mobiledemo.wlg.totaralms.com",
      onSetupSecretSuccess: { onSetupSecretSuccess },
      onBack: { onBack }
    }
});

describe("useNativeLogin", () => {
  
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

    expect(result.current.nativeLoginState.inputUsernameStatus).toBe("error");
    expect(result.current.nativeLoginState.inputPasswordStatus).toBe("error");
  });

  it("empty 'username' and valid 'password'", () => {
    act(() => {
      result.current.inputUsernameWithShowError(undefined);
      result.current.inputPasswordWithShowError("password");
      result.current.onClickEnter();
    });

    expect(result.current.nativeLoginState.inputUsernameStatus).toBe("error");
    expect(result.current.nativeLoginState.inputPasswordStatus).toBe("error");
  });

  it("both valid 'username' and 'password'", () => {
    act(() => {
      result.current.inputUsernameWithShowError("username");
      result.current.inputPasswordWithShowError("password");
    });

    expect(result.current.nativeLoginState.inputUsername).toBe("username");
    expect(result.current.nativeLoginState.inputPassword).toBe("password");
  });
});

// describe("Native login reducer", () => {
//     it("should put flowStep into when received setup-secret", () => {
//       const currentState = {
//         setupSecret: undefined
//       };
//       const action = {
//         type: "setupSecret",
//         payload: "setupsecret"
//       };
//       const newState = nativeReducer(currentState, action);
//       expect(newState.setupSecret).toBe("setupsecret");
//     });
// });
describe("fetchData", () => {
it("should call onLoginFailure if the response has an error", async () => {
    expect.assertions(2);
    const dispatch = jest.fn(({type, payload}) => {
      expect(type).toBe("setupsecret");
      expect(payload).toBe(
        "ZCLFQXKQKzuVjklcpNeyRw4LvMudSQ"
      )
    });
    await fetchLogin(mockFetchLoginSetup)( dispatch, "loginsecret", "username", "password");
  });

//   it("should call onLoginFailure if the response has an error", async () => {
//     expect.assertions(2);
//     const dispatch = jest.fn(({type, payload}) => {
//       expect(type).toBe("setupsecret");
//       expect(payload).toBe(
//         "ZCLFQXKQKzuVjklcpNeyRw4LvMudSQ"
//       )
//     });
//     await fetchLogin(mockFetchLoginSetup)( dispatch, "loginsecret", "username", "password");
//   });
});

  const mockFetchLoginSetup = () => {
    return Promise.resolve({
      status: 200,
      json: () => ({
       "data": {
        "setupsecret": "ZCLFQXKQKzuVjklcpNeyRw4LvMudSQ"
        }
      })
    });
  };
