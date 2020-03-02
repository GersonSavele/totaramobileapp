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
 * @author: Kamala Tennakoon <kamala.tennakoon@totaralearning.com>
 */

import React, { useContext } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import SafeAreaView, { getInset } from "react-native-safe-area-view";
import { WebView, WebViewMessageEvent } from 'react-native-webview';

import { TouchableIcon } from "@totara/components";
import { gutter, ThemeContext } from "@totara/theme";

type Props = {
  url: string,
  injectScript?: string,
  onMessageHandler?: ((data: string) => void),
  onExitHandler?: (() => void);
}

const OfflineSCORMPlayer = ({ url, injectScript, onMessageHandler, onExitHandler }: Props) => {
  const [theme] = useContext(ThemeContext);
  const bottomPadding = getInset("bottom", false);
  const topPadding = getInset("top", false);
  const navContentHeight = theme.textH3.fontSize ? theme.textH3.fontSize : 20;
  const playerScreenHeight = Dimensions.get("window").height - bottomPadding - topPadding - (2 * gutter) - navContentHeight;

  const didReceiveOnMessage = (event: WebViewMessageEvent) => {
    const postEvent = event.nativeEvent.data;
    onMessageHandler && onMessageHandler(postEvent);
  };

  return (
    <SafeAreaView style={{ flexDirection: "column" }}>
      <View style={styles.navigation}>
        <TouchableIcon onPress={() => {onExitHandler && onExitHandler()}} icon={"times"} disabled={false} size={navContentHeight} />
      </View>
      <View style={[styles.playerContainer, {height: playerScreenHeight}]} >
        <WebView
          source={{ uri: url }}
          javaScriptEnabled={true}
          onMessage={didReceiveOnMessage}
          injectedJavaScript={injectScript}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  navigation: {
    alignItems: "flex-start",
    borderBottomWidth: 0,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  playerContainer: {
    flexGrow: 1,
    flexDirection: "column",
    width: Dimensions.get("window").width,
  }
});

export default OfflineSCORMPlayer;