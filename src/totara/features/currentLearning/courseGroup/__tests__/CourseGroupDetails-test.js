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
import * as Navigation from '@/src/totara/lib/hooks';

const routeProgram = {
  targetId: 5,
  courseGroupType: 'program'
};

const routeCert = {
  targetId: 5,
  courseGroupType: 'certification'
};

describe("CourseGroupDetails", () => {
  test("Should render loading", async () => {
    jest.spyOn(Navigation, 'useParams').mockImplementation(() => routeProgram);

    const tree = (
      <MockedProvider mocks={mockEmpty} addTypename={false}>
        <CourseGroupDetails />
      </MockedProvider>
    );

    const { getByTestId } = render(tree);
    const loading = getByTestId("test_loading");
    expect(loading).toBeTruthy();
  });

  test("Should render error", async () => {
    jest.spyOn(Navigation, 'useParams').mockImplementation(() => routeProgram);

    const tree = (
      <MockedProvider mocks={mockError}>
        <CourseGroupDetails/>
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
    jest.spyOn(Navigation, 'useParams').mockImplementation(() => routeProgram);

    const tree = (
      <MockedProvider mocks={programMock}>
        <CourseGroupDetails />
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
    jest.spyOn(Navigation, 'useParams').mockImplementation(() => routeCert);
    const tree = (
      <MockedProvider mocks={certificationMock}>
        <CourseGroupDetails />
      </MockedProvider>
    );
    render(tree);
    const programDetailsContainer = await screen.findByTestId("test_loading");
    expect(programDetailsContainer).toBeTruthy();
  });
});
