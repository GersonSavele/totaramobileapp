/**
 * This file is part of Totara Enterprise.
 *
 * Copyright (C) 2019 onwards Totara Learning Solutions LTD
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
  siteUrl,
  onLoginSuccess,
  onLoginFailure
}: AuthFlowChildProps) => {
  const [, setTheme] = useContext(ThemeContext);

  const [manualFlowState, dispatch] = useReducer(manualFlowReducer, {
    isSiteUrlSubmitted: false,
    flowStep: "siteUrl",
    siteUrl
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

  const version = DeviceInfo.getBuildNumber();
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
