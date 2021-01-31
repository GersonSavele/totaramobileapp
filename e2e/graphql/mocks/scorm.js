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

const defaultScormData = {
  id: "30",
  courseid: "36",
  showGrades: false,
  name: "Mock name of Report in Totara Learn",
  scormtype: "local",
  reference: "test.zip",
  intro: "Mock introduction",
  introformat: "HTML",
  version: "SCORM_1.2",
  maxgrade: 100,
  grademethod: "0",
  whatgrade: "0",
  maxattempt: null,
  forcecompleted: false,
  forcenewattempt: false,
  lastattemptlock: false,
  masteryoverride: true,
  displaycoursestructure: false,
  skipview: 0,
  nav: 1,
  navpositionleft: -100,
  navpositiontop: -100,
  auto: false,
  width: 100,
  height: 500,
  timeopen: null,
  timeclose: null,
  displayactivityname: true,
  autocommit: false,
  allowmobileoffline: false,
  completion: 1,
  completionview: false,
  completionstatusrequired: null,
  completionscorerequired: null,
  completionstatusallscos: false,
  packageUrl:
    "https://mobile.demo.totara.software/totara/mobile/pluginfile.php/858/mod_scorm/package/0/test.zip?forcedownload=1",
  launchUrl: "https://mobile.demo.totara.software/mod/scorm/player.php?mode=normal&newattempt=on&cm=462&scoid=0",
  repeatUrl: "https://mobile.demo.totara.software/mod/scorm/player.php?mode=normal&newattempt=off&cm=462&scoid=0",
  attemptsCurrent: 8,
  calculatedGrade: "1",
  offlinePackageUrl: null,
  offlinePackageContentHash: null,
  offlinePackageScoIdentifiers: null,
  newAttemptDefaults:
    '{"adapt_scorm":{"cmi.core.student_id":"testuser","cmi.core.student_name":"Tennakoon, Kamala","cmi.core.credit":"credit","cmi.core.entry":"ab-initio","cmi.core.lesson_mode":"normal","cmi.launch_data":"","cmi.student_data.mastery_score":"","cmi.student_data.max_time_allowed":"","cmi.student_data.time_limit_action":"","cmi.core.total_time":"00:00:00","cmi.core.lesson_location":"","cmi.core.lesson_status":"","cmi.core.score.raw":"","cmi.core.score.max":"","cmi.core.score.min":"","cmi.core.exit":"","cmi.suspend_data":"","cmi.comments":"","cmi.student_preference.language":"","cmi.student_preference.audio":"0","cmi.student_preference.speed":"0","cmi.student_preference.text":"0"},"item_1":{"cmi.core.student_id":"testuser","cmi.core.student_name":"Tennakoon, Kamala","cmi.core.credit":"credit","cmi.core.entry":"ab-initio","cmi.core.lesson_mode":"normal","cmi.launch_data":"","cmi.student_data.mastery_score":"","cmi.student_data.max_time_allowed":"","cmi.student_data.time_limit_action":"","cmi.core.total_time":"00:00:00","cmi.core.lesson_location":"","cmi.core.lesson_status":"","cmi.core.score.raw":"","cmi.core.score.max":"","cmi.core.score.min":"","cmi.core.exit":"","cmi.suspend_data":"","cmi.comments":"","cmi.student_preference.language":"","cmi.student_preference.audio":"0","cmi.student_preference.speed":"0","cmi.student_preference.text":"0"}}',
  attempts: [
    {
      attempt: 1,
      timestarted: "1594673708",
      gradereported: 1,
      __typename: "mod_scorm_scorm_attempt"
    },
    {
      attempt: 2,
      timestarted: "1595561104",
      gradereported: 1,
      __typename: "mod_scorm_scorm_attempt"
    },
    {
      attempt: 3,
      timestarted: "1596599539",
      gradereported: 1,
      __typename: "mod_scorm_scorm_attempt"
    },
    {
      attempt: 4,
      timestarted: "1596601484",
      gradereported: 1,
      __typename: "mod_scorm_scorm_attempt"
    },
    {
      attempt: 5,
      timestarted: "1597898419",
      gradereported: 1,
      __typename: "mod_scorm_scorm_attempt"
    },
    {
      attempt: 6,
      timestarted: "1598227577",
      gradereported: 1,
      __typename: "mod_scorm_scorm_attempt"
    },
    {
      attempt: 7,
      timestarted: "1598500508",
      gradereported: 1,
      __typename: "mod_scorm_scorm_attempt"
    },
    {
      attempt: 8,
      timestarted: "1606711313",
      gradereported: 1,
      __typename: "mod_scorm_scorm_attempt"
    }
  ],
  type: "local",
  description: "Mock description",
  attemptsMax: null,
  attemptsForceNew: false,
  attemptsLockFinal: false,
  autoContinue: false,
  offlineAttemptsAllowed: false,
  __typename: "mod_scorm_scorm"
};
const defaultScorm = {
  mod_scorm_scorm: () => ({ ...defaultScormData })
};
module.exports = {
  defaultScorm
};
