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
import { ManualFlowSteps, useManualFlow, manualFlowReducer } from "../ManualFlowHook";
import { renderHook, act } from "@testing-library/react-hooks";

describe("useManualFlow", () => {

  const mockFetch = () => {

    return Promise.resolve({
      status: 200,
      json: () => ({
        auth: "webview",
        siteMaintenance: false,
        theme: {
          logoUrl: "https://mytotara.client.com/totara/mobile/logo.png",
          brandPrimary: "#CCFFCC"
        }
      })
    });
  };

  it("should be on step done when url and secret is valid", async () => {
    const onLoginSuccess = jest.fn((setupSecret) => {
      expect(setupSecret.uri).toBe("https://success.com");
      expect(setupSecret.secret).toBe("theSecret");
    });

    const { result, waitForNextUpdate } = renderHook(({onLoginSuccess}) => useManualFlow(mockFetch)({onLoginSuccess: onLoginSuccess}), {initialProps: {onLoginSuccess: onLoginSuccess}});

    act(() => {
      result.current.onSiteUrlSuccess("https://success.com");
    });

    await waitForNextUpdate; // custom hook has useEffect need to wait for it

    expect(result.current.manualFlowState).toMatchObject({
      flowStep: ManualFlowSteps.siteUrl,
      isSiteUrlSubmitted: true,
      siteUrl: "https://success.com"
    });

    act( () => {
      result.current.onSetupSecretSuccess("theSecret");
    });

    expect(result.current.manualFlowState).toMatchObject({
      flowStep: ManualFlowSteps.done,
      isSiteUrlSubmitted: false,
      setupSecret: "theSecret",
      siteUrl: "https://success.com"
    });
    expect(onLoginSuccess).toBeCalledTimes(1);
  })

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
      version: "2019061900",
      auth: "native",
      siteMaintenance: false,
      theme: {
        logoUrl: "https://mytotara.client.com/totara/mobile/logo.png",
        brandPrimary: "#CCFFCC"
      }
    };
    const action = {
      type: "apiSuccess",
      payload: testSiteInfo
    };

    const newState = manualFlowReducer(currentState, action);

    expect(newState.flowStep).toBe(ManualFlowSteps.native);
    expect(newState.siteInfo).toMatchObject(testSiteInfo);


  })

});
