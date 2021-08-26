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

import React from "react";
import { FlatList, Platform, Text, View } from "react-native";
import { WebViewNavigation } from "react-native-webview";
import WebViewWrapper from "@totara/auth/WebViewWrapper";

const FindLearningWebView = () => {
  const contextUrl =
    "http://tl-32022-test.sb.wlg.totaralms.com/totara/engage/resources/article/index.php?id=1&source=ct.orderbykey%3Dfeatured%26itemstyle%3Dnarrow";
  const onLoadWithRequest = (navState: WebViewNavigation) => {
    return false;
  };
  return (
    <View style={{ flex: 1 }}>
      <WebViewWrapper uri={contextUrl} onShouldStartLoadWithRequest={onLoadWithRequest} />
    </View>
  );
};

export default FindLearningWebView;
