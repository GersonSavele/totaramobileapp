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
import { useSession } from '@totara/core';
import { AUTH_HEADER_FIELD } from '@totara/lib/constants';
import { Image } from 'expo-image';
import React from 'react';
import type { ImageStyle, StyleProp } from 'react-native';

type ImageWrapperType = {
  url: string;
  style?: StyleProp<ImageStyle>;
  accessibilityLabel?: string;
  resizeMode?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
};

const ImageWrapper = ({ url, style, accessibilityLabel, resizeMode = undefined }: ImageWrapperType) => {
  const { apiKey } = useSession();

  return (
    <Image
      style={style}
      contentFit={resizeMode}
      onError={() => {
        console.log('Loading onError');
      }}
      accessibilityLabel={accessibilityLabel}
      priority="normal"
      source={{
        uri: url,
        headers: {
          [AUTH_HEADER_FIELD]: apiKey
        }
      }}
    />
  );
};

export default ImageWrapper;
