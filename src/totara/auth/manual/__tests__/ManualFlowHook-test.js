/**
 * This file is part of Totara Mobile
 *
 * Copyright (C) 2019 onwards Totara Learning Solutions LTD
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @author Jun Yamog <jun.yamog@totaralearning.com>
 */

import React from 'react';
import { renderHook, act } from "@testing-library/react-hooks";
import { useManualFlow, manualFlowReducer } from "../ManualFlowHook";
import { config } from "@totara/lib";
import BrowserLogin from '../browser';
import renderer from 'react-test-renderer';

describe("useManualFlow", () => {
  it("should be on step done when url and secret is valid", async () => {
    config.minApiVersion = "2019101802";
    const expectedOptions = {
      method: "POST",
      body: JSON.stringify({version: "UnknownVersion"})
    };

    const mockFetch = jest.fn(()=> {
        return Promise.resolve({
          auth: "webview",
          siteMaintenance: false,
          theme: {
            urlLogo: "https://mytotara.client.com/totara/mobile/logo.png",
            colorPrimary: "#CCFFCC"
          },
          version: "2019101802"
      });
    });

    const onLoginSuccess = jest.fn(setupSecret => {
      expect(setupSecret.uri).toBe("https://success.com");
      expect(setupSecret.secret).toBe("theSecret");
    });

    const { result, waitForNextUpdate } = renderHook(
      ({ onLoginSuccess }) =>
        useManualFlow(mockFetch)({ onLoginSuccess: onLoginSuccess }),
      { initialProps: { onLoginSuccess: onLoginSuccess } }
    );
    
    act(() => {
      result.current.onSiteUrlSuccess("https://success.com");
    });
    
    expect(mockFetch).toHaveBeenCalledWith("https://success.com/totara/mobile/site_info.php",expectedOptions);

    await act(async () => waitForNextUpdate());

    expect(result.current.manualFlowState).toMatchObject({
      flowStep: "webview",
      isSiteUrlSubmitted: true,
      siteUrl: "https://success.com"
    });

    act(() => {
      result.current.onSetupSecretSuccess("theSecret");
    });

    expect(result.current.manualFlowState).toMatchObject({
      flowStep: "done",
      isSiteUrlSubmitted: false,
      setupSecret: "theSecret",
      siteUrl: "https://success.com"
    });
    expect(onLoginSuccess).toBeCalledTimes(1);
  });

  it("should be on step fail when url is invalid", async () => {
    const mockOnLoginSuccess = jest.fn();

    const mockFetchError = () => Promise.reject(new Error("server error"));
    const { result, waitForNextUpdate } = renderHook(() =>
      useManualFlow(mockFetchError)({ onLoginSuccess: mockOnLoginSuccess })
    );

    act(() => {
      result.current.onSiteUrlSuccess("https://fail.com");
    });

    expect(result.current.manualFlowState).toMatchObject({
      isSiteUrlSubmitted: true,
      isSiteUrlFailure: false,
      siteUrl: "https://fail.com"
    });

    await act(async () => waitForNextUpdate());

    expect(result.current.manualFlowState).toMatchObject({
      isSiteUrlSubmitted: false,
      isSiteUrlFailure: true,
      siteUrl: "https://fail.com"
    });
  });
});

