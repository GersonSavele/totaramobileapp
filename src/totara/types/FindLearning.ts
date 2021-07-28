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

import { learningItemEnum } from "@totara/features/currentLearning/constants";

export interface CatalogItem {
  id: number;
  itemid: number;
  item_type: learningItemEnum.Course | learningItemEnum.Playlist;
  title: string;
  mobile_image?: string;
  description?: string;
}

export interface FindLearningPage {
  max_count: number;
  pointer: number;
  final_page: boolean;
  items: [CatalogItem?];
}
