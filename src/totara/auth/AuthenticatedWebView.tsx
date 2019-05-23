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

import React from "react";
import { WebView } from "react-native-webview";
import { Text } from "react-native";
import { graphql, Mutation, MutationOpts } from "react-apollo";
import gql from "graphql-tag";

import { config } from "@totara/lib";


const createWebview = gql`
    mutation totara_mobile_create_webview($url: String!) {
        create_webview: totara_mobile_create_webview(url: $url)
    }
`;

const deleteWebview = gql`
    mutation totara_mobile_delete_webview($secret: String!) {
        delete_webview: totara_mobile_delete_webview(secret: $secret)
    }
`;

export type CreateWebViewResponse = {
  create_webview: string;
} & MutationOpts

export type DeleteWebViewResponse = {
  delete_webview: string;
} & MutationOpts


const AuthenticatedWebView = ({}) => {

  return (
    <Mutation mutation={createWebview}>
      { (totara_mobile_create_webview, data) => {

        console.log("create_webview", data);

        if (!data.loading && data.called) {

          return <WebView
            source={{
              uri: config.webViewUri,
              headers: { "X-TOTARA-MOBILE-WEBVIEW-SECRET": data.data.create_webview }
            }}
            userAgent={config.userAgent}
            incognito={true}
          />

        } else if (data.loading) {
          return <Text>Loading...</Text>
        } else if (data.called) {
          return <Text>Called</Text>
        } else {
          totara_mobile_create_webview({ variables: { url: "/totara/plan/index.php" } });
          return <Text>start</Text>
        }
      }

      }
    </Mutation>

  );


};


export { AuthenticatedWebView };

