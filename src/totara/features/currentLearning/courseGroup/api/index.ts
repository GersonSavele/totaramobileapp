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

import gql from "graphql-tag";

const coreProgram = gql`
  query totara_mobile_program($programid: core_id!) {
    totara_mobile_program(programid: $programid) {
      id
      fullname
      shortname
      duedate(format: ISO8601)
      duedateState: duedate_state(format: PLAIN)
      summary(format: PLAIN)
      endnote(format: PLAIN)
      availablefrom(format: ISO8601)
      availableuntil(format: ISO8601)
      imageSrc: mobile_image
      completion {
        id
        statusKey: statuskey
        progress
        __typename
      }
      currentCourseSets: current_coursesets {
        id
        label
        nextSetOperator: nextsetoperator
        completionCriteria: criteria
        courses {
          id
          itemtype
          itemcomponent
          shortname
          fullname
          summary: description(format: PLAIN)
          progress
          urlView: url_view
          duedate(format: ISO8601)
          duedateState: duedate_state
          native: mobile_coursecompat
          imageSrc: mobile_image
          __typename
        }
        __typename
      }
      countUnavailableSets: count_unavailablesets
      __typename
    }
  }
`;

const coreCertification = gql`
  query totara_mobile_certification($certificationid: core_id!) {
    totara_mobile_certification(certificationid: $certificationid) {
      id
      fullname
      shortname
      duedate(format: ISO8601)
      duedateState: duedate_state(format: PLAIN)
      summary(format: PLAIN)
      summaryformat
      endnote(format: PLAIN)
      availablefrom(format: ISO8601)
      availableuntil(format: ISO8601)
      imageSrc: mobile_image
      completion {
        id
        statusKey: statuskey
        renewalStatusKey: renewalstatuskey
        progress
        __typename
      }
      currentCourseSets: current_coursesets {
        id
        label
        nextSetOperator: nextsetoperator
        completionCriteria: criteria
        courses {
          id
          itemtype
          itemcomponent
          shortname
          fullname
          summary: description(format: PLAIN)
          progress
          urlView: url_view
          duedate(format: ISO8601)
          duedateState: duedate_state
          native: mobile_coursecompat
          imageSrc: mobile_image
          __typename
        }
        __typename
      }
      countUnavailableSets: count_unavailablesets
      __typename
    }
  }
`;

export { coreProgram, coreCertification };
