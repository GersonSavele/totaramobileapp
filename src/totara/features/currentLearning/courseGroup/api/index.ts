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
  query program($id: ID!) {
    program(id: $id) {
      id
      itemtype
      shortname
      fullname
      summary
      duedateState
      duedate
      progress
      imageSrc
      courseSet {
        id
        label
        courses {
          id
          itemtype
          shortname
          fullname
          summary
          progress
          status
          imageSrc
        }
        nextSet {
          nextID
          operator
        }
      }
    }
  }
`;

const coreCertification = gql`
  query certification($id: ID!) {
    certification(id: $id) {
      id
      itemtype
      shortname
      fullname
      summary
      duedateState
      duedate
      progress
      imageSrc
      courseSet {
        id
        label
        courses {
          id
          itemtype
          shortname
          fullname
          summary
          progress
          status
          imageSrc
        }
        nextSet {
          nextID
          operator
        }
      }
    }
  }
`;

export { coreProgram, coreCertification };
