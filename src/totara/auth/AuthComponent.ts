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

import React from "react";

import { Setup } from "@totara/core/AuthHook";

export class AuthComponent<P = {}, S = {}> extends React.Component<AuthFlowChildProps & P, S> {}

export type AuthFlowChildProps = {
  siteUrl?: string;
  onLoginSuccess: (setup: Setup) => Promise<void>;
  onLoginFailure: (error: Error) => Promise<void>;
};
