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
import { AuthContext } from "@totara/auth/AuthContext";
import { InfoModal} from "./infoModal"
import PrimaryButton from "./PrimaryButton";
import { config } from "@totara/lib";


const AppModal = () => {
  const isShowIncompatibleApi = !isValidApiVersion();
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
const isValidApiVersion = () => {
  const {setup} = useContext(AuthContext);
  return (setup && (config.minApiVersion <= setup.apiVersion));
};

export default AppModal;