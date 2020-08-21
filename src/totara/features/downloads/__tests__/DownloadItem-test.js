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

import { act, fireEvent, render } from "@testing-library/react-native";
import React from "react";
import DownloadItem from "@totara/features/downloads/DownloadItem";
import {
  downloadItemMockAdded,
  downloadItemMockAddedWithKilo
} from "@totara/features/downloads/__mocks__/downloadMock";
import { ResourceState } from "@totara/types/Resource";
import wait from "waait";

describe("DownloadItem", () => {
  it("Should render DownloadItem added, with name, size in megabytes", () => {
    const itemMega = { ...downloadItemMockAdded };

    const { getByTestId } = render(<DownloadItem item={itemMega} />);

    const test_DownloadItemItemID = getByTestId("test_DownloadItemItemID");
    expect(test_DownloadItemItemID.props.testID).toBe("test_DownloadItemItemID");

    const test_DownloadItemName = getByTestId("test_DownloadItemName");
    expect(test_DownloadItemName.children[0]).toBe(itemMega.name);

    //TEST FOR MEGA
    const test_DownloadItemSize = getByTestId("test_DownloadItemSize");
    expect(test_DownloadItemSize.children[0]).toBe("1.00MB");
  });

  it("Should render DownloadItem size in kilobytes", () => {
    const itemKilo = { ...downloadItemMockAddedWithKilo };
    const { getByTestId } = render(<DownloadItem item={itemKilo} />);
    const test_DownloadItemSizeKilo = getByTestId("test_DownloadItemSize");
    expect(test_DownloadItemSizeKilo.children[0]).toBe("10KB");
  });

  it("Should render DownloadItem with no size defined", () => {
    const item = { ...downloadItemMockAdded, sizeInBytes: undefined };
    const { getByTestId } = render(<DownloadItem item={item} />);
    const test_DownloadItemSizeKilo = getByTestId("test_DownloadItemSize");
    expect(test_DownloadItemSizeKilo.children[0]).toBe("...");
  });

  it("Should render DownloadItem WITH NO select option", () => {
    const item = { ...downloadItemMockAdded };
    const { queryByTestId } = render(<DownloadItem item={item} />);
    expect(queryByTestId("test_DownloadItemSelectIcon")).toBeNull();
  });

  it("Should render DownloadItem WITH select option", () => {
    const item = { ...downloadItemMockAdded };
    const { getByTestId } = render(<DownloadItem item={item} selectable={true} />);
    expect(getByTestId("test_DownloadItemSelectIcon")).toBeTruthy();
  });

  it("Should render DownloadItem with downloading state", () => {
    const item = { ...downloadItemMockAdded, state: ResourceState.Downloading };
    const { getByTestId } = render(<DownloadItem item={item} />);

    expect(getByTestId("test_DownloadItemResourceDownloader")).toBeTruthy();
  });

  it("Should press DownloadItem and onItemPressCallback called once ", async () => {
    const item = { ...downloadItemMockAdded };

    const onItemPressCallback = jest.fn();
    const { getByTestId } = render(
      <DownloadItem item={item} onItemPress={onItemPressCallback} testID={"test_DownloadItem"} />
    );

    fireEvent.press(getByTestId("test_DownloadItem"));
    await act(async () => {
      await wait(0);
    });
    await expect(onItemPressCallback).toHaveBeenCalledTimes(1);
  });

  it("Should longPress DownloadItem and onItemPressCallback called once", async () => {
    const item = { ...downloadItemMockAdded };

    const onItemLongPressCallback = jest.fn();
    const { getByTestId } = render(
      <DownloadItem item={item} onItemLongPress={onItemLongPressCallback} testID={"test_DownloadItem"} />
    );

    fireEvent.longPress(getByTestId("test_DownloadItem"));
    await act(async () => {
      await wait(0);
    });
    await expect(onItemLongPressCallback).toHaveBeenCalledTimes(1);
  });
});
