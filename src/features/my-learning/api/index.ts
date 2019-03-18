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

import {ChildDataProps, graphql} from "react-apollo";
import gql from "graphql-tag";

const query = gql`
  query CurrentLearning {
    currentLearning {
      id
      type
      shortname
      fullname
      summary
      dueDateState
      dueDate
      progressPercentage
      groupCount
      activities {
        id
        type
        itemName
      }
    }
  }
`;

export type Activity = {
  id: number,
  type: string,
  itemName: string
}

export type LearningItem = {
  id: number
  type: string
  shortname: string
  fullname?: string
  summary?: string
  dueDateState?: string
  dueDate?: Date
  progressPercentage?: number
  groupCount?: number
};

export type Response = {
  currentLearning: LearningItem[];
}

type ChildProps = ChildDataProps<{}, Response>

type Variables = {}

export const learningItemsList = graphql<{}, Response>(
  query,
  {
    props: ( {data} ) => ({...data})
    // needed magic for double HOC, I have no idea why extracting data here makes wrapped components props passed down.  As opposed to extracting data on the calling function
    // it is just stated to be better with static typing, but it doesn't work w/o this.  see: https://www.apollographql.com/docs/react/recipes/static-typing.html#props
  });
