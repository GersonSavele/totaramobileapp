/**
 *
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
 *
 */

import React, { useState } from "react";
import { Linking, ImageSourcePropType } from "react-native";
import PrimaryButton from "./PrimaryButton";
import InfoModal from "./InfoModal";
import TertiaryButton from "./TertiaryButton";

import { translate } from "@totara/locale";
import { Images } from "@resources/images";

type GeneralErrorModalProps = {
  primaryActionCustomText?: string;
  onPrimaryActionTap?: () => void;
  siteUrl?: string;
};

const GeneralErrorModal = ({ siteUrl, onPrimaryActionTap, primaryActionCustomText }: GeneralErrorModalProps) => {
  const [visible, setVisible] = useState(true);

  return (
    <InfoModal
      title={translate("general_error_feedback_modal.title")}
      description={translate("general_error_feedback_modal.description")}
      imageSource={Images.generalError as ImageSourcePropType}
      visible={visible}>
      <PrimaryButton
        testID={"test_generalErrorDismiss"}
        text={primaryActionCustomText ?? translate("general_error_feedback_modal.action_primary")}
        onPress={() => {
          setVisible(!visible);
          if (onPrimaryActionTap) {
            onPrimaryActionTap();
          }
        }}
      />
      {siteUrl && siteUrl.length > 0 && (
        <TertiaryButton
          testID={"test_generalErrorOpenURL"}
          text={translate("general_error_feedback_modal.action_tertiary")}
          onPress={() => {
            Linking.openURL(siteUrl);
          }}
        />
      )}
    </InfoModal>
  );
};

export default GeneralErrorModal;
