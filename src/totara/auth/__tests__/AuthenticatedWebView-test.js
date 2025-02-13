/**
 * This file is part of Totara Enterprise.
 *
 * Copyright (C) 2021 onwards Totara Learning Solutions LTD
 *
 * Totara Enterprise is provided only to Totara Learning Solutions
 * LTD’s customers and partners, pursuant to the terms and
 * conditions of a separate agreement with Totara Learning
 * Solutions LTD or its affiliate.
 *
 * If you do not have an agreement with Totara Learning Solutions
 * LTD, you may not access, use, modify, or distribute this software.
 * Please contact [sales@totaralearning.com] for more information.
 */

import { render, act, cleanup } from "@testing-library/react-native";
import React from "react";
import wait from "waait";
import { AuthenticatedWebViewComponent } from "../AuthenticatedWebView";
import { TEST_IDS } from "@totara/lib/testIds";

afterEach(cleanup);

describe("AuthenticatedWebview", () => {
  const onLoginSuccessMock = jest.fn();
  const onLoginFailureMock = jest.fn();
  const useRefSpy = jest.spyOn(React, "useRef").mockReturnValue({ current: null });
  const hostMock = "https://mobile.demo.totara.software/new";
  const uriMock = "https://mobile.demo.totara.software";

  test("Should render Loading for the intial state", async () => {
    const tree = (
      <AuthenticatedWebViewComponent
        host={hostMock}
        uri={uriMock}
        ref={useRefSpy}
        onNavigationStateChange={onLoginSuccessMock}
        onShouldStartLoadWithRequest={onLoginFailureMock}
        deleteWebview={jest.fn(() => Promise.resolve({}))}
        createWebview={jest.fn(() => Promise.resolve({ data: { create_webview: "create_webview" } }))}
      />
    );
    const { getByTestId } = render(tree);
    await expect(getByTestId(TEST_IDS.LOADING)).toBeTruthy();
  });

  // when I enable this test - remove the skip -, I get "TypeError: cleanupRef.current is not a function".
  // Only happens after the upgrade, therefore it might be a bug from jest
  test.skip("Should render loading error when authentication failed", async () => {
    const mockCreateWebviewReject = jest.fn(() => Promise.reject("error"));
    const tree = (
      <AuthenticatedWebViewComponent
        host={hostMock}
        uri={uriMock}
        ref={useRefSpy}
        onNavigationStateChange={onLoginSuccessMock}
        onShouldStartLoadWithRequest={onLoginFailureMock}
        createWebview={mockCreateWebviewReject}
        deleteWebview={jest.fn(() => Promise.resolve({}))}
      />
    );
    const { getByTestId } = render(tree);
    await act(async () => {
      await wait(0);
    });
    expect(getByTestId(TEST_IDS.LOADING_ERROR)).toBeTruthy();
  });

  test("Should render webview ", async () => {
    const mockCreateWebviewResolve = jest.fn(() => Promise.resolve({ data: { create_webview: "mocked_secret" } }));
    const tree = (
      <AuthenticatedWebViewComponent
        host={hostMock}
        uri={uriMock}
        ref={useRefSpy}
        onNavigationStateChange={onLoginSuccessMock}
        onShouldStartLoadWithRequest={onLoginFailureMock}
        createWebview={mockCreateWebviewResolve}
        deleteWebview={jest.fn(() => Promise.resolve({}))}
      />
    );
    const { getByTestId } = render(tree);
    await act(async () => {
      await wait(0);
    });
    expect(getByTestId(TEST_IDS.AUTHENTICATED_WEBVIEW)).toBeTruthy();
  });
});
