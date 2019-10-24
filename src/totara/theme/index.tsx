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
 */


import { resizeByScreenSize, normalize } from "./PlatformUtility";
import { Theme, applyTheme } from "./Theme";
import { ThemeContext, ThemeProvider, ThemeConsumer} from "./ThemeContext"

const gutter = resizeByScreenSize(8, 16, 16, 24);
const tbPadding = resizeByScreenSize(8, 16, 24, 32);
const lrPadding = resizeByScreenSize(10, 12, 16, 20);

export {
  resizeByScreenSize,
  normalize,
  gutter,
  tbPadding,
  lrPadding,

  Theme,
  applyTheme,
  
  ThemeContext, 
  ThemeProvider, 
  ThemeConsumer
};