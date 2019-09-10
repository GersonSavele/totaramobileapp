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

// @ts-ignore no type defs on generated js files
import material from "./native-base-theme/variables/material";
// @ts-ignore no type defs on generated js files
import getTheme from "./native-base-theme/components/index";
import {resizeByScreenSize, normalize} from "./ui";
import lodash from "lodash";

const h1 = resizeByScreenSize(24, 28, 32, 36);
const h2 = resizeByScreenSize(24, 28, 32, 36);
const h3 = resizeByScreenSize(15, 20, 20, 20);
const h4 = resizeByScreenSize(14, 15, 16, 16);
const normal = resizeByScreenSize(13, 14, 14, 14);
const paragraph = resizeByScreenSize(24, 28, 32, 36);
const gutter = resizeByScreenSize(8, 10, 16, 24);
const contmargin = resizeByScreenSize(8, 10, 16, 24);
const tbPadding = resizeByScreenSize(8, 16, 24, 32);
const lrPadding = resizeByScreenSize(10, 12, 16, 20);

const theme = lodash.merge(material, {
  brandPrimary: "#8ca83d",
  brandInfo: "#FFFFFF",
  platformStyle: "totara",
  logoUrl: "https://webcasts.td.org/uploads/assets/2300/logo.png", //TODO need to set default logo and it will be covered in MOB-172 

  inputErrorTextColor: "#953539",
  inputTextColor: "#000000",
  inputSuccessTextColor: "#000000",

  inputErrorBorderColor: "#953539",
  inputBorderColor: "#D2D2D2",
  inputSuccessBorderColor: "#69BD45",

  h1Color: "#000",
  h3Color: "#64717D",
  linkColor: "#3d444b",

  inputMarginLeft: 0,
  inputPaddingLeft: 0,
  
});

export {
  theme,
  getTheme,
  resizeByScreenSize,
  normalize,
  h1,
  h2,
  h3,
  h4,
  normal,
  paragraph,
  gutter,
  contmargin,
  tbPadding,
  lrPadding
};