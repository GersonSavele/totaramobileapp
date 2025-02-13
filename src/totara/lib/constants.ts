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

const DEVICE_REGISTRATION = 'X-TOTARA-MOBILE-DEVICE-REGISTRATION';
const WEBVIEW_SECRET = 'X-TOTARA-MOBILE-WEBVIEW-SECRET';
const AUTHORIZATION = 'AUTHORIZATION';
const AUTH_HEADER_FIELD = 'x-api-key';

const DATE_FORMAT = 'D MMM, YYYY';
const DATE_FORMAT_FULL = 'dddd, DD MMMM YYYY, h:mm A';
const SECONDS_FORMAT = 'X';

const PLATFORM_IOS = 'ios';
const PLATFORM_ANDROID = 'android';
const ANDROID_STATUSBAR_HEIGHT = 75;

const SCREEN_WIDTH_X_LARGE = 'xlarge';
const SCREEN_WIDTH_LARGE = 'large';
const SCREEN_WIDTH_MEDIUM = 'medium';
const SCREEN_WIDTH_SMALL = 'small';

const FILE_EXTENSION = '.zip';
const OFFLINE_SCORM_PREFIX = 'OfflineSCORM_';

enum ActivityModType {
  scorm = 'scorm',
  label = 'label',
  resource = 'resource'
}

const DEFAULT_LANGUAGE = 'en';

const PULL_TO_REFRESH_OFFSET = 50;

enum SubPlugin {
  findLearning = 'findlearning'
}

export {
  ActivityModType,
  ANDROID_STATUSBAR_HEIGHT,
  AUTH_HEADER_FIELD,
  AUTHORIZATION,
  DATE_FORMAT,
  DATE_FORMAT_FULL,
  DEFAULT_LANGUAGE,
  DEVICE_REGISTRATION,
  FILE_EXTENSION,
  OFFLINE_SCORM_PREFIX,
  PLATFORM_ANDROID,
  PLATFORM_IOS,
  PULL_TO_REFRESH_OFFSET,
  SCREEN_WIDTH_LARGE,
  SCREEN_WIDTH_MEDIUM,
  SCREEN_WIDTH_SMALL,
  SCREEN_WIDTH_X_LARGE,
  SECONDS_FORMAT,
  SubPlugin,
  WEBVIEW_SECRET
};
