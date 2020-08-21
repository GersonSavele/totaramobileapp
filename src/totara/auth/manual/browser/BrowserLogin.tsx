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

import { PrimaryButton, TertiaryButton, InfoModal } from "@totara/components";
import { translate } from "@totara/locale";
import { ManualFlowChildProps } from "../ManualFlowChildProps";
import { Images } from "@resources/images";

const BrowserLogin = ({
  onManualFlowCancel,
  siteUrl
}: Pick<ManualFlowChildProps, "onManualFlowCancel" | "siteUrl">) => {
  return (
    <InfoModal
      title={translate("browser_login.title")}
      description={translate("browser_login.description")}
      imageSource={Images.browserLogin as ImageSourcePropType}
      visible={true}>
      <PrimaryButton
        text={translate("browser_login.primary_title")}
        onPress={() => {
          Linking.openURL(siteUrl);
        }}
        icon="external-link-alt"
      />
      <TertiaryButton
        text={translate("browser_login.tertiary_title")}
        onPress={() => {
          onManualFlowCancel && onManualFlowCancel();
        }}
      />
    </InfoModal>
  );
};

export default BrowserLogin;
