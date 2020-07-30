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

import React, { useContext } from "react";
import { AuthContext } from "@totara/core";
import { AUTHORIZATION } from "@totara/lib/constants";
import { ImageStyle, StyleProp } from "react-native";
import FastImage from "react-native-fast-image";

type ImageWrapperType = {
  url: string;
  style?: StyleProp<ImageStyle>;
};

const ImageWrapper = ({ url, style }: ImageWrapperType) => {
  const {
    authContextState: { appState }
  } = useContext(AuthContext);
  const apiKey = appState!.apiKey;

  return (
    <FastImage
      style={style}
      source={{
        uri: url,
        priority: FastImage.priority.normal,
        headers: {
          [AUTHORIZATION]: `Bearer ${apiKey}`
        }
      }}
    />
  );
};

export default ImageWrapper;
