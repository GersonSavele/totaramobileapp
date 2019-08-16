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
import { View, StyleSheet, Text } from "react-native";
import { Button } from "native-base";
import { resizeByScreenSize } from "@totara/theme";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
type ButtonParam = {
  buttonTitle? : string,
  buttonBackgroundColor? : string,
  buttonTitleColor? : string,
  buttonBorderColor? : string,
  buttonTitleFontWeight? : string,
  borderRadius?: number,
  borderWidth? : number,
  fontSize? : number,
  onPress: (()=> void),
  buttonIcon? : string
}

const CustomButton = ( { buttonBackgroundColor,buttonBorderColor,onPress,buttonTitleColor,buttonTitle, buttonTitleFontWeight, borderRadius, borderWidth, fontSize, buttonIcon }: ButtonParam) => {
     return(
  <View style = {styles.containerModelButtonStyle}>
    <Button style={[styles.ButtonStyle,{
      backgroundColor: buttonBackgroundColor != undefined? buttonBackgroundColor : "#FFF", 
      borderColor:buttonBorderColor != undefined? buttonBorderColor : "#FFF",
      borderRadius:borderRadius != undefined? borderRadius : 20,
      borderWidth:borderWidth != undefined? borderWidth : 0
    }]} onPress = {onPress} >
    <Text style = {[styles.titleText,{
      color: buttonTitleColor != undefined? buttonTitleColor : "#337AB7",  
      fontWeight: buttonTitleFontWeight != undefined? buttonTitleFontWeight : "normal",
      fontSize : fontSize != undefined? fontSize : 18,
      alignSelf: 'center'
    }]}>{buttonTitle}</Text>
    {buttonIcon != undefined? <FontAwesomeIcon icon={buttonIcon} size={fontSize} color={buttonTitleColor} /> : null}
    </Button>
  </View>)
}

const styles = StyleSheet.create({
  containerModelButtonStyle: {
      paddingBottom: resizeByScreenSize(8, 8, 16, 16),
    },
    ButtonStyle:{
      paddingRight:"10%",
      paddingLeft: "10%",
      alignSelf: 'center',
      flexDirection:"row",
      elevation: 0,
      shadowOpacity: 0,
    },
    titleText: {
      color: "#FFF",
      textAlign: 'center',
      marginRight:10
    },
  });

export default CustomButton;