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
import Video from "react-native-video";
import { videoControllerStyles } from "../currentLearningStyles";

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
