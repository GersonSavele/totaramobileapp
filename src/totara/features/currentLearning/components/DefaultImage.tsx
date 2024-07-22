/**
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

import { Images } from '@resources/images';
import { learningItemEnum } from '@totara/features/constants';
import { margins } from '@totara/theme/constants';
import { TotaraTheme } from '@totara/theme/Theme';
import React from 'react';
import type { ImageSourcePropType, ImageStyle, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Image, StyleSheet, View } from 'react-native';

type DefaultImageProps = {
  itemType: learningItemEnum;
  style?: ViewStyle | TextStyle | ImageStyle;
};

const defaultImages = {
  [learningItemEnum.Course]: Images.defaultCourses,
  [learningItemEnum.Program]: Images.defaultProgram,
  [learningItemEnum.Certification]: Images.defaultCertifications
};

const DefaultImage = ({ itemType, style }: DefaultImageProps) => {
  const defaultImage = defaultImages[itemType];
  return (
    <View style={[styles.imageContainer, style]}>
      <Image
        style={[styles.imageWrap, style] as StyleProp<ImageStyle>}
        source={defaultImage as ImageSourcePropType}
        resizeMode={'contain'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    backgroundColor: TotaraTheme.colorNeutral3
  },
  imageWrap: {
    flex: 1,
    margin: margins.marginM,
    alignSelf: 'center',
    resizeMode: 'contain'
  }
});

export default DefaultImage;
