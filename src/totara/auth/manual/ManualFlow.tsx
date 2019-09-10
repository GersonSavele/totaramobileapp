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

import { Log } from "@totara/lib";
import { AuthProviderStateLift } from "../AuthComponent";
import WebviewFlow from "../webview";
import NativeFlow from "../native";
import { TouchableOpacity, View } from "react-native";
import SiteUrl from "./SiteUrl";

/**
 * ManualFlow starts with a siteUrl, then depending what configured on the server
 * will dispatch the next flow
 */
const ManualFlow = ({onLoginSuccess, onLoginFailure}: AuthProviderStateLift) => {

  const {
    manualFlowState,
    onSiteUrlSubmit,
    onSetupSecretSubmit,
    onSetupSecretCancel
  } = useManualFlow(mockFetch)({onLoginSuccess, onLoginFailure});

  return(
    <View style={{flex: 1}}>
      {(() => {
        switch (manualFlowState.flowStep) {
          case ManualFlowSteps.native:
            return <NativeFlow onLoginSuccess={onLoginSuccess} onLoginFailure={onLoginFailure}/>;
          case ManualFlowSteps.webview:
            return <WebviewFlow uri={manualFlowState.siteUrl} onSetupSecretSubmit={onSetupSecretSubmit} onSetupSecretCancel={onSetupSecretCancel}/>;
          default:
            return <SiteUrl onSuccessfulSiteUrl={(siteUrl) => onSiteUrlSubmit(siteUrl)} siteUrl={manualFlowState.siteUrl}/>;
        }
      })()}
      <TouchableOpacity style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: 100,
        height: 100,
      }} ></TouchableOpacity>
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

type ManualFlowState = {
  siteUrl?: string,
  setupSecret?: string
  isSiteUrlSubmitted: boolean,
  flowStep: ManualFlowSteps
}

export enum Actions {
  apiInit = "apiInit",
  apiSuccess = "apiSuccess",
  setupSecretSuccess = "setupSecretSuccess",
  cancelManualFlow = "cancelManualFlow"
}

type Action = {
  type: Actions
  payload?: string
}

export const manualFlowReducer = (state: ManualFlowState, action: Action): ManualFlowState => {
  Log.debug("manualFlowReducer state:", state, "action", action);

  switch (action.type) {
    case Actions.apiInit:
      return {
        ...state,
        isSiteUrlSubmitted: true,
        siteUrl: action.payload,
      };
    case Actions.apiSuccess: {
      const flowStep = action.payload as ManualFlowSteps;

      if (flowStep === ManualFlowSteps.native ||
        flowStep === ManualFlowSteps.webview ||
        flowStep === ManualFlowSteps.browser) {

        return  {
          ...state,
          flowStep: flowStep
        };
      } else {
        throw new Error(); // TODO specify error
      }
    }
    case Actions.cancelManualFlow:
      return {
        ...state,
        isSiteUrlSubmitted: false,
        flowStep: ManualFlowSteps.siteUrl
      };
    case Actions.setupSecretSuccess:
      return {
        ...state,
        isSiteUrlSubmitted: false,
        setupSecret: action.payload,
        flowStep: ManualFlowSteps.done
      };
    default:
      throw new Error(); // TODO specify error
  }
};

export const useManualFlow = (fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>) =>
  ({onLoginSuccess, onLoginFailure}: AuthProviderStateLift) => {

  const [manualFlowState, dispatch] = useReducer(manualFlowReducer,
    {isSiteUrlSubmitted: false, flowStep: ManualFlowSteps.siteUrl});
  Log.debug("manualFlowState", manualFlowState);

  // right state to call onLoginSuccess
  if (manualFlowState.flowStep === ManualFlowSteps.done &&
    manualFlowState.siteUrl &&
    manualFlowState.setupSecret)
    onLoginSuccess({ secret: manualFlowState.setupSecret, uri: manualFlowState.siteUrl });

  // fetch the data when siteUrl it not initial value and it has changed
  useEffect(() => {
    let didCancel = false;

    const fetchData = async () => {
      const infoUrl = manualFlowState.siteUrl + "/totara/mobile/info.php";
      const options = {
        method: "POST",
        body: JSON.stringify({ version: "app version, put right version here" })
      };

      const authFlow = await fetch(infoUrl, options)
        .then(response => response.json())
        .then((json) => json.auth)
        .catch( (error) => onLoginFailure(error));
      Log.debug("authFlow", authFlow);

      if (!didCancel) dispatch({type: Actions.apiSuccess, payload: authFlow })
    };

    if (manualFlowState.isSiteUrlSubmitted && manualFlowState.flowStep === ManualFlowSteps.siteUrl) fetchData();

    return () => {
      didCancel = true; // need to create a lock for async stuff
    }
  }, [manualFlowState.siteUrl, manualFlowState.isSiteUrlSubmitted]);

  const onSiteUrlSubmit = (url: string) => {
    Log.debug("url", url);
    dispatch({type: Actions.apiInit, payload: url})
  };

  const onSetupSecretSubmit = (setupSecret: string) => {
    dispatch({type: Actions.setupSecretSuccess, payload: setupSecret})
  };

  const onSetupSecretCancel = () => {
    dispatch({type: Actions.cancelManualFlow});
  };

  return {
    manualFlowState,
    onSiteUrlSubmit,
    onSetupSecretSubmit,
    onSetupSecretCancel
  }

};


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
  } as unknown as Response);
};


export default ManualFlow;