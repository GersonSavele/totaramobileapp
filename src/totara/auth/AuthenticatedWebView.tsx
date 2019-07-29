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
import { compose, graphql, MutationFunc } from "react-apollo";
import gql from "graphql-tag";
import CookieManager from "react-native-cookies";

import { config, Log } from "@totara/lib";
import { AuthConsumer } from "@totara/auth/AuthContext";
import { WEBVIEW_SECRET } from "@totara/lib/Constant";

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

/**
 *  AuthenticatedWebViewComponent will create a webview that has been logged into Totara.
 *  It would use the api to request create webview when component is mounted.  Then use
 *  the api to request delete webview when unmounted.
 *
 *  Cookies are cleared when component is mounted, this is required by Totara web for a
 *  secure login.  This does mean that we can only have 1 webview session at a time.
 *  This can be possibly be improved in the future by conditionally clearing the cookies
 *  if an existing session exists (either webview, cookie is still valid)
 */
class AuthenticatedWebViewComponent extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      webviewSecret: undefined
    };

  }

  async componentDidMount() {
    const { createWebview, uri } = this.props;

    const createWebViewPromise = createWebview({ variables: { url: uri } })
      .then((data) => {
        Log.debug("created webview", data);

        this.setState({
          webviewSecret: data.data.create_webview,
          isAuthenticated: true
        });
      });

    const clearCookiesPromise = CookieManager.clearAll(true);

    return Promise.all([createWebViewPromise, clearCookiesPromise]);
  }

  async componentWillUnmount() {
    const { deleteWebview } = this.props;
    if (this.state.webviewSecret) {
      return deleteWebview({ variables: { secret: this.state.webviewSecret } })
        .then((data) => Log.debug("deleted webview", data));
    }
  }

  render() {
    return (
      <AuthConsumer>
        {auth =>
          (this.state.webviewSecret && auth.setup)
            ? <WebView
                source={{
                  uri: config.webViewUri(auth.setup.host),
                  headers: { [WEBVIEW_SECRET]: this.state.webviewSecret }
                }}
                userAgent={config.userAgent}
                style={{ flex: 1}}
                />
            : null // TODO MOB-65 handle this error better.  Log or show something like error screen/text, ask UX if this the preferred solution
        }
      </AuthConsumer>

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

