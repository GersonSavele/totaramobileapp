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

import type { AppliedTheme } from '@totara/theme/Theme';

/** @deprecated */
export type SiteInfo = {
  auth: string;
  siteMaintenance: boolean;
  theme?: AppliedTheme;
  version: string;
};

/** @deprecated */
export type AppState = {
  apiKey: string;
  host: string;
  siteInfo: SiteInfo;
};

export interface Setup {
  secret?: string;
  uri: string;
  siteInfo?: SiteInfo;
}
