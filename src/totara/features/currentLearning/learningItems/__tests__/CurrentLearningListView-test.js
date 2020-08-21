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
import { act, render } from "@testing-library/react-native";
import CurrentLearningListView from "@totara/features/currentLearning/learningItems/CurrentLearningListView";
import { currentLearningItemExample } from "@totara/features/currentLearning/learningItems/__mocks__/currentLearningListView.mock";
import wait from "waait";

const navigation = {
  navigation: {
    navigate: jest.fn()
  }
};

describe("CurrentLearningListView", () => {
  it("Should render CurrentLearningListView with one item", async () => {
    const { getAllByTestId } = render(
      <CurrentLearningListView
        loading={false}
        navigation={navigation}
        onRefresh={() => {}}
        currentLearning={[currentLearningItemExample]}
      />
    );

    await act(async () => {
      await wait(0);
    });

    const listViewItem = getAllByTestId("test_currentLearningListViewItem");
    expect(listViewItem.length).toBe(1);
  });
});
