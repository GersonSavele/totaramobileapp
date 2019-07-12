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
 */

import React from "react";
import { Text, View , StyleSheet } from "react-native";
import {Button} from "native-base";

  type ActivityBottomViewParam = {
    children?: any[];
  }

  type ActivityBottomViewTitleParam = {
    fontSize?: number, 
    color?: string,
    fontWeight?: string,
    attempts?: string,
    leftAttempts?:string
  }

  type ActivityBottomViewButtonParam = {
    buttonTitle? : string,
    buttonBackgroundColor? : string,
    buttonTitleColor? : string,
    buttonBorderColor? : string,
    buttonTitleFontWeight? : string,
    borderRadius?: number,
    borderWidth? : number,
    fontSize? : number,
    onPress: (()=> void)
  }
  
const ActivityBottomView = ({children}: ActivityBottomViewParam) => {
    return(
      <View style= { styles.container }>
        {children}
      </View>
    );
};

const ActivityBottomViewTitle = ({fontSize, color, fontWeight, attempts, leftAttempts}: ActivityBottomViewTitleParam) => {
  return(
    <Text>
      <Text style= { styles.titleText }>You have done </Text>
      <Text style= {{fontWeight: "bold", fontSize : 14}}>{attempts}</Text>
      <Text style= { styles.titleText }> attempt {"\n"}and </Text>
      <Text style= {{fontWeight: "bold", fontSize : 14}}>{leftAttempts}</Text>
      <Text style= { styles.titleText }> attempt left.</Text>
  </Text>
  );
}

const ActivityBottomViewButton = ({buttonBackgroundColor,buttonBorderColor,onPress,buttonTitleColor,buttonTitle, buttonTitleFontWeight, borderRadius, borderWidth, fontSize}: ActivityBottomViewButtonParam) =>{
  return (
    <Button style = {[styles.buttonStyle, {
      backgroundColor: buttonBackgroundColor != undefined? buttonBackgroundColor : "#FFF", 
      borderColor:buttonBorderColor != undefined? buttonBorderColor : "#3D444B",
      borderRadius:borderRadius != undefined? borderRadius : 20,
      borderWidth:borderWidth != undefined? borderWidth : 1
    }]} 
      onPress = {onPress}>
      <Text style = {{
        color: buttonTitleColor != undefined? buttonTitleColor : "#FFF",  
        fontWeight: buttonTitleFontWeight != undefined? buttonTitleFontWeight : "normal",
        fontSize : fontSize != undefined? fontSize : 18,
        alignSelf: 'center'
        }}>{buttonTitle}</Text>
    </Button>
  );
}

const styles = StyleSheet.create({
    container: {
        justifyContent:"flex-end",
        marginBottom:"10%",
        flexDirection:'column'
    },
    titleText: {
        fontSize: 12,
        color: "#3D444B",
        fontWeight: "normal",
        textAlign: 'center'
      },
    buttonStyle : {
        margin : 20,
        paddingRight:"20%",
        paddingLeft: "20%",
        alignSelf: 'center'
    }
    });

export  {ActivityBottomView, ActivityBottomViewTitle,ActivityBottomViewButton};