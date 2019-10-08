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

//---- Theme color ------
const colorBrand = "#8CA83D";
const colorAssent = "#C5D395";
const colorSecondary1 = "#D2D2D2";
const colorSecondary2 = "#E6E6E6";
const colorSecondary3 = "#F5F5F5";
const colorSecondary4 = "#FFFFFF";

//---- Notification color ------
const colorInfo = "#337AB7";
const colorSuccess = "#677B2D";
const colorWarning = "#BE660D";
const colorAlert = "#953539";
const colorHighlight = "#FDF8E4";

//---- Neutral color ------
const colorNeutral1 = "#FFFFFF";
const colorNeutral2 = "#F5F5F5";
const colorNeutral3 = "#E6E6E6";
const colorNeutral4 = "#D2D2D2";
const colorNeutral5 = "#C7C7C7";
const colorNeutral6 = "#7D7D7D";
const colorNeutral7 = "#4A4A4A";
const colorNeutral8 = "#000000";

//---- Text color ------
const textColorDark = "#3D444B";
const textColorSecondary = "#C5D39D";
const textColorLight = "#FFFFFF";
const textColorSubdued = "#7D7D7D";
const textColorDisabled = "#C7C7C7";

//---- Text size ------
const fontSizeH1 = normalize(32);
const fontSizeH2 = normalize(24);
const fontSizeH3 = normalize(20);
const fontSizeH4 = normalize(17);
const fontSizeB1 = 16;
const fontSizeB2 = 15;
const fontSizeB3 = 14;
const fontSizeSmall = 12;
const fontSizeLabel = 10;

const lineHeightH1 = normalize(38);
const lineHeightH2 = normalize(32);
const lineHeightH3 = normalize(28);
const lineHeightH4 = normalize(26);
const lineHeightB1 = 24;
const lineHeightB2 = 20;
const lineHeightB3 = 18;
const lineHeightSmall = 16;
const lineHeightLabel = 12;

const fontSizeButtonTitle = 16;

const fontWeightMedium = "500";

const gutter = resizeByScreenSize(8, 16, 16, 24);

const tbPadding = resizeByScreenSize(8, 16, 24, 32);
const lrPadding = resizeByScreenSize(10, 12, 16, 20);

const theme = lodash.merge(material, {

  brandPrimary: colorBrand,// NEED TO READ FROM colorPrimary: "#8ca83d",

  inputFontSize: fontSizeH4,
  
  brandInfo: colorSecondary4,
  platformStyle: "totara",
  logoUrl: "https://webcasts.td.org/uploads/assets/2300/logo.png", //TODO need to set default logo and it will be covered in MOB-172 

  inputErrorTextColor: colorAlert,
  inputTextColor: textColorDark,
  inputSuccessTextColor: colorSuccess,

  inputErrorBorderColor: colorAlert,
  inputBorderColor: colorNeutral4,
  inputSuccessBorderColor: colorSuccess,  
  
  linkColor: "#3d444b",

  inputMarginLeft: 0,
  inputPaddingLeft: 0,
  
  btnDisabledBg: colorNeutral5
});

export {
  theme,
  getTheme,
  resizeByScreenSize,
  normalize,
  gutter,
  tbPadding,
  lrPadding,

  colorBrand,
  colorAssent,
  colorSecondary1,
  colorSecondary2,
  colorSecondary3,
  colorSecondary4,

  colorInfo,
  colorWarning,
  colorSuccess,
  colorAlert,
  colorHighlight,

  colorNeutral1,
  colorNeutral2,
  colorNeutral3,
  colorNeutral4,
  colorNeutral5,
  colorNeutral6,
  colorNeutral7,
  colorNeutral8,

  textColorDark,
  textColorSecondary,
  textColorLight,
  textColorSubdued,
  textColorDisabled,

  fontSizeH1,
  fontSizeH2,
  fontSizeH3,
  fontSizeH4,
  fontSizeB1,
  fontSizeB2,
  fontSizeB3,
  fontSizeSmall,
  fontSizeLabel,
  
  lineHeightH1,
  lineHeightH2,
  lineHeightH3,
  lineHeightH4,
  lineHeightB1,
  lineHeightB2,
  lineHeightB3,
  lineHeightSmall,
  lineHeightLabel,
  
  fontSizeButtonTitle,
  
  fontWeightMedium,
};