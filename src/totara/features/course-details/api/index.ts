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
 * @author Jun Yamog <jun.yamog@totaralearning.com
 *
 */

import {graphql} from "react-apollo";
import gql from "graphql-tag";
import {Course} from "@totara/types";
import {NavigationInjectedProps} from "react-navigation";

const query = gql`
  query course($id: ID!) {
    course(id: $id) {
      id
      type
      shortname
      fullname
      summary
      dueDateState
      dueDate
      progressPercentage
      groupCount
      sections {
        sectionName
        status  
        data {
            id
            type
            itemName
            status
        }
      }  
    }
  }
`;

type CourseId = {
  courseId: number
}

export type Response = {
  getCourse: Course;
} & NavigationInjectedProps<CourseId>

export const getCourse = graphql<NavigationInjectedProps, Response>(
  query,
  {
    options: (props) => ({
      variables: { id: props.navigation.state.params.courseId },
    }),
    props: ( {data} ) => ({...data})
    // needed magic for double HOC, I have no idea why extracting data here makes wrapped totara.components props passed down.  As opposed to extracting data on the calling function
    // it is just stated to be better with static typing, but it doesn't work w/o this.  see: https://www.apollographql.com/docs/react/recipes/static-typing.html#props
  });
