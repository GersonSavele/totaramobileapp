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

import React, { forwardRef } from "react";
import { WebView, WebViewNavigation } from "react-native-webview";
import { graphql, MutationFunction } from "react-apollo";
import { compose } from "recompose";
import gql from "graphql-tag";
import CookieManager from "@react-native-community/cookies";

import { config, Log } from "@totara/lib";
import { AuthConsumer } from "@totara/core";
import { WEBVIEW_SECRET } from "@totara/lib/constants";
import { Loading, LoadingError } from "@totara/components";

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
      error: undefined,
      isLoading: true,
      isAuthenticated: false,
      webviewSecret: undefined
    };
  }

  async componentDidMount() {
    const { createWebview, uri } = this.props;

    this.setState({ ...this.state, error: undefined, isLoading: true });

    const createWebViewPromise = createWebview({ variables: { url: uri } })
      .then((response) => {
        Log.debug("created webview", response);

        if (response.data) {
          this.setState({
            isLoading: false,
            webviewSecret: response.data.create_webview,
            isAuthenticated: true
          });
        } else {
          throw new Error("data missing on response");
        }
      })
      .catch((error) => {
        Log.warn(error);
        this.setState({ ...this.state, error: error, isLoading: false });
      });

    const clearCookiesPromise = CookieManager.clearAll(true).catch((error) =>
      Log.warn("unable to clearcookies", error)
    );

    return Promise.all([createWebViewPromise, clearCookiesPromise]);
  }

  async componentWillUnmount() {
    const { deleteWebview } = this.props;
    if (this.state.webviewSecret) {
      return deleteWebview({ variables: { secret: this.state.webviewSecret } })
        .then((data) => Log.debug("deleted webview", data))
        .catch((error) => Log.warn("unable to create webview", error));
    }
  }

  render() {
    const { innerRef } = this.props;

    if (this.state.isLoading) return <Loading />;

    if (this.state.error)
      return (
        <LoadingError
          onRefreshTap={async () => {
            await this.componentDidMount();
          }}
        />
      );

    return (
      <AuthConsumer>
        {(auth) =>
          this.state.webviewSecret && auth.authContextState.appState ? (
            <WebView
              source={{
                uri: config.webViewUri(auth.authContextState.appState.host),
                headers: { [WEBVIEW_SECRET]: this.state.webviewSecret }
              }}
              userAgent={config.userAgent}
              style={{ flex: 1 }}
              ref={innerRef}
              onNavigationStateChange={this.props.onNavigationStateChange}
            />
          ) : null
        }
      </AuthConsumer>
    );
  }
}

type CreateWebViewResponse = {
  create_webview: string;
};

type DeleteWebViewResponse = {
  delete_webview: string;
};

type Props = {
  uri: string;
  createWebview: MutationFunction<CreateWebViewResponse, { url: string }>;
  deleteWebview: MutationFunction<DeleteWebViewResponse, { secret: string }>;
  innerRef: React.Ref<WebView>;
  onNavigationStateChange: (navState: WebViewNavigation) => void;
};

type OuterProps = {
  uri: string;
  onNavigationStateChange?: (navState: WebViewNavigation) => void;
};

type State = {
  error?: Error;
  isLoading: boolean;
  isAuthenticated: boolean;
  webviewSecret?: string;
};

const AuthenticatedWebViewGraphQL = compose<Props, { innerRef: React.Ref<WebView> }>(
  graphql(createWebview, { name: "createWebview" }),
  graphql(deleteWebview, { name: "deleteWebview" })
)(AuthenticatedWebViewComponent);

const AuthenticatedWebViewComponentForwardRef = forwardRef<WebView, OuterProps>((props, ref) => (
  <AuthenticatedWebViewGraphQL innerRef={ref} {...props} />
));

AuthenticatedWebViewComponentForwardRef.displayName = "AuthenticatedWebViewComponentWrap";

export { AuthenticatedWebViewComponentForwardRef as AuthenticatedWebView };
