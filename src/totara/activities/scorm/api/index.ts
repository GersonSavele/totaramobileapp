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
 * @author Tharaka Dushmantha <tharaka.dushmantha@totaralearning.com
 */

import gql from "graphql-tag";

const scormQuery = gql`
  query totara_mobile_scorm($scormid: core_id!) {
    scorm: mod_scorm_scorm(scormid: $scormid) {
      id
      courseid
      name
      scormtype
      reference
      intro(format: PLAIN)
      version
      maxgrade
      grademethod
      whatgrade
      maxattempt
      forcecompleted
      forcenewattempt
      lastattemptlock
      masteryoverride
      displaycoursestructure
      skipview
      nav
      navpositionleft
      navpositiontop
      auto
      width
      height
      timeopen
      timeclose
      displayactivityname
      autocommit
      allowmobileoffline
      completion
      completionview
      completionstatusrequired
      completionscorerequired
      completionstatusallscos
      packageUrl: package_url
      launchUrl: launch_url
      repeatUrl: repeat_url
      attemptsCurrent: attempts_current
      calculatedGrade: calculated_grade
      offlinePackageUrl: offline_package_url
      offlinePackageContentHash: offline_package_contenthash
      offlinePackageScoIdentifiers: offline_package_sco_identifiers
      attempts {
        attempt
        timestarted
        gradereported
        defaults
        objectives
        interactions
      }
      # Deprecated properties
      type: scormtype
      description: intro(format: PLAIN)
      attemptsMax: maxattempt
      attemptsCurrent: attempts_current
      attemptsForceNew: forcenewattempt
      attemptsLockFinal: lastattemptlock
      autoContinue: auto
      offlineAttemptsAllowed: allowmobileoffline
      __typename
    }
  }
`;

/**
 * returns an map object with all scorms
 */
const scormActivitiesRecordsQuery = gql`
  query get_scorm_bundle {
    scormBundles @client
  }
`;

const scormFeedbackQuery = gql`
  query totara_mobile_scorm_current_status($scormid: core_id!) {
    scorm: mod_scorm_current_status(scormid: $scormid) {
      maxattempt
      attempts_current
      completion
      completionview
      completionstatusrequired
      completionscorerequired
      completionstatusallscos
      completionstatus
      gradefinal
      grademax
      gradepercentage
      __typename
    }
  }
`;

const mutationAttempts = gql`
  mutation mod_scorm_save_offline_attempts(
    $scormid: core_id!
    $attempts: [mod_scorm_attempt!]!
  ) {
    attempts: mod_scorm_save_offline_attempts(
      scormid: $scormid
      attempts: $attempts
    ) {
      attempts_accepted
      maxattempt
      attempts_current
      completion
      completionview
      completionstatusrequired
      completionscorerequired
      completionstatusallscos
      completionstatus
      gradefinal
      grademax
      gradepercentage
    }
  }
`;

export {
  scormQuery,
  scormFeedbackQuery,
  scormActivitiesRecordsQuery,
  mutationAttempts
};
