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
 * @author: Kamala Tennakoon <kamala.tennakoon@totaralearning.com>
 */

import React, { useContext } from "react";

import { translate } from "@totara/locale";
import { AuthContext } from "@totara/core";
import { isValidApiVersion } from "@totara/core/AuthContext"; // TODO for clean up
import { InfoModal } from "./infoModal";
import PrimaryButton from "./PrimaryButton";
import { config } from "@totara/lib";
import { Linking } from "react-native";
import TertiaryButton from "./TertiaryButton";

type Props = {
  onCancel?: () => void;
  siteUrl?: string;
};

const IncompatibleApiModal = ({ onCancel, siteUrl }: Props) => {
  const {
    authContextState: { isAuthenticated, appState },
    logOut
  } = useContext(AuthContext);
  const isShowIncompatibleApi = appState
    ? !isValidApiVersion(appState.siteInfo.version)
    : true;
  const site = appState ? appState.host : siteUrl;
  if (isShowIncompatibleApi)
    return (
      <InfoModal
        title={translate("incompatible_api.title")}
        description={translate("incompatible_api.description")}
        imageType={"url_not_valid"}
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
