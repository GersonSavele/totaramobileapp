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
import { compose, graphql, MutationFunc, MutationOpts } from "react-apollo";
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

class AuthenticatedWebViewComponent extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      webviewSecret: undefined
    };

  }

  componentDidMount() {
    const { createWebview, uri } = this.props;

    createWebview({ variables: { url: uri } })
      .then((data) => {
        console.log("data on create", data);

        this.setState({
          webviewSecret: data.data.create_webview,
          isAuthenticated: true
        });
      });
  }

  componentWillUnmount() {
    const { deleteWebview } = this.props;
    if (this.state.webviewSecret) {
      deleteWebview({ variables: { secret: this.state.webviewSecret } })
        .then((data) => console.log("data after delete", data));
    }
  }

  render() {
    return (
      (this.state.webviewSecret)
        ? <WebView
          source={{
            uri: config.webViewUri,
            headers: { "X-TOTARA-MOBILE-WEBVIEW-SECRET": this.state.webviewSecret }
          }}
          userAgent={config.userAgent}
          incognito={true} // needed for now, as we need fresh session w/o cookies
          style={{ flex: 1 }}/>
        : null
    );
  }

};


type CreateWebViewResponse = {
  create_webview: string;
}

type DeleteWebViewResponse = {
  delete_webview: string;
}

type Props = {
  uri: string
  createWebview: MutationFunc<CreateWebViewResponse, { url: string }>
  deleteWebview: MutationFunc<DeleteWebViewResponse, { secret: string }>
}

type State = {
  isAuthenticated: boolean
  webviewSecret?: string
}

const AuthenticatedWebView = compose(
  graphql(createWebview, { name: "createWebview" }),
  graphql(deleteWebview, { name: "deleteWebview" }),
)(AuthenticatedWebViewComponent);


export { AuthenticatedWebView };

