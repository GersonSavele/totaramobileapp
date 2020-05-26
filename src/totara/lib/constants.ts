/**
 * This file is part of Totara Mobile
 *
 * Copyright (C) 2019 onwards Totara Learning Solutions LTD
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @author Tharaka Dushmantha <tharaka.dushmantha@totaralearning.com>
 */

const DEVICE_REGISTRATION = "X-TOTARA-MOBILE-DEVICE-REGISTRATION";
const WEBVIEW_SECRET = "X-TOTARA-MOBILE-WEBVIEW-SECRET";
const AUTHORIZATION = "AUTHORIZATION";

const DATE_FORMAT = "D MMM, YYYY";
const DATE_FORMAT_FULL = "dddd, DD MMMM YYYY, h:mm A";
const SECONDS_FORMAT = "X";

const PLATFORM_IOS = "ios";
const PLATFORM_ANDROID = "";

const NAVIGATION_SETTING = "Settings";
const NAVIGATION_MY_LEARNING = "MyLearning";

const SCREEN_WIDTH_X_LARGE = "xlarge";
const SCREEN_WIDTH_LARGE = "large";
const SCREEN_WIDTH_MEDIUM = "medium";
const SCREEN_WIDTH_SMALL = "small";

// eslint-disable-next-line no-undef
const DEBUG_MODE = __DEV__;
const DEV_ORG_URL = "mobile.demo.totara.software";
const DEV_USERNAME = "kamala";
const DEV_PASSWORD = "Abcd123$";

/**
 * Types of learning cards
 * This is based on data from the server side
 */
enum learningItemEnum {
  Course = "course",
  Program = "program",
  Certification = "certification"
}

// Navigation screen ids, based on how we name the route ids
const NAVIGATION_COURSE_DETAILS = "CourseDetails";
const NAVIGATION_COURSE_GROUP_DETAILS = "CourseGroupDetails"; //either LearningItemEnum.Program or LearningItemEnum.Certificate

const itemToRouteMap = {
  [learningItemEnum.Course]: NAVIGATION_COURSE_DETAILS,
  [learningItemEnum.Program]: NAVIGATION_COURSE_GROUP_DETAILS,
  [learningItemEnum.Certification]: NAVIGATION_COURSE_GROUP_DETAILS
};

enum scormLessonStatus {
  passed = "passed",
  completed = "completed",
  failed = "failed"
}

enum completionTrack {
  trackingManual = "tracking_manual",
  trackingNone = "tracking_none",
  trackingAutomatic = "tracking_automatic"
}

enum completionStatus {
  incomplete = "incomplete",
  complete = "complete",
  completePass = "complete_pass",
  completeFail = "complete_fail",
  unknown = "unknown"
}

enum courseCriteria {
  selfComplete = "Self completion"
}

enum StatusKey {
  completeViaRpl = "completeviarpl",
  complete = "complete",
  inProgress = "inprogress",
  notYetStarted = "notyetstarted"
}

enum scormActivityType {
  summary,
  offline,
  online
}
enum scormSummarySection {
  none,
  attempts
}

export {
  DEVICE_REGISTRATION,
  WEBVIEW_SECRET,
  AUTHORIZATION,
  DATE_FORMAT,
  DATE_FORMAT_FULL,
  SECONDS_FORMAT,
  PLATFORM_IOS,
  PLATFORM_ANDROID,
  NAVIGATION_COURSE_DETAILS,
  NAVIGATION_COURSE_GROUP_DETAILS,
  NAVIGATION_SETTING,
  NAVIGATION_MY_LEARNING,
  SCREEN_WIDTH_X_LARGE,
  SCREEN_WIDTH_LARGE,
  SCREEN_WIDTH_MEDIUM,
  SCREEN_WIDTH_SMALL,
  DEV_ORG_URL,
  DEV_USERNAME,
  DEV_PASSWORD,
  DEBUG_MODE,
  scormLessonStatus,
  scormActivityType,
  scormSummarySection,
  completionTrack,
  completionStatus,
  learningItemEnum,
  itemToRouteMap,
  courseCriteria,
  StatusKey
};
