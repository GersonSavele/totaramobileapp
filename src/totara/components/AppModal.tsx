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

import React, { useContext, useState } from "react";

import { translate } from "@totara/locale";
import { AuthContext, Setup } from "@totara/auth/AuthContext";
import { InfoModal} from "./infoModal"
import PrimaryButton from "./PrimaryButton";
import { config } from "@totara/lib";

enum Compatible {
  Api = 1
}

const AppModal = () => {
  const {setup} = useContext(AuthContext);
  const isShowIncompatibleApi = !isValidApiVersion(setup);
  const [isVisible, setIsVisible] = useState(isShowIncompatibleApi);
  if(isVisible) 
    return (
    <InfoModal title={translate("message.sorry")} description={translate("message.incompatible_api")} imageType={"url_not_valid"} visible={isVisible}>
      <PrimaryButton  text={translate("general.try_again")} onPress={() => { setIsVisible(!isVisible) }} />
    </InfoModal>
    );
  else 
    return null;
};

//TODO-Need to integrate correct logic
export const isValidApiVersion = (setup?: Setup) => {
  if (setup && setup.apiVersion) {
    const compatibilityList = isCompatible(setup.apiVersion)
    return compatibilityList.length > 0
  }
  return false;
};

export const isCompatible = (version: string) => {
  if (config.minApiVersion <= version)
    return [Compatible.Api]
  else 
    return []
};

export default AppModal;