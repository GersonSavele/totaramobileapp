/**
 * This file is part of Totara Enterprise.
 * 
 * Copyright (C) 2020 onwards Totara Learning Solutions LTD
 * 
 * Totara Enterprise is provided only to Totara Learning Solutions
 * LTD’s customers and partners, pursuant to the terms and
 * conditions of a separate agreement with Totara Learning
 * Solutions LTD or its affiliate.
 * 
 * If you do not have an agreement with Totara Learning Solutions
 * LTD, you may not access, use, modify, or distribute this software.
 * Please contact [sales@totaralearning.com] for more information.
 */
import React from "react";
import {Text} from "react-native";
import { Header, Body, Title } from "native-base";

import TouchableIcon from "./TouchableIcon";
import { baseSpace } from "@totara/theme";
import { TextStyle } from "react-native";

type TopHeaderProps = {
  onClose: ()=>void,
  color: string,
  title?: string,
  info?: string,
  infoTextStyle: TextStyle,
  titleTextStyle: TextStyle, 
  iconSize?: number,
  children?: Element,
}

const TopHeader = ({onClose, title, info, infoTextStyle, titleTextStyle, iconSize = 0, color, children}: TopHeaderProps) => 
(<Header style={{backgroundColor: color}}>
  <TouchableIcon icon={"times"} onPress={onClose} size={iconSize} style={{padding: baseSpace}} />
  <Body style={{marginRight: (children && 0) || (iconSize + baseSpace)}}>
    <Title style={titleTextStyle}>{title}</Title>
    {info && <Text style={[{paddingBottom: baseSpace}, infoTextStyle]}>{info}</Text>}
  </Body>
  { children }
</Header>)

export default TopHeader;
 