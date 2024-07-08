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
import { MockedProvider } from "@apollo/client/testing";
import { render, screen, act } from "@testing-library/react-native";
import wait from "waait";

import { programMock, certificationMock, mockEmpty, mockError } from "../api/courseGroup.mock";
import CourseGroupDetails from "../CourseGroupDetails";

const navigation = {};

const routeProgram = { 
  params: { 
    targetId: 5,
    courseGroupType: "program"
  }
};

const routeCert = { 
  params: { 
    targetId: 5,
    courseGroupType: "certification"
  }
};

describe("CourseGroupDetails", () => {
  test("Should render loading", async () => {
    const tree = (
      <MockedProvider mocks={mockEmpty} addTypename={false}>
        <CourseGroupDetails navigation={navigation} route={routeProgram} />
      </MockedProvider>
    );

    const { getByTestId } = render(tree);
    const loading = getByTestId("test_loading");
    expect(loading).toBeTruthy();
  });

  test("Should render error", async () => {
    const tree = (
      <MockedProvider mocks={mockError}>
        <CourseGroupDetails navigation={navigation} route={routeProgram} />
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
        <CourseGroupDetails navigation={navigation} route={routeProgram} />
      </MockedProvider>
    );

    const { getByTestId } = render(tree);
    await act(async () => {
      await wait(0);
    });

    const programDetailsContainer = getByTestId("test_error");
    expect(programDetailsContainer).toBeTruthy();
  });

  test("Should render certificate", async () => {
    const tree = (
      <MockedProvider mocks={certificationMock}>
        <CourseGroupDetails navigation={navigation} route={routeCert} />
      </MockedProvider>
    );
    render(tree);
    const programDetailsContainer = await screen.findByTestId("test_loading");
    expect(programDetailsContainer).toBeTruthy();
  });
});
