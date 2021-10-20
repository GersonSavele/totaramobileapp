/**
 * This file is part of Totara Enterprise.
 *
 * Copyright (C) 2021 onwards Totara Learning Solutions LTD
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

import { learningItemEnum } from "@totara/features/constants";

export interface CatalogItem {
  id: number;
  itemid: number;
  itemType: learningItemEnum.Course | learningItemEnum.Playlist | learningItemEnum.Resource;
  title: string;
  mobileImage?: string;
  summary?: string;
  summaryFormat: string;
  viewUrl?: string;
}

export interface FindLearningPage {
  maxCount: number;
  pointer: number;
  finalPage: boolean;
  items?: [CatalogItem];
}
