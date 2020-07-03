import React from "react";
import Notifications from "@totara/features/notifications/Notifications";
import { MockedProvider } from "@apollo/react-testing";
import {
  cleanup,
  render,
  act,
  fireEvent,
  getAllByTestId,
  getByTestId
} from "@testing-library/react-native";
import wait from "waait";

import {
  notificationsMock,
  notificationsMockEmpty,
  notificationsMockError,
  notificationsMockUnRead
} from "@totara/features/notifications/api/notifications.mock";
import { fontWeights } from "@totara/theme/constants";
import { notificationQueryMarkRead } from "@totara/features/notifications/api";

const createTestPropsWithNavigation = (props: Object) => ({
  navigation: {
    navigate: jest.fn(),
    dispatch: jest.fn(),
    addListener: () => {
      return {
        remove: jest.fn()
      };
    }
  },
  ...props
});

describe("Notifications", () => {
  afterEach(cleanup);

  test("Should render loading", async () => {
    const tree = (
      <MockedProvider mocks={notificationsMock}>
        <Notifications {...createTestPropsWithNavigation()} />
      </MockedProvider>
    );

    const { getByTestId } = render(tree);
    const loading = getByTestId("test_loading");
    expect(loading).toBeTruthy();
  });

  test("Should render error", async () => {
    const tree = (
      <MockedProvider mocks={notificationsMockError}>
        <Notifications {...createTestPropsWithNavigation()} />
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
        <Notifications {...createTestPropsWithNavigation()} />
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
        <Notifications {...createTestPropsWithNavigation()} />
      </MockedProvider>
    );

    const { getByTestId } = render(tree);
    await act(async () => {
      await wait(0);
    });
    const notificationsList = getByTestId("test_notificationsList");
    expect(notificationsList).toBeTruthy();
  });

  test("Should render unread item", async () => {
    const tree = (
      <MockedProvider mocks={notificationsMockUnRead}>
        <Notifications {...createTestPropsWithNavigation()} />
      </MockedProvider>
    );

    const { getAllByTestId: getAllByTestIdFromBase } = render(tree);
    await act(async () => {
      await wait(0);
    });
    const unReadItem1 = getAllByTestIdFromBase("test_notificationItem")[0];
    const title1 = getAllByTestId(unReadItem1, "test_title")[0];

    const fontWeight = title1.props.style[0].fontWeight;
    expect(fontWeight).toBe(fontWeights.fontWeightBold);
  });

  test("Should should toggle selectable and be able to select", async () => {
    const tree = (
      <MockedProvider mocks={notificationsMockUnRead}>
        <Notifications {...createTestPropsWithNavigation()} />
      </MockedProvider>
    );

    const { getAllByTestId } = render(tree);
    await act(async () => {
      await wait(0);
    });
    const unReadItem1 = getAllByTestId("test_notificationItem")[0];
    fireEvent.longPress(unReadItem1);

    await act(async () => {
      await wait(0);
    });

    const unReadItemNewState = getAllByTestId("test_notificationItem")[0];

    const testCheckbox = getByTestId(unReadItemNewState, "test_checkbox");
    expect(testCheckbox).toBeTruthy();

    fireEvent.press(unReadItemNewState);
  });

  test("Should mark as read", async () => {
    const mocks = [
      ...notificationsMockUnRead,
      {
        request: {
          query: notificationQueryMarkRead,
          variables: {
            input: {
              message_ids: ["1"]
            }
          }
        },
        newData: jest.fn(() => {
          return { data: { ...notificationsMock[0].result.data } };
        })
      }
    ];

    const tree = (
      <MockedProvider mocks={mocks}>
        <Notifications {...createTestPropsWithNavigation()} />
      </MockedProvider>
    );

    const { getAllByTestId } = render(tree);
    await act(async () => {
      await wait(0);
    });
    const unReadItem1 = getAllByTestId("test_notificationItem")[0];

    fireEvent.press(unReadItem1);
    await act(async () => {
      await wait(0);
      const readMutation = mocks[1].newData;
      await expect(readMutation).toHaveBeenCalledTimes(1);
    });
  });
});
