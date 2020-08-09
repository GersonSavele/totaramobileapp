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

import { useEffect, useReducer, useContext } from "react";
import DeviceInfo from "react-native-device-info";

import { ThemeContext, applyTheme } from "@totara/theme";
import { TotaraTheme } from "@totara/theme/Theme";
import { config, Log } from "@totara/lib";
import { isValidApiVersion } from "@totara/core/AuthContext";
import { SiteInfo } from "@totara/types";
import { AuthFlowChildProps } from "../AuthComponent";
import { NetworkError, UnsupportedAuthFlow } from "@totara/types/Error";

/**
 * Custom react hook that manages the state of the manual flow
 *
 * @param fetchData - as param so test can easily pass a mock implementation
 * @returns state and functions that will change the state of the manual flow
 */

export const useManualFlow = (fetchData: <T>(input: RequestInfo, init?: RequestInit) => Promise<T>) => ({
  onLoginSuccess,
  onLoginFailure
}: AuthFlowChildProps) => {
  const [, setTheme] = useContext(ThemeContext);

  const [manualFlowState, dispatch] = useReducer(manualFlowReducer, {
    isSiteUrlSubmitted: false,
    flowStep: "siteUrl"
  });
  Log.debug("manualFlowState", manualFlowState);

  // right state to call onLoginSuccess
  if (
    manualFlowState.flowStep === "done" &&
    manualFlowState.siteUrl &&
    manualFlowState.setupSecret &&
    manualFlowState.siteInfo
  )
    onLoginSuccess({
      secret: manualFlowState.setupSecret,
      uri: manualFlowState.siteUrl,
      siteInfo: manualFlowState.siteInfo
    });

  const version = DeviceInfo.getVersion();

  const fetchSiteInfoPromise = () =>
    fetchData<SiteInfo>(config.infoUri(manualFlowState.siteUrl!), {
      method: "POST",
      body: JSON.stringify({ version: version })
    });

  useEffect(() => {
    const run = manualFlowState.isSiteUrlSubmitted && manualFlowState.flowStep === "siteUrl" && manualFlowState.siteUrl;
    if (run) {
      fetchSiteInfoPromise()
        .then((siteInfo) => {
          dispatch({ type: "siteInfoApiSuccess", payload: siteInfo });
        })
        .catch((error) => {
          dispatch({ type: "siteInfoApiFailure", payload: error });
        });
    }
  }, [manualFlowState.siteUrl, manualFlowState.isSiteUrlSubmitted]);

  useEffect(() => {
    if (manualFlowState.flowStep === "siteUrl" && !manualFlowState.isSiteUrlSubmitted) {
      setTheme(applyTheme(TotaraTheme));
    } else if (manualFlowState.flowStep !== "siteUrl" && manualFlowState.isSiteUrlSubmitted) {
      setTheme(
        applyTheme(
          manualFlowState.siteInfo && manualFlowState.siteInfo.theme ? manualFlowState.siteInfo.theme : TotaraTheme
        )
      );
    }
  }, [manualFlowState.flowStep, manualFlowState.siteInfo, manualFlowState.isSiteUrlSubmitted]);

  const onSiteUrlSuccess = (url: string) => {
    dispatch({ type: "siteInfoApiInit", payload: url });
  };

  const onSetupSecretSuccess = (setupSecret: string) => {
    dispatch({ type: "setupSecretSuccess", payload: setupSecret });
  };

  const onManualFlowCancel = () => {
    dispatch({ type: "cancelManualFlow" });
  };

  const onSetupSecretFailure = (error: Error) => {
    onLoginFailure(error);
  };

  return {
    manualFlowState,
    onSiteUrlSuccess,
    onSetupSecretSuccess,
    onManualFlowCancel,
    onSetupSecretFailure
  };
};

/**
 * Reducer to manage ManualFlowState to proper states
 * @param state - input state
 * @param action - dispatched action to change state
 * @returns - output state
 */
export const manualFlowReducer = (state: ManualFlowState, action: Action): ManualFlowState => {
  Log.debug("manualFlowReducer state:", state, "action", action);

  switch (action.type) {
    case "siteInfoApiInit":
      return {
        ...state,
        isSiteUrlSubmitted: true,
        siteUrl: action.payload as string
      };

    case "siteInfoApiSuccess": {
      const siteInfo = action.payload as SiteInfo;
      const flowStep = siteInfo.auth;
      const isCompatible = isValidApiVersion(siteInfo.version);
      if (!isCompatible) {
        return {
          ...state,
          flowStep: "incompatible",
          siteInfo: siteInfo
        };
      } else if (flowStep === "native" || flowStep === "webview" || flowStep === "browser") {
        return {
          ...state,
          flowStep: flowStep,
          siteInfo: siteInfo
        };
      } else {
        Log.warn("Unsupported manual flow", flowStep);
        return {
          ...state,
          isSiteUrlSubmitted: false,
          siteUrlFailure: new UnsupportedAuthFlow()
        };
      }
    }

    case "siteInfoApiFailure": {
      const networkError = action.payload as NetworkError;
      return {
        ...state,
        isSiteUrlSubmitted: false,
        siteUrlFailure: networkError
      };
    }

    case "cancelManualFlow":
      return {
        ...state,
        isSiteUrlSubmitted: false,
        flowStep: "siteUrl",
        siteUrlFailure: undefined
      };

    case "setupSecretSuccess":
      return {
        ...state,
        isSiteUrlSubmitted: false,
        siteUrlFailure: undefined,
        setupSecret: action.payload as string,
        flowStep: "done"
      };
  }
};

type ManualFlowState = {
  siteUrl?: string;
  siteInfo?: SiteInfo;
  setupSecret?: string;
  isSiteUrlSubmitted: boolean;
  flowStep: "siteUrl" | "native" | "webview" | "browser" | "done" | "incompatible";
  siteUrlFailure?: NetworkError;
};

type Action = {
  type: "siteInfoApiInit" | "siteInfoApiSuccess" | "setupSecretSuccess" | "cancelManualFlow" | "siteInfoApiFailure";
  payload?: string | SiteInfo | NetworkError;
};
