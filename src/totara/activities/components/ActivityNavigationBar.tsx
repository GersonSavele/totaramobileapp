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

import React, { useContext } from "react";
import { SafeAreaView, View, Text, StyleSheet } from "react-native";

import { ThemeContext } from "@totara/theme";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

type ActivityNavigationBarProps = {
  children?: Element
};

type ActionItemProp = {
  icon?: string,
  action?: () => void,
  children?: Element
};

type HeaderProp = {
  title?: string,
  info?: string
};

const ActionItem = ({icon, action, children}: ActionItemProp) => {

  return (
    <TouchableOpacity disabled={!action} style={ActivityNavigationBarStyle.action} onPress={action}>
      { !children && icon && <FontAwesomeIcon icon={icon as IconProp} size={24}/>}
      { children }
    </TouchableOpacity>
  );
};

const Header = ({title, info}: HeaderProp) => {

  const [theme] = useContext(ThemeContext);

  return (
    <View style={ActivityNavigationBarStyle.header}>
      { title && <Text style={[theme.textH4, ActivityNavigationBarStyle.title]} numberOfLines={1}>{title}</Text>}
      { info && <Text style={[theme.textSmall, ActivityNavigationBarStyle.info, {color: theme.textColorSubdued}]} numberOfLines={1}>{info}</Text> }
    </View>
  );
};

const ActivityNavigation = ({children}: ActivityNavigationBarProps) => {
  
  const [theme] = useContext(ThemeContext);

  return (<>
    <SafeAreaView style={{ backgroundColor: theme.colorSecondary1 }} />
    <View style={[ActivityNavigationBarStyle.navigationStyle, { backgroundColor: theme.colorSecondary1 }]}>
    {children}
    </View>
  </>);
 };

 const ActivityNavigationBarStyle = StyleSheet.create({
  navigationStyle :{
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    height: 44
  },
  action: {
    // paddingHorizontal: 16,
    // backgroundColor: "yellow",
    width: 44,
    flex: 1,
    height: "100%",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center"
  },
  header: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignSelf: "center",
    paddingHorizontal: 8,
    // backgroundColor: "red",
  },
  title: {
    textAlign: "center",
    alignSelf: "center",
    overflow: "hidden"
  },
  info: {
    textAlign: "center",
    alignSelf:"center"
  }
});

export { ActivityNavigation, ActionItem, Header} ;