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
 */

import React from "react";
import { MockedProvider } from "@apollo/react-testing";
import { cleanup, render, act } from "@testing-library/react-native";
import wait from "waait";

import {
  programMock,
  programMockEmpty,
  programMockError
} from "../api/Programs.mock";
import CourseGroupDetails from "../CourseGroupDetails";

const navigation = {
  state: {
    params: {
      targetId: 5
    }
  }
};

describe("Program graphQL", () => {
  afterEach(cleanup);
  test("Should render loading", async () => {
    const tree = (
      <MockedProvider mocks={programMockEmpty}>
        <CourseGroupDetails navigation={navigation} />
      </MockedProvider>
    );

    const { getByTestId } = render(tree);
    const loading = getByTestId("test_loading");
    expect(loading).toBeTruthy();
  });

  test("Should render error", async () => {
    const tree = (
      <MockedProvider mocks={programMockError}>
        <CourseGroupDetails navigation={navigation} />
      </MockedProvider>
    );

    const { getByTestId } = render(tree);
    await act(async () => {
      await wait(0);
    });
    const loadingError = getByTestId("test_error");
    expect(loadingError).toBeTruthy();
  });

  test("Should render program", async () => {
    const tree = (
      <MockedProvider mocks={programMock}>
        <CourseGroupDetails navigation={navigation} />
      </MockedProvider>
    );

    const { getByTestId } = render(tree);
    await act(async () => {
      await wait(0);
    });

    const programDetailsContainer = getByTestId("test_data");
    expect(programDetailsContainer).toBeTruthy();
  });
});
