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
import { render, act } from "@testing-library/react-native";
import { EnrolmentModal } from "./../EnrolmentModal";
import { MockedProvider } from "@apollo/client/testing";
import { enrolmentOptionsMock, enrolmentOptionsMockError } from "./../api/enrolmentOptions.mock";
import wait from "waait";

const mockedNavigate = jest.fn();

jest.mock("@react-navigation/native", () => {
  return {
    ...jest.requireActual("@react-navigation/native"),
    useNavigation: () => ({
      navigate: mockedNavigate
    })
  };
});

describe("Enrolment Options", () => {
  test("Should render loading widget", async () => {
    const { getByTestId } = render(
      <MockedProvider mocks={enrolmentOptionsMock}>
        <EnrolmentModal />
      </MockedProvider>
    );

    const widget = getByTestId("loading_enrolment_data");
    expect(widget).toBeTruthy();
  });

  test("Should render loading error", async () => {
    const { getByTestId } = render(
      <MockedProvider mocks={enrolmentOptionsMockError}>
        <EnrolmentModal />
      </MockedProvider>
    );

    await act(async () => {
      await wait(0);
    });

    const widget = await getByTestId("loading_error");
    expect(widget).toBeTruthy();
  });
});
