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
import React from "react";
import NativeLogin from "../NativeLogin";
import { render } from "@testing-library/react-native";
import * as coreSession from "@totara/core";
import * as ReactRedux from "react-redux";
import * as nativeFlow from "../NativeFlowHook";
import { NATIVE_LOGIN_TEST_IDS } from "@totara/lib/testIds";

jest.mock("@totara/core", () => ({
  useSession: () => ({}),
  coreUtils: () => ({}),
}))

describe("NativeLogin", () => {
  beforeAll(() => {
    jest.spyOn(ReactRedux, "useDispatch").mockImplementation(() => jest.fn());
    coreSession.useSession = () => ({ host: "MOCKED-HOST", setupHost: jest.fn() });
    global.fetch = jest.fn().mockImplementation(() => jest.fn());
  });

  it("should render NativeLogin view without InforModal", async () => {
    const { root, queryByTestId } = render(<NativeLogin />);
    expect(root).toBeTruthy();
    expect(queryByTestId(NATIVE_LOGIN_TEST_IDS.UNHANDLED_ERROR)).toBeNull();
  });

  it("should render InforModal for error state", async () => {
    jest
      .spyOn(nativeFlow, "useNativeFlow")
      .mockReturnValue(() => ({ nativeLoginState: { unhandledLoginError: true } }));
    const { root, getByTestId } = render(<NativeLogin />);
    expect(root).toBeTruthy();
    expect(getByTestId(NATIVE_LOGIN_TEST_IDS.UNHANDLED_ERROR)).toBeTruthy();
  });
});
