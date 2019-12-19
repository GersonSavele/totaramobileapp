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

import * as React from 'react'
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { Me } from "@totara/types";

type Response = {
    me: Me;
}

export type QueryResult = {
    loading : boolean,
    data : Response,
    error : Error,
    refetch: () => void
}

const QueryMe = gql` 
query totara_mobile_me {
    me: totara_mobile_me {
        user {
            id,
            firstname,
            lastname,
            fullname,
            email,
        },
        system {
            wwwroot,
            apiurl,
            release,
            request_policy_agreement,
            request_user_consent,
            request_user_fields,
        }
    }
}
`;

const GetMe = ({props} : any) => {
   return (<Query <Response>  query = { QueryMe }>
    {({ loading, data, error, refetch }) =>
       props({
        loading : loading,
        data : data,
        error : error,
        refetch: refetch
       })
     }
    </Query>)
}

export  { GetMe, QueryMe };
