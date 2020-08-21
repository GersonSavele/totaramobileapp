/**
 * This file is part of Totara Enterprise.
 *
 * Copyright (C) 2019 onwards Totara Learning Solutions LTD
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

import * as React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { Me } from "@totara/types";

type Response = {
  me: Me;
};

export type QueryResult = {
  loading: boolean;
  data: Response;
  error: Error;
  refetch: () => void;
};

const QueryMe = gql`
  query totara_mobile_me {
    me: totara_mobile_me {
      user {
        id
        firstname
        lastname
        fullname
        email
      }
      system {
        wwwroot
        apiurl
        release
        request_policy_agreement
        request_user_consent
        request_user_fields
        password_change_required
      }
    }
  }
`;

const GetMe = ({ props }: any) => {
  return (
    <Query<Response> query={QueryMe}>
      {({ loading, data, error, refetch }) =>
        props({
          loading: loading,
          data: data,
          error: error,
          refetch: refetch
        })
      }
    </Query>
  );
};

export { GetMe, QueryMe };
