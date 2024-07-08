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
import { View } from "react-native";
import * as ReactRedux from "react-redux";
import { render } from "@testing-library/react-native";
import { MockedProvider } from "@apollo/client/testing";
import WebViewWrapper from "../WebViewWrapper";
import { AuthenticatedWebView } from "../AuthenticatedWebView";

jest.mock('../AuthenticatedWebView', () => (
  { 
    AuthenticatedWebView: jest.fn()
  }
));

describe("WebViewWrapper", () => {
  beforeAll(() => {
    jest.spyOn(ReactRedux, "useSelector").mockImplementation(() => ({}));
    AuthenticatedWebView.mockImplementation(() => (<View testID="my-authenticated-web-view"></View>))
  });

  it("Should render WebViewWrapper view", async () => {
    const { getByTestId } = render(
      <MockedProvider mocks={[]} addTypename={false}>
        <WebViewWrapper />
      </MockedProvider>
    );
    expect(getByTestId("my-authenticated-web-view")).toBeTruthy();
  });
});
