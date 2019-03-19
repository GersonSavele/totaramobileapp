/*
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
 */

import {Dimensions, Platform, PixelRatio} from "react-native"

const {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
} = Dimensions.get('window');

const scale = SCREEN_WIDTH / 414;

export function normalize(size: number) {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize))
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
  }
}

export const iPhoneSize = () => {
  const windowWidth = Dimensions.get('window').width;
  if (windowWidth === 320) {
    return 'small'; // iPhone SE
  } if (windowWidth === 414) {
    return 'large'; // iPhone Plus
  }
  return 'medium'; // iPhone 6/7
};