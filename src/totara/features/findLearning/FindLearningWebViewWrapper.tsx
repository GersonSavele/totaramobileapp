/**
 * This file is part of Totara Enterprise.
 *
 * Copyright (C) 2020 onwards Totara Learning Solutions LTD
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

import WebViewWrapper from '@totara/auth/WebViewWrapper';
import { TotaraTheme } from '@totara/theme/Theme';
import React from 'react';
import { SafeAreaView } from 'react-native';
import type { WebViewNavigation } from 'react-native-webview';

import { useParams } from '../../lib/hooks';

const FindLearningWebViewWrapper = () => {
  const { viewUrl } = useParams('FindLearningWebViewWrapper');

  const onLoadWithRequest = (navState: WebViewNavigation) => {
    if (navState.url.indexOf('') < 0) {
      return false;
    }
    return true;
  };

  return (
    <SafeAreaView style={{ ...TotaraTheme.viewContainer, backgroundColor: TotaraTheme.colorSecondary1 }}>
      <WebViewWrapper uri={viewUrl} onShouldStartLoadWithRequest={onLoadWithRequest} showAllToolbarItems={true} />
    </SafeAreaView>
  );
};

export default FindLearningWebViewWrapper;
