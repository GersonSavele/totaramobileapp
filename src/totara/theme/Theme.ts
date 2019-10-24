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
import { normalize } from "./ui";
import { ViewStyle, TextStyle } from "react-native";


//---- Theme color: customizable by [User/Developer] ------
const colorBrand = "#8CA83D";
const colorAccent = "#FFFFFF";

//---- Neutral color: customizable by [Developer] ------
const colorNeutral5 = "#C7C7C7";

//---- Text color: customizable by [Developer] ------
const textColorDark = "#3D444B";

export type Theme = {
  logoUrl?: string,
  
  viewContainer: ViewStyle,
  textH1: TextStyle,
  textH2: TextStyle,
  textH3: TextStyle,
  textH4: TextStyle,

  textB1: TextStyle,
  textB2: TextStyle,
  textB3: TextStyle,
  
  textSmall: TextStyle,
  textLabel: TextStyle,

  fontSizeButtonTitle: number,

  //---- Theme color: customizable by [User/Developer] ------
  colorBrand: string,
  colorAccent: string,
  colorSecondary1: string,
  colorSecondary2: string,
  colorSecondary3: string,
  colorSecondary4: string,

  //---- Notification color: customizable by [Developer] ------
  colorInfo: string,
  colorSuccess: string,
  colorWarning: string,
  colorAlert: string,
  colorHighlight: string,

  //---- Neutral color: customizable by [Developer] ------
  colorNeutral1: string,
  colorNeutral2: string,
  colorNeutral3: string,
  colorNeutral4: string,
  colorNeutral5: string,
  colorNeutral6: string,
  colorNeutral7: string,
  colorNeutral8: string,

  //---- Text color: customizable by [Developer] ------
  textColorDark: string,
  textColorSecondary: string,
  textColorLight: string,
  textColorSubdued: string,
  textColorDisabled: string,

  //---- Navigation color: customizable by [User/Developer] ------
  navigationHeaderTintColor: string,

  //---- TabBar color: customizable by [Developer] ------
  tabBarActiveTintColor: string,
  tabBarInactiveTintColor: string
}

const TotaraTheme: Theme = {
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
  textLabel: { fontSize: 10, color: textColorDark }, // lineHeight: 12

  fontSizeButtonTitle: 16,

  //---- Theme color: customizable by [User/Developer] ------
  colorBrand: colorBrand,
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

  //---- Navigation color: customizable by [User/Developer] ------
  navigationHeaderTintColor: "#3D444B",

  //---- TabBar color: customizable by [Developer] ------
  tabBarActiveTintColor: colorBrand,
  tabBarInactiveTintColor: colorNeutral5
}

const applyTheme = (theme: Partial<Theme>) => {
  let newTheme = TotaraTheme;
  if (theme.colorBrand) {
    newTheme.tabBarActiveTintColor = theme.colorBrand;
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
}
export  { TotaraTheme, applyTheme };