describe("manualFlowReducer", () => {
  it("should put flowStep into siteUrl when it is cancelled", () => {
    const currentState = {
      isSiteUrlSubmitted: true,
      flowStep: "native"
    };
    const action = {
      type: "cancelManualFlow"
    };

    const newState = manualFlowReducer(currentState, action);
    expect(newState.flowStep).toBe("siteUrl");
    expect(newState.isSiteUrlSubmitted).toBeFalsy();
  });

  it("should use the auth on the SiteInfo for the next flowstep", () => {
    config.minApiVersion = "2019111100";
    const currentState = {
      isSiteUrlSubmitted: true,
      flowStep: "siteUrl"
    };
    const testSiteInfo = {
      auth: "native",
      siteMaintenance: false,
      theme: {
        urlLogo: "https://mytotara.client.com/totara/mobile/logo.png",
        colorPrimary: "#CCFFCC"
      },
      version: "2019111100"
    };
    const action = {
      type: "siteInfoApiSuccess",
      payload: testSiteInfo
    };

    const newState = manualFlowReducer(currentState, action);
    expect(newState.flowStep).toBe("native");
    expect(newState.siteInfo).toMatchObject(testSiteInfo);
  });

  it("should set flowStep to incompatible for unsupport minApiVersion", () => {
    config.minApiVersion = "2019111100";
    const currentState = {
      isSiteUrlSubmitted: true,
      flowStep: "siteUrl"
    };
    const testSiteInfo = {
      auth: "native",
      siteMaintenance: false,
      theme: {
        urlLogo: "https://mytotara.client.com/totara/mobile/logo.png",
        colorPrimary: "#CCFFCC"
      },
      version: "2019101802"
    };
    const action = {
      type: "siteInfoApiSuccess",
      payload: testSiteInfo
    };

    const newState = manualFlowReducer(currentState, action);
    expect(newState.flowStep).toBe("incompatible");
    expect(newState.siteInfo).toMatchObject(testSiteInfo);
  });

  it("should set flowStep to native for disabled app minApiVersion", () => {
    config.minApiVersion = "disabled";
    const currentState = {
      isSiteUrlSubmitted: true,
      flowStep: "siteUrl"
    };
    const testSiteInfo = {
      auth: "native",
      siteMaintenance: false,
      theme: {
        urlLogo: "https://mytotara.client.com/totara/mobile/logo.png",
        colorPrimary: "#CCFFCC"
      },
      version: "2019101802"
    };
    const action = {
      type: "siteInfoApiSuccess",
      payload: testSiteInfo
    };

    const newState = manualFlowReducer(currentState, action);
    expect(newState.flowStep).toBe("native");
    expect(newState.siteInfo).toMatchObject(testSiteInfo);
  });

  it("should properly init the state", () => {
    const currentState = {
      isSiteUrlSubmitted: false,
      siteUrl: undefined,
      flowStep: "siteUrl"
    };
    const action = {
      type: "siteInfoApiInit",
      payload: "https://totarasite.com"
    };

    const newState = manualFlowReducer(currentState, action);
    expect(newState.flowStep).toBe("siteUrl");
    expect(newState.isSiteUrlSubmitted).toBeTruthy();
    expect(newState.siteUrl).toBe("https://totarasite.com");
  });

  it("should put flowstep as done, set the setupSecret when setupSecretSuccess", () => {
    const currentState = {
      isSiteUrlSubmitted: true,
      siteUrl: "https://totarasite.com",
      flowStep: "native"
    };
    const action = {
      type: "setupSecretSuccess",
      payload: "the_secret"
    };

    const newState = manualFlowReducer(currentState, action);
    expect(newState.flowStep).toBe("done");
    expect(newState.isSiteUrlSubmitted).toBeFalsy();
    expect(newState.setupSecret).toBe("the_secret");
  });

  it("should api failure, when site-info was Submitted", () => {
    const currentState = {
      isSiteUrlSubmitted: true,
      siteUrl: "https://totarasite.com",
      flowStep: "native"
    };
    const action = {
      type: "siteInfoApiFailure",
      payload: new Error()
    };
    const newState = manualFlowReducer(currentState, action);
    expect(newState.flowStep).toBe("native");
    expect(newState.isSiteUrlSubmitted).toBeFalsy();
    expect(newState.isSiteUrlFailure).toBe(true);
  });

  it("should set flowStep to browser login and take screen-shot in Information modal", () => {
    const currentState = {
      isSiteUrlSubmitted: true,
      flowStep: "siteUrl"
    };
    const testSiteInfo = {
      auth: "browser",
      siteMaintenance: false,
      theme: {
        urlLogo: "https://mytotara.client.com/totara/mobile/logo.png",
        colorPrimary: "#CCFFCC"
      },
      version: "2019101802"
    };
    const action = {
      type: "siteInfoApiSuccess",
      payload: testSiteInfo
    };

    const newState = manualFlowReducer(currentState, action);

    expect(newState.flowStep).toBe("browser");
    expect(newState.siteInfo).toMatchObject(testSiteInfo);
    const tree = renderer
      .create(<BrowserLogin siteUrl={"siteUrl"} onManualFlowCancel={jest.fn()} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});