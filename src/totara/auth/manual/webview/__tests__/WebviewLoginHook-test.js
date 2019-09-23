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

import { useWebviewLogin } from "../WebviewLoginHook";
import { renderHook } from "@testing-library/react-hooks";
import { act } from "react-test-renderer";

describe("WebviewLoginHook", () => {
  it("initial props for the unsecured url(http://)", () => {
    const mockOnCancelWebviewLogin = jest.fn();
    const mockOnRecievedSetupSecret = jest.fn();
    const { result } = renderHook(props => useWebviewLogin(props), {
      initialProps: {
        siteUrl: "http://mobiledemo.wlg.totaralms.com",
        onCancelWebviewLogin: mockOnCancelWebviewLogin,
        onRecievedSetupSecret: mockOnRecievedSetupSecret
      }
    });
    expect(result.current.loginUrl).toBe(
      "http://mobiledemo.wlg.totaralms.com/login/index.php"
    );
    expect(result.current.navEndPoint).toBe(
      "mobiledemo.wlg.totaralms.com/login/index.php"
    );
    expect(result.current.navProtocol).toBe("http");
    expect(result.current.canWebGoBackward).toBeFalsy();
    expect(result.current.canWebGoForward).toBeFalsy();
  });

  it("initial props for the secured url(https://)", () => {
    const mockOnCancelWebviewLogin = jest.fn();
    const mockOnRecievedSetupSecret = jest.fn();
    const { result } = renderHook(props => useWebviewLogin(props), {
      initialProps: {
        siteUrl: "https://mobiledemo.wlg.totaralms.com",
        onCancelWebviewLogin: mockOnCancelWebviewLogin,
        onRecievedSetupSecret: mockOnRecievedSetupSecret
      }
    });
    expect(result.current.loginUrl).toBe(
      "https://mobiledemo.wlg.totaralms.com/login/index.php"
    );
    expect(result.current.navEndPoint).toBe(
      "mobiledemo.wlg.totaralms.com/login/index.php"
    );
    expect(result.current.navProtocol).toBe("https");
    expect(result.current.canWebGoBackward).toBeFalsy();
    expect(result.current.canWebGoForward).toBeFalsy();
  });

  it("Enable go back when navigate to another page in webview", () => {
    const mockOnCancelWebviewLogin = jest.fn();
    const mockOnRecievedSetupSecret = jest.fn();
    const { result } = renderHook(props => useWebviewLogin(props), {
      initialProps: {
        siteUrl: "https://mobiledemo.wlg.totaralms.com",
        onCancelWebviewLogin: mockOnCancelWebviewLogin,
        onRecievedSetupSecret: mockOnRecievedSetupSecret
      }
    });

    const webviewMessageEvent = {
      canGoBack: true,
      canGoForward: false,
      url: "https://mobiledemo.wlg.totaralms.com/tapped/firstlink"
    };

    act(() => {
      result.current.onLogViewNavigate(webviewMessageEvent);
    });

    expect(result.current.canWebGoBackward).toBeTruthy();
    expect(result.current.canWebGoForward).toBeFalsy();
    expect(result.current.navEndPoint).toBe(
      "mobiledemo.wlg.totaralms.com/tapped/firstlink"
    );
  });

  it("Enable go forward when came back from first tapped link in webview", () => {
    const mockOnCancelWebviewLogin = jest.fn();
    const mockOnRecievedSetupSecret = jest.fn();
    const { result } = renderHook(props => useWebviewLogin(props), {
      initialProps: {
        siteUrl: "https://mobiledemo.wlg.totaralms.com/tapped/firstlink",
        onCancelWebviewLogin: mockOnCancelWebviewLogin,
        onRecievedSetupSecret: mockOnRecievedSetupSecret
      }
    });
    const webviewMessageEvent = {
      canGoBack: false,
      canGoForward: true,
      url: "https://mobiledemo.wlg.totaralms.com"
    };
    act(() => {
      result.current.onLogViewNavigate(webviewMessageEvent);
    });
    expect(result.current.canWebGoBackward).toBeFalsy();
    expect(result.current.canWebGoForward).toBeTruthy();
    expect(result.current.navEndPoint).toBe("mobiledemo.wlg.totaralms.com");
  });

  it("Enable go back and forward in webview", () => {
    const mockOnCancelWebviewLogin = jest.fn();
    const mockOnRecievedSetupSecret = jest.fn();
    const { result } = renderHook(props => useWebviewLogin(props), {
      initialProps: {
        siteUrl: "https://mobiledemo.wlg.totaralms.com",
        onCancelWebviewLogin: mockOnCancelWebviewLogin,
        onRecievedSetupSecret: mockOnRecievedSetupSecret
      }
    });
    const webviewMessageEvent = {
      canGoBack: true,
      canGoForward: true,
      url: "https://mobiledemo.wlg.totaralms.com/mideofdeepedin"
    };
    act(() => {
      result.current.onLogViewNavigate(webviewMessageEvent);
    });
    expect(result.current.canWebGoBackward).toBeTruthy();
    expect(result.current.canWebGoForward).toBeTruthy();
    expect(result.current.navEndPoint).toBe(
      "mobiledemo.wlg.totaralms.com/mideofdeepedin"
    );
  });

  it("Handling the completion of successful login", () => {
    const mockOnCancelWebviewLogin = jest.fn();
    const mockOnRecievedSetupSecret = jest.fn();
    const { result } = renderHook(props => useWebviewLogin(props), {
      initialProps: {
        siteUrl: "https://mobiledemo.wlg.totaralms.com",
        onCancelWebviewLogin: mockOnCancelWebviewLogin,
        onRecievedSetupSecret: mockOnRecievedSetupSecret
      }
    });
    const webvieNativeEvent = {
      nativeEvent: {
        data: "setupsecret"
      }
    };
    act(() => {
      result.current.didReceiveOnMessage(webvieNativeEvent);
    });
    expect(mockOnRecievedSetupSecret).toBeCalledWith("setupsecret");
  });

  it("Handling the completion of login for invalid values", () => {
    const mockOnCancelWebviewLogin = jest.fn();
    const mockOnRecievedSetupSecret = jest.fn();
    const { result } = renderHook(props => useWebviewLogin(props), {
      initialProps: {
        siteUrl: "https://mobiledemo.wlg.totaralms.com",
        onCancelWebviewLogin: mockOnCancelWebviewLogin,
        onRecievedSetupSecret: mockOnRecievedSetupSecret
      }
    });
    const webvieNativeEventForNull = {
      nativeEvent: {
        data: "null"
      }
    };
    act(() => {
      result.current.didReceiveOnMessage(webvieNativeEventForNull);
    });
    expect(mockOnRecievedSetupSecret).not.toBeCalled();

    const webvieNativeEventForUndefined = {
      nativeEvent: {
        data: undefined
      }
    };
    act(() => {
      result.current.didReceiveOnMessage(webvieNativeEventForUndefined);
    });
    expect(mockOnRecievedSetupSecret).not.toBeCalled();
  });

  it("Exit from the webview-login event handling.", () => {
    const mockOnCancelWebviewLogin = jest.fn();
    const mockOnRecievedSetupSecret = jest.fn();
    const { result } = renderHook(props => useWebviewLogin(props), {
      initialProps: {
        siteUrl: "https://mobiledemo.wlg.totaralms.com",
        onCancelWebviewLogin: mockOnCancelWebviewLogin,
        onRecievedSetupSecret: mockOnRecievedSetupSecret
      }
    });

    act(() => {
      result.current.cancelLogin();
    });
    expect(mockOnCancelWebviewLogin).toBeCalledTimes(1);
  });
});