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
import { MockedProvider } from "@apollo/react-testing";
import * as ReactRedux from "react-redux";
import { act } from "react-test-renderer";
import wait from "waait";
import { render } from "@testing-library/react-native";
import { useApolloClient } from "@apollo/react-hooks";

import { ResourceState } from "@totara/types/Resource";
import { downloadsTwoItemsMock } from "@totara/features/downloads/__mocks__/downloadMock";
import ScormActivity, {
  headerDispatch,
  apiDataEffect,
  onRefresh,
  navigationOptions,
  resourceListEffect
} from "../ScormActivity";
import { scormSuccessMock } from "../api/scorm.mock";
import { AuthContext } from "@totara/core";
import { SCORM_TEST_IDS } from "../constants";
import * as storageUtils from "../storageUtils";

const { SUMMARY_ID, LOADING_ID } = SCORM_TEST_IDS;

describe("ScormActivity", () => {
  const authContextState = {
    appState: {
      host: "http://site.url",
      apiKey: "api_key"
    }
  };
  const navigation = {
    state: {
      params: {
        id: 1,
        title: "title"
      }
    },
    navigate: jest.fn(),
    dispatch: jest.fn(),
    addListener: () => {
      return {
        remove: jest.fn()
      };
    }
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("Should render loading component initially, when it recieve responce it should show scorm summary", async (done) => {
    jest.spyOn(ReactRedux, "useSelector").mockImplementation(() => {
      return downloadsTwoItemsMock;
    });
    const tree = (
      <AuthContext.Provider
        value={{
          authContextState
        }}>
        <MockedProvider mocks={scormSuccessMock}>
          <ScormActivity navigation={navigation} />
        </MockedProvider>
      </AuthContext.Provider>
    );
    const { getByTestId } = render(tree);

    const viewLoading = await getByTestId(LOADING_ID);
    expect(viewLoading).toBeTruthy();

    await act(async () => {
      await wait(0);
    });
    const view = await getByTestId(SUMMARY_ID);
    expect(view).toBeTruthy();
    done();
  });
});

describe("headerDispatch", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockDispatch = jest.fn();
  it("should call passing dispatch function with merging passing data and SCORM_ROOT key", () => {
    headerDispatch({ data: "data" }, mockDispatch);
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });
});

describe("apiDataEffect", () => {
  const setScormBundleMock = jest.fn();
  const apiDataMock = { scorm: { id: "18", name: "mock name" } };
  const client = useApolloClient();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call setScormBundle with api data if there is no offlineAttempts", () => {
    const spy = jest.spyOn(storageUtils, "getOfflineActivity");
    spy.mockReturnValue(undefined);
    apiDataEffect({
      data: apiDataMock,
      client,
      id: "18",
      scormBundle: undefined,
      setScormBundle: setScormBundleMock
    })();
    expect(setScormBundleMock).toHaveBeenCalledTimes(1);
    expect(setScormBundleMock).toHaveBeenCalledWith(apiDataMock);
  });

  it("should call setScormBundle with merging offlineAttempts data", () => {
    const offlineAttemptsMock = ["offline attemps"];
    const spy = jest.spyOn(storageUtils, "getOfflineActivity");
    spy.mockReturnValue(offlineAttemptsMock);

    apiDataEffect({
      data: apiDataMock,
      client,
      id: "18",
      scormBundle: undefined,
      setScormBundle: setScormBundleMock
    })();
    expect(setScormBundleMock).toHaveBeenCalledTimes(1);
    expect(setScormBundleMock).toHaveBeenCalledWith({
      ...apiDataMock,
      offlineAttempts: offlineAttemptsMock
    });
  });

  it("should not call setScormBundle if there is no api data", () => {
    const offlineAttemptsMock = ["offline attemps"];
    const spy = jest.spyOn(storageUtils, "getOfflineActivity");
    spy.mockReturnValue(offlineAttemptsMock);

    apiDataEffect({
      data: undefined,
      client,
      id: "18",
      scormBundle: undefined,
      setScormBundle: setScormBundleMock
    })();
    expect(setScormBundleMock).not.toHaveBeenCalled();
  });
});
describe("onRefresh", () => {
  const setScormBundleMock = jest.fn();
  const scormBundleMock = { scorm: { id: "18", name: "mock name" } };
  const client = useApolloClient();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call refetch, if isInternetReachable true", () => {
    const offlineAttemptsMock = ["offline attemps"];
    const refetchMock = jest.fn();
    const spy = jest.spyOn(storageUtils, "getOfflineActivity");
    spy.mockReturnValue(offlineAttemptsMock);

    onRefresh({
      client,
      isInternetReachable: true,
      id: "18",
      scormBundle: scormBundleMock,
      setScormBundle: setScormBundleMock,
      refetch: refetchMock
    })();
    expect(refetchMock).toHaveBeenCalledTimes(1);
  });
  it("should call setScormBundle with merging offline attempts and scormBundle, if isInternetReachable false", () => {
    const offlineAttemptsMock = ["offline attemps"];
    const refetchMock = jest.fn();
    const spy = jest.spyOn(storageUtils, "getOfflineActivity");
    spy.mockReturnValue(offlineAttemptsMock);

    onRefresh({
      client,
      isInternetReachable: false,
      id: "18",
      scormBundle: scormBundleMock,
      setScormBundle: setScormBundleMock,
      refetch: refetchMock
    })();
    expect(setScormBundleMock).toHaveBeenCalledTimes(1);
    expect(setScormBundleMock).toHaveBeenCalledWith({
      ...scormBundleMock,
      offlineAttempts: offlineAttemptsMock
    });
  });
});

