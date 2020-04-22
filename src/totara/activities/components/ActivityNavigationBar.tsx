/**
 * This file is part of Totara Enterprise.
 * Copyright (C) 2020 onwards Totara Learning Solutions LTD
 * Totara Enterprise is provided only to Totara Learning Solutions
 * LTD’s customers and partners, pursuant to the terms and
 * conditions of a separate agreement with Totara Learning
 * Solutions LTD or its affiliate.
 * If you do not have an agreement with Totara Learning Solutions
 * LTD, you may not access, use, modify, or distribute this software.
 * Please contact [sales@totaralearning.com] for more information.
 */

import React, { useContext } from "react";
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { ThemeContext } from "@totara/theme";
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
    width: 44,
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
  },
  title: {
    textAlign: "center",
    alignSelf: "center",
    overflow: "hidden",
  },
  info: {
    textAlign: "center",
    alignSelf:"center",
    paddingBottom: 8,
  }
});

export { ActivityNavigation, ActionItem, Header} ;