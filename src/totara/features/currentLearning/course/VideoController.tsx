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
import { StyleSheet } from "react-native";
import Video from "react-native-video";

import { borderRadius } from "@totara/theme/constants";
type VideoType = {
  url: string;
};

const VideoController = ({ url }: VideoType) => (
  <Video
    paused={true}
    source={{ uri: url }}
    style={styles.mediaPlayer}
    volume={10}
    resizeMode="cover"
    controls={true}
  />
);

const styles = StyleSheet.create({
  mediaPlayer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    borderRadius: borderRadius.borderRadiusM
  }
});

export default VideoController;
