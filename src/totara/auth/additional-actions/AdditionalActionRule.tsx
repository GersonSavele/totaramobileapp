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

import React, { ReactNode } from "react";
import { GetMe, QueryResult } from "./api";

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
        if (error) return <GeneralErrorModal />;
        if (
          data &&
          AdditionalActionRuleCondition(
            data.me.system.request_policy_agreement,
            data.me.system.request_user_consent,
            data.me.system.request_user_fields,
            data.me.system.password_change_required
          )
        ) {
          return <AppStateListener onActive={refetch}>{children}</AppStateListener>;
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
  userFields: boolean,
  changePassword: boolean
) => {
  if (policyAgreement || userConsent || userFields || changePassword) {
    return true;
  } else {
    return false;
  }
};

export { AdditionalActionRule, AdditionalActionRuleCondition };
