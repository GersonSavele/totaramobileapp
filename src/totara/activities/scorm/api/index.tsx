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

import React from "react";
import gql from "graphql-tag";
import { ScormActivity } from "@totara/types";
import { Query } from "react-apollo";
import console = require("console");
import { View } from "native-base";


class ScormQuery extends Query<Response, Variables> {}

type Response = {
    scorm: ScormActivity;
  }
  
interface Variables {
    id: number;
  }

const ScormGQLQuery = gql` 
query scorm($id: ID!) {
    scorm(id: $id) {
      id
      webEntryUrl
      currentAttempt
      maxAttempt
      score
      isAvailable
    }
  }
`;

const GetScormQuery = ({props,id}: any) => {
   <ScormQuery  query= { ScormGQLQuery } variables = {{ id : id }}>
    {props}
   </ScormQuery>
}



export default GetScormQuery;
