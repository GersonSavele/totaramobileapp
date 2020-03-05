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
 * @author Jun Yamog <jun.yamog@totaralearning.com>
 *
 */

import gql from "graphql-tag";

const coreCourse = gql`
  query totara_mobile_course($courseid: ID!) {
      course: core_course(courseid: $courseid) {
          id
          fullname
          shortname
          summary(format: PLAIN)
          startdate(format: ISO8601)
          enddate(format: ISO8601)
          lang
          imageSrc: image
          sections {
              id
              title
              available
              availablereason(format: PLAIN)
              data: modules {
                  id
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
              }
          }
          completion {
              id
              statuskey
              progress
              timecompleted(format: ISO8601)
              gradefinal
              grademax
          }
      }
  }
`;

export { coreCourse };