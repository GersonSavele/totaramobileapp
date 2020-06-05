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
 */

import React from "react";
import { Linking } from "react-native";
import { translate } from "@totara/locale";
import { PrimaryButton, InfoModal, TertiaryButton } from "@totara/components";
import { AuthConsumer } from "@totara/core";

type Props = {
  onClose: () => void;
  urlView: string;
};

const Restriction = ({ onClose, urlView }: Props) => {
  return (
    <InfoModal
      transparent={true}
      title={translate("current_learning.restriction_view.title")}
      description={translate("current_learning.restriction_view.description")}
      imageType="course_compatible"
      visible>
      <AuthConsumer>
        {(auth) =>
          auth.authContextState.appState &&
          auth.authContextState.appState.host && (
            <PrimaryButton
              onPress={() => {
                Linking.openURL(urlView);
              }}
              text={translate(
                "current_learning.restriction_view.primary_button_title"
              )}
              icon="external-link-alt"
              style={{ alignSelf: "center" }}
            />
          )
        }
      </AuthConsumer>
      <TertiaryButton
        text={translate(
          "current_learning.restriction_view.tertiary_button_title"
        )}
        onPress={onClose}
      />
    </InfoModal>
  );
};

export default Restriction;
