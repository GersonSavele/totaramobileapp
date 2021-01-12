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
import { StyleSheet, View } from "react-native";

import { TouchableIcon } from "@totara/components";
import { WebView, WebViewNavigation } from "react-native-webview";
import { TotaraTheme } from "@totara/theme/Theme";

type WebviewToolbarProps = { refWebview: React.RefObject<WebView>; navState?: WebViewNavigation };

const WebviewToolbar = ({ refWebview, navState }: WebviewToolbarProps) => {
  return (
    <View style={styles.footer}>
      <View style={styles.barContent}>
        <TouchableIcon
          disabled={!navState?.canGoBack}
          icon={"chevron-left"}
          onPress={() => refWebview.current && refWebview.current!.goBack()}
          color={TotaraTheme.colorNeutral7}
          size={TotaraTheme.textH3.fontSize}
        />
        <TouchableIcon
          disabled={!navState?.canGoForward}
          icon={"chevron-right"}
          onPress={() => refWebview.current && refWebview.current!.goForward()}
          color={TotaraTheme.colorNeutral7}
          size={TotaraTheme.textH3.fontSize}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  footer: {
    backgroundColor: TotaraTheme.colorSecondary1,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  barContent: {
    flexDirection: "row",
    alignSelf: "flex-start"
  }
});

export default WebviewToolbar;
