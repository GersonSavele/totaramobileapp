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
 * @author Tharaka Dushmantha <tharaka.dushmantha@totaralearning.com
 **/

import React, { ReactNode } from "react";
import { GetMe, QueryResult } from "./api";
import { Text } from "react-native";
import AppStateListener from "@totara/components/AppStateListener";
import GeneralErrorModal from "@totara/components/GeneralErrorModal";

type Params = {
  children: ReactNode;
};

const AdditionalActionRule = ({ children }: Params) => {
  return (
    <GetMe
      props={({ loading, data, error, refetch }: QueryResult) => {
        if (loading) return null;
        if (error) return <GeneralErrorModal/>;
        if (
          data &&
          AdditionalActionRuleCondition(
            data.me.system.request_policy_agreement,
            data.me.system.request_user_consent,
            data.me.system.request_user_fields
          )
        ) {
          return (
            <AppStateListener onActive={refetch}>{children}</AppStateListener>
          );
        } else {
          return <AppStateListener onActive={refetch} />;
        }
      }}
    />
  );
};

const AdditionalActionRuleCondition = (
  policyAgreement: boolean,
  userConsent: boolean,
  userFields: boolean
) => {
  if (policyAgreement || userConsent || userFields) {
    return true;
  } else {
    return false;
  }
};

export { AdditionalActionRule, AdditionalActionRuleCondition };