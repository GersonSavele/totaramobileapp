/**
 * This file is part of Totara Enterprise.
 *
 * Copyright (C) 2019 onwards Totara Learning Solutions LTD
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

import { FontAwesome6 } from '@expo/vector-icons';
import type glyphMap from '@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/FontAwesome6Free.json';
import React from 'react';

import { iconSizes } from '../theme/constants';

export type IconName = keyof typeof glyphMap;

type IconProps = {
  name: IconName;
  color?: string;
  size?: number;
  style?: object;
};

const Icon = ({ name, color = 'black', size = iconSizes.sizeM, style = {} }: IconProps) => {
  return <FontAwesome6 name={name} size={size} color={color} style={style} />;
};

export default Icon;
