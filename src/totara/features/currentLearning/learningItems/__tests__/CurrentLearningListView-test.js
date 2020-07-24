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
