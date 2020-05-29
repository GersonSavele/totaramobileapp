/**
 * This file is part of Totara Enterprise.
 *
 * Copyright (C) 2020 onwards Totara Learning Solutions LTD
 *
 * Totara Enterprise is provided only to Totara Learning Solutions
 * LTD’s customers and partners, pursuant to the terms and
 * conditions of a separate agreement with Totara Learning
 * Solutions LTD or its affiliate.
 *
 * If you do not have an agreement with Totara Learning Solutions
 * LTD, you may not access, use, modify, or distribute this software.
 * Please contact [sales@totaralearning.com] for more information.
 *
 * @author Jun Yamog <jun.yamog@totaralearning.com
 *
 */

import OfflineScormActivity from "./OfflineScormActivity";
import { getScormPackageData } from "./PackageProcessor";
import {
  initializeScormWebplayer,
  unzipScormPackageToServer,
  isScormPlayerInitialized
} from "./SCORMFileHandler";
import { getScormAttemptData, getLastAttemptScore } from "./StorageHelper";
import AttemptSynchronizer from "./AttemptSynchronizer";
import { calculatedAttemptsGrade } from "./offlineScormController";

export {
  OfflineScormActivity,
  getScormPackageData,
  initializeScormWebplayer,
  unzipScormPackageToServer,
  isScormPlayerInitialized,
  getScormAttemptData,
  getLastAttemptScore,
  AttemptSynchronizer,
  calculatedAttemptsGrade
};
