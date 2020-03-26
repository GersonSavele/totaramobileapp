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
 * @author Tharaka Dushmantha <tharaka.dushmantha@totaralearning.com>
 *
 *
 */
import React from 'react';
import { StyleSheet } from "react-native";
import Video from "react-native-video";

import { normalize } from "@totara/theme";

type VideoType = {
    url : string
}

const VideoController = ({url}: VideoType) => {

  return (
      <Video
        paused={true}
        source={{ uri: url }}
        style={styles.mediaPlayer}
        volume={10}
        resizeMode= "cover"
        controls = {true}
      />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  mediaPlayer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    borderRadius:normalize(12)
  }
});

export default VideoController;
