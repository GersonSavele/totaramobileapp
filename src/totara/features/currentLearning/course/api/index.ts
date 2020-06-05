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

const coreCourse = gql`
  query totara_mobile_course($courseid: ID!) {
    mobile_course: totara_mobile_course(courseid: $courseid) {
      course(courseid: $courseid) {
        id
        fullname
        shortname
        summary(format: PLAIN)
        startdate(format: ISO8601)
        enddate(format: ISO8601)
        lang
        image
        sections {
          id
          title
          available
          availablereason(format: PLAIN)
          data: modules {
            id
            instanceid
            modtype
            name
            available
            availablereason(format: PLAIN)
            viewurl
            completion
            completionstatus
            showdescription
            description(format: PLAIN)
            gradefinal
            gradepercentage
            __typename
          }
          __typename
        }
        criteriaaggregation
        criteria {
          id
          type
          typeaggregation
          criteria
          requirement
          status
          complete
          completiondate(format: ISO8601)
          __typename
        }
        completion {
          id
          statuskey
          progress
          timecompleted(format: ISO8601)
          gradefinal
          grademax
          __typename
        }
        __typename
      }
      native: mobile_coursecompat
      imageSrc: mobile_image
      __typename
    }
  }
`;

const courseSelfComplete = gql`
  mutation totara_mobile_completion_course_self_complete($courseid: core_id!) {
    core_completion_course_self_complete(courseid: $courseid)
  }
`;

export { coreCourse, courseSelfComplete };
