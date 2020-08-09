/**
 * This file is part of Totara Enterprise.
 *
 * Copyright (C) 2020 onwards Totara Learning Solutions LTD
 *
 * Totara Enterprise is provided only to Totara Learning Solutions
 * LTD’s customers and partners, pursuant to the terms and
 * conditions of a separate agreement with Totara Learning
 * Solutions LTD or its affiliate.
 *
 * If you do not have an agreement with Totara Learning Solutions
 * LTD, you may not access, use, modify, or distribute this software.
 * Please contact [sales@totaralearning.com] for more information.
 * */

import React from "react";
import { ImageSourcePropType, View } from "react-native";

import { AuthFlowChildProps } from "../AuthComponent";
import { IncompatibleApiModal, InfoModal, PrimaryButton } from "@totara/components";
import { translate } from "@totara/locale";
import { fetchData } from "@totara/core/AuthRoutines";

import WebviewFlow from "./webview";
import NativeFlow from "./native";
import BrowserLogin from "./browser";
import { useManualFlow } from "./ManualFlowHook";
import SiteUrl from "./SiteUrl";
import { Images } from "@resources/images";
import { NetworkError, NetworkFailedError } from "@totara/types/Error";

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
              <BrowserLogin siteUrl={manualFlowState.siteUrl} onManualFlowCancel={onManualFlowCancel} />
            ) : (
              <StartStep />
            );
          case "incompatible":
            return <IncompatibleApiModal onCancel={onManualFlowCancel} siteUrl={manualFlowState.siteUrl} />;
          case "done":
            return null;
          case "siteUrl":
            return <StartStep />;
        }
      })()}
      {manualFlowState.siteUrlFailure && (
        <SiteErrorModal onCancel={onManualFlowCancel} siteUrlFailure={manualFlowState.siteUrlFailure} />
      )}
    </View>
  );
};

type PropSiteError = {
  onCancel: () => void;
  siteUrlFailure: NetworkError | NetworkFailedError;
};

const SiteErrorModal = ({ onCancel, siteUrlFailure }: PropSiteError) => {
  const content =
    siteUrlFailure instanceof NetworkFailedError
      ? {
          title: translate("server_not_reachable.title"),
          description: translate("server_not_reachable.message"),
          imageSource: Images.generalError,
          primaryAction: translate("server_not_reachable.go_back")
        }
      : {
          title: translate("site_url.auth_invalid_site.title"),
          description: translate("site_url.auth_invalid_site.description"),
          imageSource: Images.urlNotValid,
          primaryAction: translate("site_url.auth_invalid_site.action_primary")
        };

  return (
    <InfoModal
      visible={true}
      title={content.title}
      description={content.description}
      imageSource={content.imageSource as ImageSourcePropType}>
      <PrimaryButton text={content.primaryAction} onPress={onCancel} />
    </InfoModal>
  );
};

export default ManualFlow;
