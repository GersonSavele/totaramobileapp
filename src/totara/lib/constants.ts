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

// import * as RNFS from "react-native-fs";
// import { config } from ".";

const DEVICE_REGISTRATION = "X-TOTARA-MOBILE-DEVICE-REGISTRATION";
const WEBVIEW_SECRET = "X-TOTARA-MOBILE-WEBVIEW-SECRET";
const AUTHORIZATION = "AUTHORIZATION";
const AUTH_HEADER_FIELD = "x-api-key";

const DATE_FORMAT = "D MMM, YYYY";
const DATE_FORMAT_FULL = "dddd, DD MMMM YYYY, h:mm A";
const SECONDS_FORMAT = "X";

const PLATFORM_IOS = "ios";
const PLATFORM_ANDROID = "";

const SCREEN_WIDTH_X_LARGE = "xlarge";
const SCREEN_WIDTH_LARGE = "large";
const SCREEN_WIDTH_MEDIUM = "medium";
const SCREEN_WIDTH_SMALL = "small";

// eslint-disable-next-line no-undef
// const DEBUG_MODE = __DEV__;
const DEV_ORG_URL = "mobile.demo.totara.software";
const DEV_USERNAME = "kamala";
const DEV_PASSWORD = "Abcd123$";

/* SCORM related */

// const DOWNLOAD_FOLDER = `${RNFS.DocumentDirectoryPath}`;
const TEST_IDS = {
  SITE_URL_INPUT: "SITE_URL_INPUT",
  SUBMIT_URL: "SUBMIT_URL",
  USER_INPUT: "USER_INPUT",
  USER_PW: "USER_PW",
  LOGIN: "LOGIN",
  CLICK_CLOSE: "CLICK_CLOSE"
};

//Current learning related
const CL_TEST_IDS = {
  CL_SWITCH_ID: "CL_SWITCH_ID",
  CL_TAB_2_ID: "CL_TAB_2_ID",
  CAROUSEL_WRAPPER_ID: "CAROUSEL_WRAPPER_ID",
  CL_LIST: "CL_LIST",
  CL_PROGRESS: "CL_PROGRESS"
};

const FILE_EXTENSION = ".zip";
const OFFLINE_SCORM_PREFIX = "OfflineSCORM_";
// const scormZipPackagePath = DOWNLOAD_FOLDER;
// const offlineScormServerRoot = `${scormZipPackagePath}/${config.rootOfflineScormPlayer}`;

// enum scormLessonStatus {
//   incomplete = "incomplete",
//   passed = "passed",
//   completed = "completed",
//   failed = "failed"
// }

enum ActivityModType {
  scorm = "scorm",
  label = "label",
  resource = "resource"
}

export {
  DEVICE_REGISTRATION,
  WEBVIEW_SECRET,
  AUTHORIZATION,
  AUTH_HEADER_FIELD,
  DATE_FORMAT,
  DATE_FORMAT_FULL,
  SECONDS_FORMAT,
  PLATFORM_IOS,
  PLATFORM_ANDROID,
  SCREEN_WIDTH_X_LARGE,
  SCREEN_WIDTH_LARGE,
  SCREEN_WIDTH_MEDIUM,
  SCREEN_WIDTH_SMALL,
  DEV_ORG_URL,
  DEV_USERNAME,
  DEV_PASSWORD,
  OFFLINE_SCORM_PREFIX,
  FILE_EXTENSION,
  // DEBUG_MODE,
  //scormLessonStatus,
  // scormZipPackagePath,
  //offlineScormServerRoot,
  ActivityModType,
  CL_TEST_IDS,
  TEST_IDS
};
