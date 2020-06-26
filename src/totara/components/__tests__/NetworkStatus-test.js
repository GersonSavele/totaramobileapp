import React from "react";
import { render } from "@testing-library/react-native";
import NetworkStatus from "@totara/components/NetworkStatus";
import { useNetInfo } from "@react-native-community/netinfo";

const offlineState = {
  isConnected: false,
  isInternetReachable: false
};

const onlineState = {
  isConnected: true,
  isInternetReachable: true
};

describe("NetworkStatus", () => {
  test("Should render as offline state", () => {
    useNetInfo.mockReturnValue(offlineState);
    const tree = <NetworkStatus />;
    const { getByTestId } = render(tree);
    const container = getByTestId("test_container");

    expect(container.children.length).toBe(1);
  });

  test("Should render as online state", () => {
    useNetInfo.mockReturnValue(onlineState);
    const tree = <NetworkStatus />;
    const { getByTestId } = render(tree);
    const container = getByTestId("test_container");

    expect(container.children.length).toBe(0);
  });
});
