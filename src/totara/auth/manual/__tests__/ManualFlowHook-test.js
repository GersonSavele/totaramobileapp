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
 * @author Jun Yamog <jun.yamog@totaralearning.com
 */

import { renderHook, act } from "@testing-library/react-hooks";
import {
  ManualFlowSteps,
  useManualFlow,
  manualFlowReducer,
  fetchSiteInfo
} from "../ManualFlowHook";

describe("useManualFlow", () => {
  it("should be on step done when url and secret is valid", async () => {
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

    await act(async () => waitForNextUpdate());

    expect(result.current.manualFlowState).toMatchObject({
      flowStep: ManualFlowSteps.native,
      isSiteUrlSubmitted: true,
      siteUrl: "https://success.com"
    });
   
    act(() => {
      result.current.onSetupSecretSuccess("theSecret");
    });

    expect(result.current.manualFlowState).toMatchObject({
      flowStep: ManualFlowSteps.done,
      isSiteUrlSubmitted: false,
      setupSecret: "theSecret",
      siteUrl: "https://success.com"
    });
    expect(onLoginSuccess).toBeCalledTimes(1);
  });
});

describe("manualFlowReducer", () => {
  it("should put flowStep into siteUrl when it is cancelled", () => {
    const currentState = {
      isSiteUrlSubmitted: true,
      flowStep: ManualFlowSteps.native
    };
    const action = {
      type: "cancelManualFlow"
    };

    const newState = manualFlowReducer(currentState, action);

    expect(newState.flowStep).toBe(ManualFlowSteps.siteUrl);
    expect(newState.isSiteUrlSubmitted).toBeFalsy();
  });

  it("should use the auth on the SiteInfo for the next flowstep", () => {
    const currentState = {
      isSiteUrlSubmitted: true,
      flowStep: ManualFlowSteps.siteUrl
    };
    const testSiteInfo = {
      data : {
        auth: "native",
        siteMaintenance: false,
        theme: {
          logoUrl: "https://mytotara.client.com/totara/mobile/logo.png",
          colorBrand: "#CCFFCC"
        }
      }
    };
    const action = {
      type: "apiSuccess",
      payload: testSiteInfo
    };

    const newState = manualFlowReducer(currentState, action);

    expect(newState.flowStep).toBe(ManualFlowSteps.native);
    expect(newState.siteInfo).toMatchObject(testSiteInfo);
  });

  it("should properly init the state", () => {
    const currentState = {
      isSiteUrlSubmitted: false,
      siteUrl: undefined,
      flowStep: ManualFlowSteps.siteUrl
    };
    const action = {
      type: "apiInit",
      payload: "https://totarasite.com"
    };

    const newState = manualFlowReducer(currentState, action);

    expect(newState.flowStep).toBe(ManualFlowSteps.siteUrl);
    expect(newState.isSiteUrlSubmitted).toBeTruthy();
    expect(newState.siteUrl).toBe("https://totarasite.com");
  });

  it("should put flowstep as done, set the setupSecret when setupSecretSuccess", () => {
    const currentState = {
      isSiteUrlSubmitted: true,
      siteUrl: "https://totarasite.com",
      flowStep: ManualFlowSteps.native
    };
    const action = {
      type: "setupSecretSuccess",
      payload: "the_secret"
    };

    const newState = manualFlowReducer(currentState, action);

    expect(newState.flowStep).toBe(ManualFlowSteps.done);
    expect(newState.isSiteUrlSubmitted).toBeFalsy();
    expect(newState.setupSecret).toBe("the_secret");
  });
});

describe("fetchData", () => {
  it("should dispatch apiSuccess action with the siteInfo when it isn't cancelled", async () => {
    expect.assertions(2);

    const dispatch = jest.fn(({type, payload}) => {
      expect(type).toBe("apiSuccess");
      expect(payload).toMatchObject({
        data : {
          auth: "native",
          siteMaintenance: false,
          theme: {
            logoUrl: "https://mytotara.client.com/totara/mobile/logo.png",
            colorBrand: "#CCFFCC"
          }
        }
      })
    });

    await fetchSiteInfo(mockFetch)({})("https://totarasite.com", false, dispatch);
  });

  it("should call onLoginFailure if the response has an error", async () => {
    const onLoginFailure = jest.fn();
    const mockFetch = () => Promise.resolve({
        status: 500,
        statusText: "server error"
      });

    await fetchSiteInfo(mockFetch)({onLoginFailure: onLoginFailure})("https://totarasite.com", false);

    expect(onLoginFailure).toBeCalledTimes(1);
  });

});

const mockFetch = () => {
  return Promise.resolve({
    status: 200,
    json: () => ({
      data : {
        auth: "native",
        siteMaintenance: false,
        theme: {
          logoUrl: "https://mytotara.client.com/totara/mobile/logo.png",
          colorBrand: "#CCFFCC"
        }
      }
    })
  });
};

