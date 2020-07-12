import { act, cleanup, fireEvent, render } from "@testing-library/react-native";
import React from "react";
import AboutStack from "@totara/features/about/AboutStack";
import wait from "waait";
import About from "@totara/features/about/About";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

const navigationMock = {
  navigation: {
    navigate: jest.fn()
  }
};

const renderWithNavigation = () => {
  const App = createAppContainer(AboutStack);
  return {
    ...render(<App />)
  };
};

describe("About", () => {
  afterEach(cleanup);

  test("Should render with AboutStack", async () => {
    const { baseElement } = renderWithNavigation();

    await act(async () => {
      await wait(0);
    });

    expect(baseElement).toBeTruthy();
  });

  test("Should render About view", async () => {
    const { baseElement } = render(<About />);

    await act(async () => {
      await wait(0);
    });

    expect(baseElement).toBeTruthy();
  });
});
