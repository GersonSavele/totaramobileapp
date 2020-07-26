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

import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { WebView, WebViewMessageEvent } from "react-native-webview";

import { SCORM_TEST_IDS } from "../constants";

type Props = {
  url: string;
  injectScript?: string;
  onMessageHandler?: (data: JSON) => void;
  onExitHandler?: () => void;
};

const { OFFLINE_PLAYER_ID } = SCORM_TEST_IDS;

const OfflineScormPlayer = ({ url, injectScript, onMessageHandler }: Props) => {
  const didReceiveOnMessage = (event: WebViewMessageEvent) => {
    const eventdata = JSON.parse(event.nativeEvent.data);
    onMessageHandler && onMessageHandler(eventdata);
  };

  return (
    <View style={styles.playerContainer} testID={OFFLINE_PLAYER_ID}>
      <WebView
        source={{ uri: url }}
        javaScriptEnabled={true}
        onMessage={didReceiveOnMessage}
        injectedJavaScript={injectScript}
        style={styles.player}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  playerContainer: {
    flexDirection: "row",
    flexGrow: 1,
    width: Dimensions.get("window").width
  },
  player: {
    width: "100%"
  }
});

export default OfflineScormPlayer;
