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

import React, { useContext } from "react";

import { translate } from "@totara/locale";
import { AuthContext } from "@totara/core";
import { isValidApiVersion } from "@totara/core/AuthContext"; // TODO for clean up
import InfoModal from "./InfoModal";
import PrimaryButton from "./PrimaryButton";
import { config } from "@totara/lib";
import { Linking, ImageSourcePropType } from "react-native";
import TertiaryButton from "./TertiaryButton";
import { Images } from "@resources/images";

type Props = {
  onCancel?: () => void;
  siteUrl?: string;
};

const IncompatibleApiModal = ({ onCancel, siteUrl }: Props) => {
  const {
    authContextState: { isAuthenticated, appState },
    logOut
  } = useContext(AuthContext);
  const isShowIncompatibleApi = appState ? !isValidApiVersion(appState.siteInfo.version) : true;
  const site = appState ? appState.host : siteUrl;
  if (isShowIncompatibleApi)
    return (
      <InfoModal
        title={translate("incompatible_api.title")}
        description={translate("incompatible_api.description")}
        imageSource={Images.urlNotValid as ImageSourcePropType}
        visible={isShowIncompatibleApi}>
        {site && (
          <PrimaryButton
            text={translate("incompatible_api.action_primary")}
            onPress={() => {
              Linking.openURL(config.loginUri(site));
            }}
          />
        )}
        {isAuthenticated ? (
          <TertiaryButton
            text={translate("incompatible_api.action_tertiary")}
            onPress={() => {
              logOut();
            }}
          />
        ) : (
          <TertiaryButton
            text={translate("incompatible_api.action_tertiary_cancel")}
            onPress={() => {
              onCancel && onCancel();
            }}
          />
        )}
      </InfoModal>
    );
  else return null;
};

export default IncompatibleApiModal;
