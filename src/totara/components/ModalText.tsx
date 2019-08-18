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
 * @author Tharaka Dushmantha <tharaka.dushmantha@totaralearning.com
**/

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { resizeByScreenSize } from "@totara/theme";

type TextParam = {
    text: string,
    fontSize?: number, 
    color?: string,
    fontWeight?: string,
}

const ModalText = ({text, fontSize, color, fontWeight } : TextParam) => {
  return(
    <View style={styles.containerStyle} >
      <Text style = {[styles.titleTextStyle,
       {fontSize : fontSize != undefined? fontSize : 18,
        color: color != undefined? color : "#0101", 
        fontWeight: fontWeight != undefined? fontWeight : "normal",
       }]}>{text}
      </Text>
    </View>  
  ) 
}

const styles = StyleSheet.create({ 
  containerStyle: {
    alignItems: "flex-start",
    paddingBottom: resizeByScreenSize(8, 8, 16, 16)
  },
    titleTextStyle: {
    textAlign: 'center',
  }
});

export default ModalText;