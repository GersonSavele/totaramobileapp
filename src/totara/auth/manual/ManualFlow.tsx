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

import React, { useEffect, useReducer } from "react";
import { View } from "react-native";

import { config, Log } from "@totara/lib";
import { AuthProviderStateLift } from "../AuthComponent";
import WebviewFlow from "../webview";
import NativeFlow from "../native";
import { manualFlowReducer, SiteInfo } from "./ManualFlowReducer";
import SiteUrl from "./SiteUrl";
import { useSiteUrl } from "./SiteUrlHook";

/**
 * ManualFlow starts with a siteUrl, then depending what configured on the server
 * will dispatch the next flow
 */
const ManualFlow = ({onLoginSuccess, onLoginFailure}: AuthProviderStateLift) => {

  const {
    manualFlowState,
    onSiteUrlSuccess,
    onSetupSecretSuccess,
    onSetupSecretCancel
  } = useManualFlow(mockFetch)({onLoginSuccess, onLoginFailure});

  const StartComponent = () => SiteUrl(useSiteUrl({onSiteUrlSuccess: onSiteUrlSuccess, siteUrl: manualFlowState.siteUrl}));

  return(
    <View style={{flex: 1}}>
      {(() => {
        switch (manualFlowState.flowStep) {
          case ManualFlowSteps.native:
            return (manualFlowState.siteUrl && manualFlowState.siteInfo)
              ? <NativeFlow siteUrl={manualFlowState.siteUrl} siteInfo={manualFlowState.siteInfo}
                            onSetupSecretSuccess={onSetupSecretSuccess} onSetupSecretCancel={onSetupSecretCancel}/>
              : <StartComponent/>;
          case ManualFlowSteps.webview:
            return (manualFlowState.siteUrl && manualFlowState.siteInfo)
              ? <WebviewFlow siteUrl={manualFlowState.siteUrl} siteInfo={manualFlowState.siteInfo}
                             onSetupSecretSuccess={onSetupSecretSuccess} onSetupSecretCancel={onSetupSecretCancel}/>
              : <StartComponent/>;
          case ManualFlowSteps.done:
            return null;
          default:
            return <StartComponent/>;
        }
      })()}
    </View>
  )

};

export enum ManualFlowSteps {
  siteUrl = "siteUrl",
  native = "native",
  webview = "webview",
  browser = "browser",
  done = "done"
}

/**
 * Custom react hook that manages the state of the manual flow
 *
 * @param fetch - as param so test can easily pass a mock implementation
 * @returns state and functions that will change the state of the manual flow
 */
export const useManualFlow =
  (fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>) =>
  ({onLoginSuccess, onLoginFailure}: AuthProviderStateLift) => {

  const [manualFlowState, dispatch] = useReducer(manualFlowReducer,
    {isSiteUrlSubmitted: false, flowStep: ManualFlowSteps.siteUrl});
  Log.debug("manualFlowState", manualFlowState);

  // right state to call onLoginSuccess
  if (manualFlowState.flowStep === ManualFlowSteps.done &&
    manualFlowState.siteUrl &&
    manualFlowState.setupSecret)
    onLoginSuccess({ secret: manualFlowState.setupSecret, uri: manualFlowState.siteUrl });

  // effect fetch the data when the right dependency has been met
  useEffect(() => {
    let didCancel = false;

    const fetchData = async (siteUrl: string) => {
      const infoUrl = config.infoUri(siteUrl);
      const options = {
        method: "POST",
        body: JSON.stringify({ version: "app version, put right version here" })
      };

      const siteInfo = await fetch(infoUrl, options)
        .then(response => {
          if (response.status === 200)
            return response.json() as unknown as SiteInfo;
          else
            throw new Error(response.statusText);
        })
        .catch( (error) => onLoginFailure(error));
      Log.debug("siteInfo", siteInfo);

      if (!didCancel && "version" in siteInfo)
        dispatch({type: "apiSuccess", payload: siteInfo });
      else
        Log.warn("Did not dispatch apiSuccess: didCancel", didCancel, "siteInfo", siteInfo);
    };

    if (manualFlowState.isSiteUrlSubmitted &&
      manualFlowState.flowStep === ManualFlowSteps.siteUrl &&
      manualFlowState.siteUrl) fetchData(manualFlowState.siteUrl);

    return () => {
      didCancel = true; // need to create a lock for async stuff
    }
  }, [manualFlowState.siteUrl, manualFlowState.isSiteUrlSubmitted]);

  const onSiteUrlSuccess = (url: string) => {
    dispatch({type: "apiInit", payload: url})
  };

  const onSetupSecretSuccess = (setupSecret: string) => {
    dispatch({type: "setupSecretSuccess", payload: setupSecret})
  };

  const onSetupSecretCancel = () => {
    dispatch({type: "cancelManualFlow"});
  };

  return {
    manualFlowState,
    onSiteUrlSuccess,
    onSetupSecretSuccess,
    onSetupSecretCancel
  }

};


const mockFetch = () => {

  return Promise.resolve({
    status: 200,
    json: () => ({
      version: "2019061900",
      auth: "native",
      siteMaintenance: false,
      theme: {
        logoUrl: "https://mytotara.client.com/totara/mobile/logo.png",
        brandPrimary: "#CCFFCC"
      }
    })
  } as unknown as Response);
};


export default ManualFlow;