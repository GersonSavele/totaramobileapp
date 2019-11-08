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
import { AuthContext, isValidApiVersion } from "@totara/auth/AuthContext";
import { InfoModal} from "./infoModal"
import PrimaryButton from "./PrimaryButton";
import { config } from "@totara/lib";
import { Linking } from "react-native";
import TertiaryButton from "./TertiaryButton";

type Props = {
  onCancel?: () => void
}

const AppModal = ({onCancel}: Props) => {
  const {appState, isAuthenticated, logOut } = useContext(AuthContext);
  const isShowIncompatibleApi = appState ? !isValidApiVersion(appState.siteInfo.version) : true;
  if (isShowIncompatibleApi) 
    return (
    <InfoModal title={translate("general_error_feedback-modal.title")} description={translate("general_error_feedback-modal.description")} imageType={"general_error"}  visible={isShowIncompatibleApi}>
      <PrimaryButton  text={translate("general_error_feedback-modal.tertiary_title")} onPress={() => { appState && Linking.openURL( config.loginUri(appState.host) ) }} />
      { isAuthenticated 
        ?  <TertiaryButton text={translate("additional-actions-modal.auth_model_logout")} onPress={() => { logOut(); }} />
        :  <TertiaryButton text={translate("general.cancel")} onPress={() => {  onCancel && onCancel(); }} />
      }
    </InfoModal>
    );
  else 
    return null;
};



export default AppModal;