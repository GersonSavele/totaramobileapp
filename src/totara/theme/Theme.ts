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
 * @author: Kamala Tennakoon <kamala.tennakoon@totaralearning.com>
 */

import { normalize } from "./PlatformUtility";
import { Theme } from "@totara/types";
import { TextStyle, ViewStyle } from "react-native";

const colorPrimary = "#8CA83D";
const colorAccent = "#FFFFFF";
const colorNeutral5 = "#C7C7C7";
const textColorDark = "#3D444B";

const TotaraTheme: AppliedTheme = {
  viewContainer: { backgroundColor: colorAccent },

  //---- Text styles: customizable by [Developer] ------
  textH1: { fontSize: normalize(32), lineHeight:  normalize(38), color: textColorDark, fontWeight: "bold" },
  textH2: { fontSize: normalize(24), lineHeight: normalize(32), color:  textColorDark, fontWeight: "500" },
  textH3: { fontSize: normalize(20), lineHeight: normalize(28), color: textColorDark, fontWeight: "500" },
  textH4: { fontSize: normalize(17), lineHeight: normalize(26), color: textColorDark, fontWeight: "500" },

  textB1: { fontSize: 16, lineHeight: 24, color: textColorDark },
  textB2: { fontSize: 15, lineHeight: 20, color: textColorDark },
  textB3: { fontSize: 14, lineHeight: 18, color: textColorDark },
  
  textSmall: { fontSize: 12, lineHeight: 16, color: textColorDark },
  textLabel: { fontSize: 10, color: textColorDark },

  fontSizeButtonTitle: 16,
  
  //---- Theme color: customizable by [User, Developer] ------
  colorPrimary: colorPrimary,
  colorText: "#FFFFFF",

  //---- Theme color: customizable by [Developer] ------
  colorAccent: colorAccent,
  colorSecondary1: "#F5F5F5",
  colorSecondary2: "#FFFFFF", 
  colorSecondary3: "#F5F5F5",
  colorSecondary4: "#FFFFFF",

  //---- Notification color: customizable by [Developer] ------
  colorInfo: "#337AB7",
  colorSuccess: "#677B2D",
  colorWarning: "#8E660D",
  colorAlert: "#953539",
  colorHighlight: "#FDF8E4",

  //---- Neutral color: customizable by [Developer] ------
  colorNeutral1: "#FFFFFF", 
  colorNeutral2: "#F5F5F5",
  colorNeutral3: "#E6E6E6",
  colorNeutral4: "#D2D2D2",
  colorNeutral5: colorNeutral5,
  colorNeutral6: "#7D7D7D",
  colorNeutral7: "#4A4A4A",
  colorNeutral8: "#000000",

  //---- Text color: customizable by [Developer] ------
  textColorDark: textColorDark,
  textColorSecondary: "#C5D39D",
  textColorLight: "#FFFFFF",
  textColorSubdued: "#7D7D7D",
  textColorDisabled: "#C7C7C7",

  //---- Navigation color: customizable by [Developer] ------
  navigationHeaderTintColor: "#3D444B",

  //---- TabBar color: customizable by [Developer] ------
  tabBarActiveTintColor: colorPrimary,
  tabBarInactiveTintColor: colorNeutral5
};

export type AppliedTheme = {
  viewContainer: ViewStyle;
  textH1: TextStyle;
  textH2: TextStyle;
  textH3: TextStyle;
  textH4: TextStyle;

  textB1: TextStyle;
  textB2: TextStyle;
  textB3: TextStyle;

  textSmall: TextStyle;
  textLabel: TextStyle;
} & Theme

const applyTheme = (theme: Partial<Theme>) => {
  let newTheme = TotaraTheme;
  if (theme.colorPrimary) {
    newTheme.tabBarActiveTintColor = theme.colorPrimary;
  }
  if (theme.colorAccent) {
    newTheme.viewContainer = {...newTheme.viewContainer, ...{backgroundColor: theme.colorAccent}};
  }
  if (theme.colorNeutral5) {
    newTheme.tabBarInactiveTintColor = theme.colorNeutral5;
  }
  if (theme.textColorDark) {
    newTheme.textH1 = {...newTheme.textH1, ...{color: theme.textColorDark}};
    newTheme.textH2 = {...newTheme.textH2, ...{ color : theme.textColorDark}};
    newTheme.textH3 = {...newTheme.textH3, ...{color: theme.textColorDark}};
    newTheme.textH4 = {...newTheme.textH4, ...{color: theme.textColorDark}};
    
    newTheme.textB1 = {...newTheme.textB1, ...{color: theme.textColorDark}};
    newTheme.textB2 = {...newTheme.textB2, ...{color: theme.textColorDark}};
    newTheme.textB3 = {...newTheme.textB3, ...{color: theme.textColorDark}};
    
    newTheme.textSmall = {...newTheme.textSmall, ...{color: theme.textColorDark}};
    newTheme.textLabel = {...newTheme.textLabel, ...{color: theme.textColorDark}};
  }
  return { ...newTheme, ...theme };
};

export  { TotaraTheme, applyTheme };