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
 */

import * as RNFS from "react-native-fs";
import { config } from "@totara/lib";

const SCORM_TEST_IDS = {
  LOADING_ID: "loading",
  SUMMARY_ID: "summary",
  ATTEMPTS_LIST_ID: "attempts_list",
  ATTEMPT_ITEM_ID: "attempt_item",
  NONE_EXIST_RESOURCE_ID: "no_resource",
  INVALID_SCORM_ID: "invalid_scorm",
  OFFLINE_PLAYER_ID: "offline_player",
  ATTEMPT_FEEDBACK: "attempt_feedback",
  INVALID_URL_ID: "invalid_url",
  ONLINE_PLAYER_ID: "online_player"
};

const DOWNLOAD_FOLDER = `${RNFS.DocumentDirectoryPath}`;

const FILE_EXTENSION = ".zip";
const OFFLINE_SCORM_PREFIX = "OfflineSCORM_";
const scormZipPackagePath = DOWNLOAD_FOLDER;
const offlineScormServerRoot = `${scormZipPackagePath}/${config.rootOfflineScormPlayer}`;

enum ScormLessonStatus {
  incomplete = "incomplete",
  passed = "passed",
  completed = "completed",
  failed = "failed"
}

export {
  SCORM_TEST_IDS,
  FILE_EXTENSION,
  OFFLINE_SCORM_PREFIX,
  offlineScormServerRoot,
  scormZipPackagePath,
  ScormLessonStatus
};
