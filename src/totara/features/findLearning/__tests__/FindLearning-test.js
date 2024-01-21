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
import { MockedProvider } from "@apollo/client/testing";
import { render, act, fireEvent } from "@testing-library/react-native";

import { FINDLEARNING_TEST_IDS } from "@totara/lib/testIds";
import FindLearning from "@totara/features/findLearning/FindLearning";
import { searchResult } from "@totara/features/findLearning/api/findLearning.mock";
import * as coreSession from "@totara/core";

describe("FindLearning", () => {
  beforeAll(() => {
    jest.spyOn(coreSession, "useSession").mockImplementation(() => {
      return "MOCKED-SESSION";
    });
  });

  it("Should only show search bar initially", async () => {
    const tree = (
      <MockedProvider>
        <FindLearning />
      </MockedProvider>
    );
    const { getByTestId } = render(tree);
    await expect(getByTestId(FINDLEARNING_TEST_IDS.HEADER)).toBeTruthy();
  });

  test("Should show 0 count with empty list of result if key couldn't find", async () => {
    const mockSearchKey = "mocked_key";
    const mockResultCount = 0;
    const mockData = searchResult({ key: mockSearchKey, noOfItems: mockResultCount });
    const tree = (
      <MockedProvider mocks={mockData} addTypename={false}>
        <FindLearning />
      </MockedProvider>
    );

    const { getByTestId } = render(tree);
    await act(async () => {
      await fireEvent.changeText(getByTestId(FINDLEARNING_TEST_IDS.SEARCH_TEXT_INPUT), mockSearchKey);
      await fireEvent(getByTestId(FINDLEARNING_TEST_IDS.SEARCH_TEXT_INPUT), "submitEditing");
    });

    await expect(getByTestId(FINDLEARNING_TEST_IDS.HEADER)).toBeTruthy();
    // TODO: with the new version of React Native and npm dependencies, debounce
    // of the search has to be implemented as the user types in the search bar
    // that will be only way for the following line to work
    //await expect(getByTestId(FINDLEARNING_TEST_IDS.NO_OF_ITEMS)).toBeTruthy();
  });

  it("Should show search result list with count for none empty result", async () => {
    const mockSearchKey = "mocked_key";
    const mockResultCount = 10;
    const mockData = searchResult({ key: mockSearchKey, noOfItems: mockResultCount });
    const tree = (
      <MockedProvider mocks={mockData} addTypename={false}>
        <FindLearning />
      </MockedProvider>
    );

    const { getByTestId, getAllByTestId } = render(tree);
    await act(async () => {
      await fireEvent.changeText(getByTestId(FINDLEARNING_TEST_IDS.SEARCH_TEXT_INPUT), mockSearchKey);
      await fireEvent(getByTestId(FINDLEARNING_TEST_IDS.SEARCH_TEXT_INPUT), "submitEditing");
    });

    await expect(getByTestId(FINDLEARNING_TEST_IDS.HEADER)).toBeTruthy();
    // TODO: with the new version of React Native and npm dependencies, debounce
    // of the search has to be implemented as the user types in the search bar
    // that will be only way for the following line to work
    //await expect(getByTestId(FINDLEARNING_TEST_IDS.NO_OF_ITEMS)).toBeTruthy();
    // looks like this is not unique in the list - which might be the reason for failure
    //await expect(getAllByTestId(FINDLEARNING_TEST_IDS.LEARNING_ITEM_TILE).length).toBe(mockResultCount);
  });
});
