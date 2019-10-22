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
import React, { useState } from "react";
import { Alert } from "react-native";
type TextStyle = {
  fontSize: number,
  lineHeight: number,
  color: string,
  fontWeight: string
}
type Theme = {
  textH1: TextStyle,
  colorBrand?: string,
  colorAccent?: string,
  colorSecondary1?: string,
  colorSecondary2?: string,
  colorSecondary3?: string,
  colorSecondary4?: string,

  //---- Notification color: customizable by [Developer] ------
  colorInfo?: string,
  colorSuccess?: string,
  colorWarning?: string,
  colorAlert?: string,
  colorHighlight?: string,

  //---- Neutral color: customizable by [Developer] ------
  colorNeutral1?: string,
  colorNeutral2?: string,
  colorNeutral3?: string,
  colorNeutral4?: string,
  colorNeutral5?: string,
  colorNeutral6?: string,
  colorNeutral7?: string,
  colorNeutral8?: string,

  //---- Text color: customizable by [Developer] ------
  textColorDark?: string,
  textColorSecondary?: string,
  textColorLight?: string,
  textColorSubdued?: string,
  textColorDisabled?: string,

  //---- Navigation color: customizable by [User/Developer] ------
  navigationHeaderTintColor?: string,
  textNavigationColorLight?: string,

  //---- TabBar color: customizable by [Developer] ------
  tabBarActiveTintColor?: string,
  tabBarInactiveTintColor?: string,
  textTabBarColorDark?: string,
  textTabBarColorLight?: string,

  //---- Text size: customizable by [Developer] ------
  fontSizeH1?: number,
  fontSizeH2?: number,
  fontSizeH3?: number,
  fontSizeH4?: number,
  fontSizeB1?: number,
  fontSizeB2?: number,
  fontSizeB3?: number,
  fontSizeSmall?: number,
  fontSizeLabel?: number,

  fontSizeButtonTitle?: number,

  //---- Text Line-height: customizable by [Developer] ------
  lineHeightH1?: number,
  lineHeightH2?: number,
  lineHeightH3?: number,
  lineHeightH4?: number,
  lineHeightB1?: number,
  lineHeightB2?: number,
  lineHeightB3?: number,
  lineHeightSmall?: number,
  lineHeightLabel?: number,

  //---- Text weight: customizable by [Developer] ------
  fontWeightMedium?: string
}

const MobileTheme = (brandColor?: string | null) => ({
  textH1: {
    fontSize: 32,
    lineHeight: 38,
    color:  brandColor ? brandColor : "red", //textColorDark
    fontWeight: "bold"
  },
  //---- Theme color: customizable by [User/Developer] ------
 colorBrand: brandColor ? brandColor: "#8CA83D",
 colorAccent: "#FFFFFF",
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
  colorNeutral5: "#C7C7C7",
  colorNeutral6: "#7D7D7D",
  colorNeutral7: "#4A4A4A",
  colorNeutral8: "#000000",

  //---- Text color: customizable by [Developer] ------
  textColorDark: "#3D444B",
  textColorSecondary: "#C5D39D",
  textColorLight: "#FFFFFF",
  textColorSubdued: "#7D7D7D",
  textColorDisabled: "#C7C7C7",

  //---- Navigation color: customizable by [User/Developer] ------
  navigationHeaderTintColor: "#3D444B",
  textNavigationColorLight: "#FFFFFF",

  //---- TabBar color: customizable by [Developer] ------
  tabBarActiveTintColor: "blue", // MobileTheme.colorBrand,
  tabBarInactiveTintColor: "#C7C7C7", // MobileTheme.colorNeutral5,
  textTabBarColorDark: "#3D444B",
  textTabBarColorLight: "#FFFFFF",

  //---- Text size: customizable by [Developer] ------
  /*
  fontSizeH1: normalize(32),
  fontSizeH2: normalize(24),
  fontSizeH3: normalize(20),
  fontSizeH4: normalize(17),
  */
  fontSizeH1: 32,
  fontSizeH2: 24,
  fontSizeH3: 20,
  fontSizeH4: 17,
  fontSizeB1: 16,
  fontSizeB2: 15,
  fontSizeB3: 14,
  fontSizeSmall: 12,
  fontSizeLabel: 10,

  fontSizeButtonTitle: 16,

  //---- Text Line-height: customizable by [Developer] ------
  lineHeightH1: 38,
  lineHeightH2: 32,
  lineHeightH3: 28,
  lineHeightH4: 26,
  
  /*
  lineHeightH1: normalize(38),
  lineHeightH2: normalize(32),
  lineHeightH3: normalize(28),
  lineHeightH4: normalize(26),
  */
  lineHeightB1: 24,
  lineHeightB2: 20,
  lineHeightB3: 18,
  lineHeightSmall: 16,
  lineHeightLabel: 12,
  
  //---- Text weight: customizable by [Developer] ------
  fontWeightMedium: "500",
});

const ThemeContext = React.createContext({
  theme: MobileTheme()
});


export  { Theme, MobileTheme, ThemeContext };