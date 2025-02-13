/**
 * This file is part of Totara Enterprise Extensions.
 *
 * Copyright (C) 2020 onwards Totara Learning Solutions LTD
 *
 * Totara Enterprise Extensions is provided only to Totara
 * Learning Solutions LTD's customers and partners, pursuant to
 * the terms and conditions of a separate agreement with Totara
 * Learning Solutions LTD or its affiliate.
 *
 * If you do not have an agreement with Totara Learning Solutions
 * LTD, you may not access, use, modify, or distribute this software.
 * Please contact [licensing@totaralearning.com] for more information.
 */

import WebviewToolbar from '@totara/components/WebviewToolbar';
import { useSession } from '@totara/core';
import { DEFAULT_LANGUAGE } from '@totara/lib/constants';
import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { BackHandler, View } from 'react-native';
import type { WebView, WebViewNavigation } from 'react-native-webview';

import { AuthenticatedWebView } from './AuthenticatedWebView';

type WebViewWrapperProps = {
  uri: string;
  backAction?: () => boolean | void;
  onShouldStartLoadWithRequest?: (navState: WebViewNavigation) => boolean;
  showAllToolbarItems?: boolean;
};

const WebViewWrapper = ({
  uri,
  backAction,
  onShouldStartLoadWithRequest,
  showAllToolbarItems = false
}: WebViewWrapperProps) => {
  const refWebview = useRef<WebView>(null);
  const [navState, setNavState] = useState<WebViewNavigation>();
  const { host, core } = useSession();

  const onNavigationStateChange = (navState: WebViewNavigation) => {
    setNavState(navState);
  };

  useEffect(() => {
    if (uri && backAction) {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
      return () => backHandler.remove();
    }
  }, [uri, backAction]);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <AuthenticatedWebView
          host={host}
          uri={uri}
          ref={refWebview}
          onNavigationStateChange={onNavigationStateChange}
          onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
          languagePreference={core?.user?.lang || DEFAULT_LANGUAGE}
        />
      </View>
      <WebviewToolbar
        refWebview={refWebview}
        navState={navState}
        viewUrl={uri}
        showAllToolbarItems={showAllToolbarItems}
      />
    </View>
  );
};
export default WebViewWrapper;
