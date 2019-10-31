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

import { config, Log } from "@totara/lib";
import React, { useEffect, useReducer, useContext } from "react";

import { AuthProviderStateLift } from "@totara/auth/AuthComponent";
import { Theme, ThemeContext, applyTheme } from "@totara/theme";
import { TotaraTheme } from "@totara/theme/Theme";
import VersionInfo from "react-native-version-info";

/**
 * Custom react hook that manages the state of the manual flow
 *
 * @param fetch - as param so test can easily pass a mock implementation
 * @returns state and functions that will change the state of the manual flow
 */

export const useManualFlow = (
  fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>
) => (props: AuthProviderStateLift): OutProps => {
  const [, setTheme] = useContext(ThemeContext);

  const [manualFlowState, dispatch] = useReducer(manualFlowReducer, {
    isSiteUrlSubmitted: false,
    flowStep: ManualFlowSteps.siteUrl
  });
  Log.debug("manualFlowState", manualFlowState);

  // right state to call onLoginSuccess
  if (
    manualFlowState.flowStep === ManualFlowSteps.done &&
    manualFlowState.siteUrl &&
    manualFlowState.setupSecret
  )
    props.onLoginSuccess({
      secret: manualFlowState.setupSecret,
      uri: manualFlowState.siteUrl
    });

  // effect fetch the data when the right dependency has been met
  useEffect(() => {
    let didCancel = false;

    if (
      manualFlowState.isSiteUrlSubmitted &&
      manualFlowState.flowStep === ManualFlowSteps.siteUrl &&
      manualFlowState.siteUrl
    )
      fetchSiteInfo(fetch)(props)(manualFlowState.siteUrl, didCancel, dispatch);

    return () => {
      didCancel = true; // need to create a lock for async stuff
    };
  }, [manualFlowState.siteUrl, manualFlowState.isSiteUrlSubmitted]);

  useEffect(() => {
    if (
      manualFlowState.flowStep === ManualFlowSteps.siteUrl &&
      !manualFlowState.isSiteUrlSubmitted
    ) {
      setTheme(applyTheme(TotaraTheme));
    } else if (
      manualFlowState.flowStep !== ManualFlowSteps.siteUrl &&
      manualFlowState.isSiteUrlSubmitted
    ) {
      setTheme(
        applyTheme(
          manualFlowState.siteInfo && manualFlowState.siteInfo.data.theme
            ? manualFlowState.siteInfo.data.theme
            : TotaraTheme
        )
      );
    }
  }, [
    manualFlowState.flowStep,
    manualFlowState.siteInfo,
    manualFlowState.isSiteUrlSubmitted
  ]);

  const onSiteUrlSuccess = (url: string) => {
    dispatch({ type: "apiInit", payload: url });
  };

  const onSetupSecretSuccess = (setupSecret: string) => {
    dispatch({ type: "setupSecretSuccess", payload: setupSecret });
  };

  const onSetupSecretCancel = () => {
    dispatch({ type: "cancelManualFlow" });
  };

  return {
    manualFlowState,
    onSiteUrlSuccess,
    onSetupSecretSuccess,
    onSetupSecretCancel
  };
};

/**
 * Reducer to manage ManualFlowState to proper states
 * @param state - input state
 * @param action - dispatched action to change state
 * @returns - output state
 */
export const manualFlowReducer = (
  state: ManualFlowState,
  action: Action
): ManualFlowState => {
  Log.debug("manualFlowReducer state:", state, "action", action);

  switch (action.type) {
    case "apiInit":
      return {
        ...state,
        isSiteUrlSubmitted: true,
        siteUrl: action.payload as string
      };

    case "apiSuccess": {
      const siteInfo = action.payload as SiteInfo;
      const flowStep = siteInfo.data.auth as ManualFlowSteps;
      if (
        flowStep === ManualFlowSteps.native ||
        flowStep === ManualFlowSteps.webview ||
        flowStep === ManualFlowSteps.browser
      ) {
        return {
          ...state,
          flowStep: flowStep,
          siteInfo: siteInfo
        };
      } else {
        throw new Error(
          `Unknown auth response from server ${siteInfo.data.auth}`
        );
      }
    }

    case "cancelManualFlow":
      return {
        ...state,
        isSiteUrlSubmitted: false,
        flowStep: ManualFlowSteps.siteUrl
      };

    case "setupSecretSuccess":
      return {
        ...state,
        isSiteUrlSubmitted: false,
        setupSecret: action.payload as string,
        flowStep: ManualFlowSteps.done
      };
  }
};

/**
 * Fetch the siteInfo from the server, dispatch with proper action.  Taken outside useEffect for testing
 * this follows this pattern: https://www.robinwieruch.de/react-hooks-fetch-data
 */
export const fetchSiteInfo = (
  fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>
) => (props: AuthProviderStateLift) => async (
  siteUrl: string,
  didCancel: boolean,
  dispatch: React.Dispatch<Action>
) => {
  const infoUrl = config.infoUri(siteUrl);
  const options = {
    method: "POST",
    body: JSON.stringify({ version: VersionInfo.appVersion })
  };

  const siteInfo = await fetch(infoUrl, options)
    .then(response => {
      Log.debug("response", response);
      if (response.status === 200)
        return (response.json() as unknown) as SiteInfo;
      else throw new Error(response.statusText);
    })
    .catch(error => props.onLoginFailure(error));
  Log.debug("siteInfo", siteInfo);

  if (!didCancel && siteInfo) {
    Log.debug("siteInfo", siteInfo);
    dispatch({ type: "apiSuccess", payload: siteInfo });
  } else
    Log.warn(
      "Did not dispatch apiSuccess: didCancel",
      didCancel,
      "siteInfo",
      siteInfo
    );
};

export enum ManualFlowSteps {
  siteUrl = "siteUrl",
  native = "native",
  webview = "webview",
  browser = "browser",
  done = "done"
}

type ManualFlowState = {
  siteUrl?: string;
  siteInfo?: SiteInfo;
  setupSecret?: string;
  isSiteUrlSubmitted: boolean;
  flowStep: ManualFlowSteps;
};

type Action = {
  type: "apiInit" | "apiSuccess" | "setupSecretSuccess" | "cancelManualFlow";
  payload?: string | SiteInfo | Data | {};
};

export type SiteInfo = {
  data: Data;
};

type Data = {
  auth: string;
  siteMaintenance: boolean;
  theme?: Theme;
};

export type OutProps = {
  manualFlowState: ManualFlowState;
  onSiteUrlSuccess: (url: string) => void;
  onSetupSecretSuccess: (setupSecret: string) => void;
  onSetupSecretCancel: () => void;
};
