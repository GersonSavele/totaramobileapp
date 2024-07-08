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
import { MutationFunction, gql, useMutation } from "@apollo/client";
import CookieManager from "@react-native-cookies/cookies";

import { config, Log } from "@totara/lib";
import { WEBVIEW_SECRET } from "@totara/lib/constants";
import { Loading, LoadingError } from "@totara/components";
import DeviceInfo from "react-native-device-info";
import { TEST_IDS } from "@totara/lib/testIds";
import { connect } from "react-redux";

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

    // @ts-ignore
    this.state = {
      error: undefined,
      isLoading: true,
      isAuthenticated: false,
      webviewSecret: undefined,
      agent: config.userAgent
    };
  }

  async componentDidMount() {
    const { createWebview, host, uri, languagePreference } = this.props;

    this.setState({ ...this.state, error: undefined, isLoading: true });

    const createWebViewPromise = createWebview({ variables: { url: uri } })
      .then(response => {
        if (response.data) {
          this.setState({
            host: host,
            languagePreference: languagePreference,
            isLoading: false,
            webviewSecret: response.data.create_webview,
            isAuthenticated: true
          });
        } else {
          throw new Error("data missing on response");
        }
      })
      .catch(error => {
        Log.warn(error);
        this.setState({ error: error, isLoading: false });
      });

    const clearCookiesPromise = CookieManager.clearAll(true).catch(error => Log.warn("unable to clearcookies", error));

    const userAgentPromise = DeviceInfo.getUserAgent().then(agent => {
      this.setState({ agent: `${agent} ${config.userAgent}` });
    });

    return Promise.all([createWebViewPromise, clearCookiesPromise, userAgentPromise]);
  }

  async componentWillUnmount() {
    const { deleteWebview } = this.props;
    if (this.state.webviewSecret) {
      return deleteWebview({ variables: { secret: this.state.webviewSecret } })
        .then(data => Log.debug("deleted webview", data))
        .catch(error => Log.warn("unable to create webview", error));
    }
  }

  render() {
    const { innerRef } = this.props;
    const { isLoading, error, webviewSecret, agent, host, languagePreference } = this.state;

    if (isLoading) return <Loading testID={TEST_IDS.LOADING} />;

    if (error)
      return (
        <LoadingError
          onRefreshTap={async () => {
            await this.componentDidMount();
          }}
          testID={TEST_IDS.LOADING_ERROR}
        />
      );

    return (
      <WebView
        source={{
          uri: config.webViewUri(host!),
          headers: { [WEBVIEW_SECRET]: webviewSecret, "Accept-Language": `${languagePreference}` }
        }}
        style={{ flex: 1 }}
        userAgent={agent}
        ref={innerRef}
        onNavigationStateChange={this.props.onNavigationStateChange}
        onShouldStartLoadWithRequest={this.props.onShouldStartLoadWithRequest}
        allowsInlineMediaPlayback={true}
        allowsFullscreenVideo={true}
        setSupportMultipleWindows={false}
        testID={TEST_IDS.AUTHENTICATED_WEBVIEW}
      />
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
  host: string;
  languagePreference: string;
  uri: string;
  createWebview: MutationFunction<CreateWebViewResponse, { url: string }>;
  deleteWebview: MutationFunction<DeleteWebViewResponse, { secret: string }>;
  innerRef: React.Ref<WebView>;
  onNavigationStateChange?: (navState: WebViewNavigation) => void;
  onShouldStartLoadWithRequest?: (navState: WebViewNavigation) => boolean;
};

type OuterProps = {
  host: string | undefined;
  languagePreference: string;
  uri: string;
  onNavigationStateChange?: (navState: WebViewNavigation) => void;
  onShouldStartLoadWithRequest?: (navState: WebViewNavigation) => boolean;
};

type State = {
  host?: string;
  languagePreference: string;
  error?: Error;
  isLoading: boolean;
  isAuthenticated: boolean;
  webviewSecret?: string;
  agent?: string;
};

const mapStateToProps = (state: State): State => ({ ...state })
const ConnectedAuthenticatedWebViewComponent = connect(mapStateToProps)(AuthenticatedWebViewComponent)

const AuthenticatedWebViewComponentForwardRef = forwardRef<WebView, OuterProps>((props, ref) => {
  const [cwv] = useMutation(createWebview);
  const [dwv] = useMutation(deleteWebview);

  return <ConnectedAuthenticatedWebViewComponent {...props} innerRef={ref} createWebview={cwv} deleteWebview={dwv} />
});

AuthenticatedWebViewComponentForwardRef.displayName = "AuthenticatedWebViewComponentWrap";

export { AuthenticatedWebViewComponentForwardRef as AuthenticatedWebView, AuthenticatedWebViewComponent };
