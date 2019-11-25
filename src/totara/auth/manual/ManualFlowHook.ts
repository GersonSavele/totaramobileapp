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
import VersionInfo from "react-native-version-info";

import { ThemeContext, applyTheme } from "@totara/theme";
import { TotaraTheme } from "@totara/theme/Theme";
import { config, Log } from "@totara/lib";
import { isValidApiVersion, SiteInfo } from "../AuthContext";
import { AuthProviderStateLift } from "../AuthComponent";
import { asyncEffectWrapper } from "../AuthRoutines";

/**
 * Custom react hook that manages the state of the manual flow
 *
 * @param fetch - as param so test can easily pass a mock implementation
 * @returns state and functions that will change the state of the manual flow
 */

export const useManualFlow = (
  fetchData: <T>(input: RequestInfo, init?: RequestInit) => Promise<T>
) => (props: AuthProviderStateLift): OutProps => {
  const [, setTheme] = useContext(ThemeContext);

  const [manualFlowState, dispatch] = useReducer(manualFlowReducer, {
    isSiteUrlSubmitted: false,
    flowStep: ManualFlowSteps.siteUrl,
    isSiteUrlFailure: false
  });
  Log.debug("manualFlowState", manualFlowState);

  // right state to call onLoginSuccess
  if (
    manualFlowState.flowStep === ManualFlowSteps.done &&
    manualFlowState.siteUrl &&
    manualFlowState.setupSecret &&
    manualFlowState.siteInfo
  )
    props.onLoginSuccess({
      secret: manualFlowState.setupSecret,
      uri: manualFlowState.siteUrl,
      siteInfo: manualFlowState.siteInfo
    });

  const version = VersionInfo.appVersion ?  VersionInfo.appVersion : "UnknownVersion";
  const fetchSiteInfo = () =>
    fetchData<SiteInfo>(config.infoUri(manualFlowState.siteUrl!), {
      method: "POST",
      body: JSON.stringify({ version: version })
    });

  // effect fetch the data when the right dependency has been met
  // effect fetch the data when the right dependency has been met
  useEffect(
    asyncEffectWrapper<SiteInfo>(
      fetchSiteInfo,
      () =>
        manualFlowState.isSiteUrlSubmitted &&
        manualFlowState.flowStep === ManualFlowSteps.siteUrl &&
        manualFlowState.siteUrl
          ? true
          : false,
      siteInfo => {
        dispatch({ type: "siteInfoApiSuccess", payload: siteInfo });
      },
      error => {
        dispatch({ type: "siteInfoApiFailure", payload: error.message });
      }
    ),
    [manualFlowState.siteUrl, manualFlowState.isSiteUrlSubmitted]
  );

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
          manualFlowState.siteInfo && manualFlowState.siteInfo.theme
            ? manualFlowState.siteInfo.theme
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
    dispatch({ type: "siteInfoApiInit", payload: url });
  };

  const onSetupSecretSuccess = (setupSecret: string) => {
    dispatch({ type: "setupSecretSuccess", payload: setupSecret });
  };

  const onSetupSecretCancel = () => {
    dispatch({ type: "cancelManualFlow" });
  };

  const onSetupSecretFailure = (error: Error) => {
    props.onLoginFailure(error);
  };

  return {
    manualFlowState,
    onSiteUrlSuccess,
    onSetupSecretSuccess,
    onSetupSecretCancel,
    onSetupSecretFailure
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
    case "siteInfoApiInit":
      return {
        ...state,
        isSiteUrlSubmitted: true,
        siteUrl: action.payload as string
      };

    case "siteInfoApiSuccess": {
      const siteInfo = action.payload as SiteInfo;
      const flowStep = siteInfo.auth as ManualFlowSteps;
      const isCompatible = isValidApiVersion(siteInfo.version);
      if (!isCompatible) {
        return {
          ...state,
          flowStep: ManualFlowSteps.incompatible,
          siteInfo: siteInfo
        };
      } else if (
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
        return {
          ...state,
          isSiteUrlSubmitted: false,
          isSiteUrlFailure: true
        };
      }
    }

    case "siteInfoApiFailure": {
      return {
        ...state,
        isSiteUrlSubmitted: false,
        isSiteUrlFailure: true
      };
    }

    case "cancelManualFlow":
      return {
        ...state,
        isSiteUrlSubmitted: false,
        flowStep: ManualFlowSteps.siteUrl,
        isSiteUrlFailure: false
      };

    case "setupSecretSuccess":
      return {
        ...state,
        isSiteUrlSubmitted: false,
        isSiteUrlFailure: false,
        setupSecret: action.payload as string,
        flowStep: ManualFlowSteps.done
      };
  }
};

export enum ManualFlowSteps {
  siteUrl = "siteUrl",
  native = "native",
  webview = "webview",
  browser = "browser",
  done = "done",
  incompatible = "incompatible"
}

type ManualFlowState = {
  siteUrl?: string;
  siteInfo?: SiteInfo;
  setupSecret?: string;
  isSiteUrlSubmitted: boolean;
  flowStep: ManualFlowSteps;
  isSiteUrlFailure: boolean;
};

type Action = {
  type:
    | "siteInfoApiInit"
    | "siteInfoApiSuccess"
    | "setupSecretSuccess"
    | "cancelManualFlow"
    | "siteInfoApiFailure";
  payload?: string | SiteInfo;
};

export type OutProps = {
  manualFlowState: ManualFlowState;
  onSiteUrlSuccess: (url: string) => void;
  onSetupSecretSuccess: (setupSecret: string) => void;
  onSetupSecretCancel: () => void;
  onSetupSecretFailure: (error: Error) => void;
};
