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

import React from "react";
import { View } from "react-native";

import { AuthProviderStateLift } from "../AuthComponent";
import WebviewFlow from "./webview";
import NativeFlow from "./native";
import { useManualFlow, ManualFlowSteps, OutProps } from "./ManualFlowHook";
import SiteUrl from "./SiteUrl";
import { useSiteUrl } from "./SiteUrlHook";
import { AppModal } from "@totara/components";

/**
 * ManualFlow starts with a siteUrl, then depending what configured on the server
 * will dispatch the next flow
 */
const ManualFlow = ({ manualFlowState, onSiteUrlSuccess, onSetupSecretSuccess, onSetupSecretCancel }: OutProps) => {

  const StartComponent = () => SiteUrl(useSiteUrl({onSiteUrlSuccess: onSiteUrlSuccess, siteUrl: manualFlowState.siteUrl}));

  return(
    <View style={{flex: 1}}>
      {(() => {
        switch (manualFlowState.flowStep) {
          case ManualFlowSteps.native:
            return manualFlowState.siteUrl && manualFlowState.siteInfo ? (
              <NativeFlow
                siteUrl={manualFlowState.siteUrl}
                siteInfo={manualFlowState.siteInfo}
                onSetupSecretSuccess={onSetupSecretSuccess}
                onSetupSecretCancel={onSetupSecretCancel}
              />
            ) : (
              <StartComponent />
            );
          case ManualFlowSteps.webview:
            return manualFlowState.siteUrl && manualFlowState.siteInfo ? (
              <WebviewFlow
                siteUrl={manualFlowState.siteUrl}
                siteInfo={manualFlowState.siteInfo}
                onSetupSecretSuccess={onSetupSecretSuccess}
                onSetupSecretCancel={onSetupSecretCancel}
              />
            ) : (
              <StartComponent />
            );
          case ManualFlowSteps.incompatible:
            return <AppModal onCancel={onSetupSecretCancel} />;
          case ManualFlowSteps.done:
            return null;
          default:
            return <StartComponent />;
        }
      })()}
    </View>
  )
};


// fetch is available on global scope
// eslint-disable-next-line no-undef
export default (props: AuthProviderStateLift) => ManualFlow(useManualFlow(fetch)(props));
