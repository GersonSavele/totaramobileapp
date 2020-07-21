/**
 * This file is part of Totara Enterprise.
 *
 * Copyright (C) 2020 onwards Totara Learning Solutions LTD
 *
 * Totara Enterprise is provided only to Totara Learning Solutions
 * LTD’s customers and partners, pursuant to the terms and
 * conditions of a separate agreement with Totara Learning
 * Solutions LTD or its affiliate.
 *
 * If you do not have an agreement with Totara Learning Solutions
 * LTD, you may not access, use, modify, or distribute this software.
 * Please contact [sales@totaralearning.com] for more information.
 *
 * @author: Kamala Tennakoon <kamala.tennakoon@totaralearning.com>
 */
import React from "react";
import { MockedProvider } from "@apollo/react-testing";
import * as ReactRedux from "react-redux";
import { act } from "react-test-renderer";
import wait from "waait";
import { render } from "@testing-library/react-native";

import { downloadsTwoItemsMock } from "@totara/features/downloads/__mocks__/downloadMock";
import ScormActivity from "../ScormActivity";
import { scormSuccessMock } from "../api/scorm.mock";
import { AuthContext } from "@totara/core";

describe("ScormActivity", () => {
  const authContextState = {
    appState: {
      host: "http://site.url",
      apiKey: "api_key"
    }
  };
  const navigation = {
    state: {
      params: {
        id: 1,
        title: "title"
      }
    },
    navigate: jest.fn(),
    dispatch: jest.fn(),
    addListener: () => {
      return {
        remove: jest.fn()
      };
    }
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("Should render loading component iniiiallly, when it recieve responce it should show scorm summary", async (done) => {
    jest.spyOn(ReactRedux, "useSelector").mockImplementation(() => {
      return downloadsTwoItemsMock;
    });
    const tree = (
      <AuthContext.Provider
        value={{
          authContextState
        }}>
        <MockedProvider mocks={scormSuccessMock}>
          <ScormActivity navigation={navigation} />
        </MockedProvider>
      </AuthContext.Provider>
    );
    const { getByTestId } = render(tree);

    const viewLoading = getByTestId("scorm_loading");
    expect(viewLoading).toBeTruthy();

    await act(async () => {
      await wait(0);
    });
    const view = getByTestId("scorm_summary");
    expect(view).toBeTruthy();
    done();
  });
});
