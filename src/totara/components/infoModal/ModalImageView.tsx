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
import { Image, StyleSheet, Dimensions } from "react-native";

export const IMAGES = {
  complete_action: require("@resources/images/complete_action/complete_action.png"),
  url_not_valid: require("@resources/images/url_not_valid/url_not_valid.png"),
  general_error: require("@resources/images/general_error/general_error.png")
};

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
        <Image style={styles.containerStyle} source={IMAGES.complete_action} />
      );
    case "url_not_valid":
      return (
        <Image style={styles.containerStyle} source={IMAGES.url_not_valid} />
      );
    case "general_error":
      return (
        <Image style={styles.containerStyle} source={IMAGES.general_error} />
      );
      case "gener_error":
        return (
          <Image style={styles.containerStyle} source={IMAGES.general_error} />
        );
    default:
      return (
        <Image style={styles.containerStyle} source={IMAGES.complete_action} />
      );
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
