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
 * @author Tharaka Dushmantha <tharaka.dushmantha@totaralearning.com
 **/

import React from "react";
import {
  Image,
  StyleSheet,
  Dimensions,
  ImageSourcePropType
} from "react-native";
import { Images } from "@resources/images";

type Params = {
  imageType: string;
};

const ModalImageView = ({ imageType }: Params) => {
  return setImage({ imageType });
};

const setImage = ({ imageType }: Params) => {
  switch (imageType) {
    case "complete_action":
      return (
        <Image
          style={styles.containerStyle}
          source={Images.completeAction as ImageSourcePropType}
        />
      );
    case "url_not_valid":
      return (
        <Image
          style={styles.containerStyle}
          source={Images.urlNotValid as ImageSourcePropType}
        />
      );
    case "general_error":
      return (
        <Image
          style={styles.containerStyle}
          source={Images.generalError as ImageSourcePropType}
        />
      );
    case "browser_login":
      return (
        <Image
          style={styles.containerStyle}
          source={Images.browserLogin as ImageSourcePropType}
        />
      );
    case "course_complete":
      return (
        <Image
          style={styles.containerStyle}
          source={Images.courseComplete as ImageSourcePropType}
        />
      );
    case "self_completion":
      return (
        <Image
          style={styles.containerStyle}
          source={Images.selfCompletion as ImageSourcePropType}
        />
      );
    case "course_compatible":
      return (
        <Image
          style={styles.containerStyle}
          source={Images.courseCompatible as ImageSourcePropType}
        />
      );
    default:
      return null;
  }
};

const styles = StyleSheet.create({
  containerStyle: {
    alignItems: "center",
    height: Dimensions.get("window").width * 0.5,
    width: Dimensions.get("window").width * 0.7,
    resizeMode: "contain"
  }
});

export default ModalImageView;
