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
import { AuthProviderStateLift } from "@totara/auth/AuthComponent";
import { useEffect, useReducer } from "react";

/**
 * Custom react hook that manages the state of the manual flow
 *
 * @param fetch - as param so test can easily pass a mock implementation
 * @returns state and functions that will change the state of the manual flow
 */
export const useManualFlow =
  (fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>) =>
    ({ onLoginSuccess, onLoginFailure }: AuthProviderStateLift): OutProps => {

      const [manualFlowState, dispatch] = useReducer(manualFlowReducer,
        { isSiteUrlSubmitted: false, flowStep: ManualFlowSteps.siteUrl });
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
            .catch((error) => onLoginFailure(error));
          Log.debug("siteInfo", siteInfo);

          if (!didCancel && "version" in siteInfo)
            dispatch({ type: "apiSuccess", payload: siteInfo });
          else
            Log.warn("Did not dispatch apiSuccess: didCancel", didCancel, "siteInfo", siteInfo);
        };

        if (manualFlowState.isSiteUrlSubmitted &&
          manualFlowState.flowStep === ManualFlowSteps.siteUrl &&
          manualFlowState.siteUrl) fetchData(manualFlowState.siteUrl);

        return () => {
          didCancel = true; // need to create a lock for async stuff
        };
      }, [manualFlowState.siteUrl, manualFlowState.isSiteUrlSubmitted]);

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


export const manualFlowReducer = (state: ManualFlowState, action: Action): ManualFlowState => {
  Log.debug("manualFlowReducer state:", state, "action", action);

  switch (action.type) {
    case "apiInit":
      return {
        ...state,
        isSiteUrlSubmitted: true,
        siteUrl: action.payload as string,
      };

    case "apiSuccess": {
      const siteInfo = action.payload as SiteInfo;
      const flowStep = siteInfo.auth as ManualFlowSteps;

      if (flowStep === ManualFlowSteps.native ||
        flowStep === ManualFlowSteps.webview ||
        flowStep === ManualFlowSteps.browser) {

        return  {
          ...state,
          flowStep: flowStep,
          siteInfo: siteInfo
        };
      } else {
        throw new Error(); // TODO specify error
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

export enum ManualFlowSteps {
  siteUrl = "siteUrl",
  native = "native",
  webview = "webview",
  browser = "browser",
  done = "done"
}

type ManualFlowState = {
  siteUrl?: string,
  siteInfo?: SiteInfo,
  setupSecret?: string
  isSiteUrlSubmitted: boolean,
  flowStep: ManualFlowSteps
}

type Action = {
  type: "apiInit" | "apiSuccess" | "setupSecretSuccess" | "cancelManualFlow"
  payload?: string | SiteInfo
}

type Theme = {
  logoUrl?: string,
  brandPrimary?: string
};

export type SiteInfo = {
  version: string,
  auth: string,
  siteMaintenance: boolean,
  theme?: Theme
}

export type OutProps = {
  manualFlowState: ManualFlowState,
  onSiteUrlSuccess: (url: string) => void,
  onSetupSecretSuccess: (setupSecret: string) => void,
  onSetupSecretCancel: () => void
}