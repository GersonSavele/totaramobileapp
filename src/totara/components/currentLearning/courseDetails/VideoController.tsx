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
import React from "react";
import Video from "react-native-video";
import { videoControllerStyles } from "@totara/theme/currentLearning";

type VideoType = {
  url: string;
};

const VideoController = ({ url }: VideoType) => (
  <Video
    paused={true}
    source={{ uri: url }}
    style={videoControllerStyles.mediaPlayer}
    volume={10}
    resizeMode="cover"
    controls={true}
  />
);

export default VideoController;
