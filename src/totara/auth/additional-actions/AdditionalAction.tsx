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

import React from "react";
import { Linking, ImageSourcePropType } from "react-native";

import { InfoModal, PrimaryButton, TertiaryButton } from "@totara/components";
import { translate } from "@totara/locale";
import { AuthConsumer, useSession } from "@totara/core";
import { AdditionalActionRule } from "./AdditionalActionRule";
import { Images } from "@resources/images";

class AdditionalAction extends React.Component {
  render() {
    return (
      <AdditionalActionRule>
        <AdditionalActionModal />
      </AdditionalActionRule>
    );
  }
}

const AdditionalActionModal = () => {
  return (
    <InfoModal
      title={translate("additional_actions_modal.auth_model_title")}
      description={translate("additional_actions_modal.auth_model_description")}
      imageSource={Images.actionRequired as ImageSourcePropType}
      visible={true}>
      <ActionButtonPrimary />
      <ActionButtonTertiary />
    </InfoModal>
  );
};

const ActionButtonPrimary = () => {
  const { host } = useSession();
  return (
    <PrimaryButton
      text={translate("additional_actions_modal.auth_model_go_to_browser")}
      icon={"external-link-alt"}
      onPress={() => {
        Linking.openURL(host!);
      }}
    />
  );
};

const ActionButtonTertiary = () => {
  return (
    <AuthConsumer>
      {(auth) => (
        <TertiaryButton
          text={translate("additional_actions_modal.auth_model_logout")}
          onPress={() => {
            auth.logOut();
          }}
        />
      )}
    </AuthConsumer>
  );
};

export default AdditionalAction;
