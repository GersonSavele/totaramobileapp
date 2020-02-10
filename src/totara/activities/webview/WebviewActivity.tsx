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
 */

import React, { useContext, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

import { Activity } from "@totara/types";
import { AuthenticatedWebView } from "@totara/auth";
import { TouchableIcon } from "@totara/components";
import { ThemeContext } from "@totara/theme";
import { WebView, WebViewNavigation } from "react-native-webview";

/**
 * WebviewActivity opens an activity with the given url
 */
const WebviewActivity = ({activity}: Props) => {
  const refWebview = useRef<WebView>(null);
  const [ theme ] = useContext(ThemeContext);
  const [canWebGoBackward, setCanWebGoBackward] = useState(false);
  const [canWebGoForward, setCanWebGoForward] = useState(false);

  const onNavigationStateChange = (navState: WebViewNavigation) => {
    setCanWebGoBackward(navState.canGoBack);
    setCanWebGoForward(navState.canGoForward);
  };

  return (<View style={{ flex: 1 }}>
    <View style={{ flex: 1 }}>
      <AuthenticatedWebView uri={activity.viewurl!} ref={refWebview} onNavigationStateChange={onNavigationStateChange}/>
    </View>
    <View style={styles.footer}>
      <View style={styles.barContent}>
        <TouchableIcon disabled={!canWebGoBackward} icon={"chevron-left"} onPress={() => {
          refWebview.current && refWebview.current!.goBack();
        }} color={theme.navigationHeaderTintColor}/>
        <TouchableIcon disabled={!canWebGoForward} icon={"chevron-right"} onPress={() => {
          refWebview.current && refWebview.current!.goForward();
        }} color={theme.navigationHeaderTintColor}/>
      </View>
    </View>
  </View>)
};

type Props = {
  activity: Activity
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    borderTopWidth: 0,
    justifyContent: "space-between"
  },
  barContent: {
    flexDirection: "row",
    alignSelf: "flex-start"
  }
});


export { WebviewActivity };
