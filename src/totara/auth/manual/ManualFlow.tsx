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
 *
 */

import React from "react";
import { View } from "react-native";

import { AuthFlowChildProps } from "../AuthComponent";
import {
  IncompatibleApiModal,
  InfoModal,
  PrimaryButton
} from "@totara/components";
import { translate } from "@totara/locale";
import { fetchData } from "@totara/core/AuthRoutines";

import WebviewFlow from "./webview";
import NativeFlow from "./native";
import BrowserLogin from "./browser";
import { useManualFlow } from "./ManualFlowHook";
import SiteUrl from "./SiteUrl";

/**
 * ManualFlow starts with a StartStep, then depending what configured on the server
 * will dispatch the next flow
 */
const ManualFlow = (props: AuthFlowChildProps) => {
  // fetch is available on global scope
  // eslint-disable-next-line no-undef
  const fetchDataWithFetch = fetchData(fetch);

  const {
    manualFlowState,
    onSiteUrlSuccess,
    onSetupSecretSuccess,
    onManualFlowCancel,
    onSetupSecretFailure
  } = useManualFlow(fetchDataWithFetch)(props);

  const StartStep = () => (
    <SiteUrl
      onSiteUrlSuccess={onSiteUrlSuccess}
      siteUrl={manualFlowState.siteUrl}
      isSiteUrlSubmitted={manualFlowState.isSiteUrlSubmitted}
    />
  );

  if (manualFlowState.isSiteUrlFailure) {
    return <SiteErrorModal onCancel={onManualFlowCancel} />;
  } else {
    return (
      <View style={{ flex: 1 }}>
        {(() => {
          // this a inline switch anonymous component, for now for unknown reasons yet the modal on child
          // elements fails when the theme is re-applied.  Need to investigate in the future
          // PREVIOUS VERSION ONLY FAILS ON IOS ON PRODUCTION BUILD, Android and iOS dev build works.
          switch (manualFlowState.flowStep) {
            case "native":
              return manualFlowState.siteUrl && manualFlowState.siteInfo ? (
                <NativeFlow
                  siteUrl={manualFlowState.siteUrl}
                  siteInfo={manualFlowState.siteInfo}
                  onSetupSecretSuccess={onSetupSecretSuccess}
                  onManualFlowCancel={onManualFlowCancel}
                  onSetupSecretFailure={onSetupSecretFailure}
                />
              ) : (
                <StartStep />
              );
            case "webview":
              return manualFlowState.siteUrl && manualFlowState.siteInfo ? (
                <WebviewFlow
                  siteUrl={manualFlowState.siteUrl}
                  siteInfo={manualFlowState.siteInfo}
                  onSetupSecretSuccess={onSetupSecretSuccess}
                  onManualFlowCancel={onManualFlowCancel}
                  onSetupSecretFailure={onSetupSecretFailure}
                />
              ) : (
                <StartStep />
              );
            case "browser":
              return manualFlowState.siteUrl ? (
                <BrowserLogin
                  siteUrl={manualFlowState.siteUrl}
                  onManualFlowCancel={onManualFlowCancel}
                />
              ) : (
                <StartStep />
              );
            case "incompatible":
              return (
                <IncompatibleApiModal
                  onCancel={onManualFlowCancel}
                  siteUrl={manualFlowState.siteUrl}
                />
              );
            case "done":
              return null;
            case "siteUrl":
              return <StartStep />;
          }
        })()}
      </View>
    );
  }
};

type PropSiteError = {
  onCancel: () => void;
};

const SiteErrorModal = ({ onCancel }: PropSiteError) => (
  <InfoModal
    title={translate("site_url.auth_invalid_site.title")}
    description={translate("site_url.auth_invalid_site.description")}
    imageType={"url_not_valid"}
    visible={true}>
    <PrimaryButton
      text={translate("site_url.auth_invalid_site.action_primary")}
      onPress={onCancel}
    />
  </InfoModal>
);

export default ManualFlow;
