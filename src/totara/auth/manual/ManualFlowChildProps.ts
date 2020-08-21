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

import { SiteInfo } from "@totara/types";

export type ManualFlowChildProps = {
  siteUrl: string;
  siteInfo: SiteInfo;
  onSetupSecretSuccess: (setupSecret: string) => void;
  onSetupSecretFailure: (error: Error) => void;
  onManualFlowCancel: () => void;
};
