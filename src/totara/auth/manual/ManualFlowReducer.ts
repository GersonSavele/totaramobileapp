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

import { Log } from "@totara/lib";
import { ManualFlowSteps } from "./ManualFlow";

export const manualFlowReducer = (state: ManualFlowState, action: Action): ManualFlowState => {
  Log.debug("manualFlowReducer state:", state, "action", action);

  switch (action.type) {
    case ActionType.apiInit:
      return {
        ...state,
        isSiteUrlSubmitted: true,
        siteUrl: action.payload as string,
      };

    case ActionType.apiSuccess: {
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

    case ActionType.cancelManualFlow:
      return {
        ...state,
        isSiteUrlSubmitted: false,
        flowStep: ManualFlowSteps.siteUrl
      };

    case ActionType.setupSecretSuccess:
      return {
        ...state,
        isSiteUrlSubmitted: false,
        setupSecret: action.payload as string,
        flowStep: ManualFlowSteps.done
      };

    default:
      throw new Error(); // TODO specify error
  }
};

type ManualFlowState = {
  siteUrl?: string,
  siteInfo?: SiteInfo,
  setupSecret?: string
  isSiteUrlSubmitted: boolean,
  flowStep: ManualFlowSteps
}

export enum ActionType {
  apiInit = "apiInit",
  apiSuccess = "apiSuccess",
  setupSecretSuccess = "setupSecretSuccess",
  cancelManualFlow = "cancelManualFlow"
}

type Action = {
  type: ActionType
  payload?: string | SiteInfo
}

export type Theme = {
  logoUrl?: string,
  brandPrimary?: string
};

export type SiteInfo = {
  version: string,
  auth: string,
  siteMaintenance: boolean,
  theme?: Theme
}

