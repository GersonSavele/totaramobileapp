import React from "react";
import Notifications from "@totara/features/notifications/Notifications";
import { MockedProvider } from "@apollo/react-testing";
import {
  notificationsMock,
  notificationsMockEmpty,
  notificationsMockError
} from "@totara/features/notifications/api/notifications.mock";
import { cleanup, render, act } from "@testing-library/react-native";
import wait from "waait";

describe("Notifications", () => {
  afterEach(cleanup);

  test("Should render loading", async () => {
    const tree = (
      <MockedProvider mocks={notificationsMock}>
        <Notifications navigation={{}} />
      </MockedProvider>
    );

    const { getByTestId } = render(tree);
    const loading = getByTestId("test_loading");
    expect(loading).toBeTruthy();
  });

  test("Should render error", async () => {
    const tree = (
      <MockedProvider mocks={notificationsMockError}>
        <Notifications navigation={{}} />
      </MockedProvider>
    );

    const { getByTestId } = render(tree);
    await act(async () => {
      await wait(0);
    });
    const loadingError = getByTestId("test_loadingError");
    expect(loadingError).toBeTruthy();
  });

  test("Should render empty list", async () => {
    const tree = (
      <MockedProvider mocks={notificationsMockEmpty}>
        <Notifications navigation={{}} />
      </MockedProvider>
    );

    const { getByTestId } = render(tree);
    await act(async () => {
      await wait(0);
    });
    const emptyListContainer = getByTestId("test_notificationsEmptyContainer");
    expect(emptyListContainer).toBeTruthy();
  });

  test("Should render result list", async () => {
    const tree = (
      <MockedProvider mocks={notificationsMock}>
        <Notifications navigation={{}} />
      </MockedProvider>
    );

    const { getByTestId } = render(tree);
    await act(async () => {
      await wait(0);
    });
    const notificationsList = getByTestId("test_notificationsList");
    expect(notificationsList).toBeTruthy();
  });
});
