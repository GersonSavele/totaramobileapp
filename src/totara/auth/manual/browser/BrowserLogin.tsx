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
 * @author Tharaka Dushmantha <tharaka.dushmantha@totaralearning.com>
 */

import React from "react";
import { Linking } from "react-native";

import { PrimaryButton, TertiaryButton, InfoModal } from "@totara/components";
import { translate } from "@totara/locale";
import { ManualFlowChildProps } from "../ManualFlowChildProps";

const BrowserLogin = ({ onSetupSecretCancel, siteUrl }: ManualFlowChildProps) => {
  return (
    <InfoModal
      title={translate("browser_login.title")}
      description={translate("browser_login.description")}
      imageType={"browser_login"}
      visible={true}
    >
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
          onSetupSecretCancel && onSetupSecretCancel();
        }}
      />
    </InfoModal>
  );
};

export default BrowserLogin;
