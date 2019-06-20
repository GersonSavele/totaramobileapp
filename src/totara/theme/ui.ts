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
 *
 * $author
 */

import {Dimensions, PixelRatio, Platform} from "react-native";
import {PLATFORM_IOS, SCREEN_WIDTH_LARGE, SCREEN_WIDTH_MEDIUM, SCREEN_WIDTH_SMALL, SCREEN_WIDTH_X_LARGE} from "@totara/lib/Constant";

const {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
} = Dimensions.get('window');

const scale = SCREEN_WIDTH / 414;

export function normalize(size: number) {
  const newSize = size * scale;
  if (Platform.OS === PLATFORM_IOS) {
    return Math.round(PixelRatio.roundToNearestPixel(newSize))
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
  }
}

export const deviceSize = () => {
  if (SCREEN_WIDTH > 414) {
    return SCREEN_WIDTH_X_LARGE;
  } if (SCREEN_WIDTH > 375) {
    return SCREEN_WIDTH_LARGE;
  } if (SCREEN_WIDTH > 320) {
    return SCREEN_WIDTH_MEDIUM
  } else {
    return SCREEN_WIDTH_SMALL;
  }
};

const resizeByScreenSize = (smallSize: number, mediumSize: number, largeSize: number, xLargeSize: number) => {
  switch (deviceSize()) {
    case SCREEN_WIDTH_SMALL: return smallSize;
    case SCREEN_WIDTH_MEDIUM: return mediumSize;
    case SCREEN_WIDTH_LARGE: return largeSize;
    case SCREEN_WIDTH_X_LARGE: return xLargeSize;
    default: return mediumSize
  }
};

export {resizeByScreenSize}