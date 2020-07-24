import { act, cleanup, fireEvent, render } from "@testing-library/react-native";
import React from "react";
import DownloadsStack from "@totara/features/downloads";
import { createAppContainer } from "react-navigation";
import Downloads from "@totara/features/downloads/Downloads";
import * as ReactRedux from "react-redux";
import { downloadsOneItemMock, downloadsTwoItemsMock } from "@totara/features/downloads/__mocks__/downloadMock";
import wait from "waait";

// jest.mock("react-redux", () => ({
//   useSelector: jest.fn()
// }));

const renderWithAppContainer = () => {
  const App = createAppContainer(DownloadsStack);
  return {
    ...render(<App />)
  };
};

const navigationMock = {
  navigation: {
    navigate: jest.fn(),
    dispatch: jest.fn(),
    addListener: () => {
      return {
        remove: jest.fn()
      };
    }
  }
};

describe("Downloads", () => {
  afterEach(async () => {
    cleanup();
  });

  it("Should render DownloadsStack", () => {
    const { baseElement } = renderWithAppContainer();
    expect(baseElement).toBeTruthy();
  });

  it("Should render Downloads empty state", () => {
    jest.spyOn(ReactRedux, "useSelector").mockImplementation(() => {
      return [];
    });

    const { getByTestId } = render(<Downloads navigation={navigationMock.navigation} />);

    const test_DownloadsEmptyState = getByTestId("test_DownloadsEmptyState");
    expect(test_DownloadsEmptyState).toBeTruthy();
  });

  it("Should render Downloads with two items state", async () => {
    jest.spyOn(ReactRedux, "useSelector").mockImplementation(() => {
      return downloadsTwoItemsMock;
    });

    const { getAllByTestId } = render(<Downloads navigation={navigationMock.navigation} />);

    const testItems = getAllByTestId("test_DownloadsItem");
    expect(testItems.length).toBe(2);
  });

  it("Should item be able be pressed for navigation", async () => {
    const navigation = navigationMock.navigation;
    jest.spyOn(ReactRedux, "useSelector").mockImplementation(() => {
      return downloadsOneItemMock;
    });

    const { getByTestId } = render(<Downloads navigation={navigation} />);
    await act(async () => {
      await wait(0);
    });

    const itemTest = getByTestId("test_DownloadsItem");
    fireEvent.press(itemTest);

    expect(navigation.navigate).toBeCalled();
  });

  it("Should item be able be long pressed for select", async () => {
    const navigation = navigationMock.navigation;
    jest.spyOn(ReactRedux, "useSelector").mockImplementation(() => {
      return downloadsOneItemMock;
    });

    const { getByTestId } = render(<Downloads navigation={navigation} />);
    await act(async () => {
      await wait(0);
    });

    const itemTest = getByTestId("test_DownloadsItem");
    fireEvent.longPress(itemTest);
  });
});