describe("navigationOptions", () => {
  const backActionMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should set headerRight, if onDownloadPress is defined.", () => {
    const onDownloadPressMock = jest.fn();
    const navigationDataMock = {
      state: {
        params: {
          id: "18",
          title: "Title value",
          backIcon: "times",
          backAction: backActionMock,
          downloadProgress: 20,
          downloadState: ResourceState.Downloading,
          onDownloadPress: onDownloadPressMock
        }
      }
    };

    const result = navigationOptions({
      navigation: navigationDataMock
    });
    expect(result.headerLeft).toBeTruthy();
    expect(result.title).toBe(navigationDataMock.state.params.title);
    expect(result.headerRight).toBeTruthy();
  });

  it("should not set headerRight, if onDownloadPress is not defined.", () => {
    const navigationDataMock = {
      state: {
        params: {
          id: "18",
          title: "Title value",
          backIcon: "times",
          backAction: backActionMock
        }
      }
    };

    const result = navigationOptions({
      navigation: navigationDataMock
    });
    expect(result.headerLeft).toBeTruthy();
    expect(result.title).toBe(navigationDataMock.state.params.title);
    expect(result.headerRight).toBeUndefined();
  });
});

describe("resourceListEffect", () => {
  const idMock = "18";
  const resourceListMock = [
    {
      customId: idMock,
      state: ResourceState.Downloading,
      bytesDownloaded: 80,
      sizeInBytes: 100,
      title: "tile_mock"
    }
  ];
  const apiKeyMock = "api_key";
  const setResourceStateMock = jest.fn();
  const dispatchMock = jest.fn();
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call setResourceState, if offlineAttemptsAllowed is true and packageUrl is defined.", () => {
    resourceListEffect({
      scorm: {
        offlineAttemptsAllowed: true,
        packageUrl: "https://package.url"
      },
      resourceList: resourceListMock,
      id: idMock,
      apiKey: apiKeyMock,
      isInternetReachable: true,
      setResourceState: setResourceStateMock,
      navigation: { dispatch: dispatchMock }
    })();
    const selectedResource = resourceListMock.find((x) => x.customId === idMock);
    expect(setResourceStateMock).toHaveBeenCalledTimes(1);
    expect(setResourceStateMock).toHaveBeenCalledWith(selectedResource.state);
  });

  it("should call setResourceState, if offlineAttemptsAllowed is true and packageUrl is defined.", () => {
    resourceListEffect({
      scorm: {
        offlineAttemptsAllowed: true,
        packageUrl: "https://package.url"
      },
      resourceList: [],
      id: idMock,
      apiKey: apiKeyMock,
      isInternetReachable: true,
      setResourceState: setResourceStateMock,
      navigation: { dispatch: dispatchMock }
    })();
    expect(setResourceStateMock).toHaveBeenCalledTimes(1);
    expect(setResourceStateMock).toHaveBeenCalledWith(undefined);
  });

  it("should not call setResourceState, if scorm is undefined of offlineAttemptsAllowed is undefined/false or packageUrl is undefined.", () => {
    resourceListEffect({
      scorm: {
        offlineAttemptsAllowed: false,
        packageUrl: "https://package.url"
      },
      resourceList: resourceListMock,
      id: idMock,
      apiKey: apiKeyMock,
      isInternetReachable: true,
      setResourceState: setResourceStateMock,
      navigation: { dispatch: dispatchMock }
    })();
    expect(setResourceStateMock).not.toBeCalled();

    resourceListEffect({
      scorm: {
        offlineAttemptsAllowed: true
      },
      resourceList: resourceListMock,
      id: idMock,
      apiKey: apiKeyMock,
      isInternetReachable: true,
      setResourceState: setResourceStateMock,
      navigation: { dispatch: dispatchMock }
    })();
    expect(setResourceStateMock).not.toBeCalled();

    resourceListEffect({
      resourceList: resourceListMock,
      id: idMock,
      apiKey: apiKeyMock,
      isInternetReachable: true,
      setResourceState: setResourceStateMock,
      navigation: { dispatch: dispatchMock }
    })();
    expect(setResourceStateMock).not.toBeCalled();
  });
});
