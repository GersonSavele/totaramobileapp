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
import { Text, View , StyleSheet , Dimensions} from "react-native";
import {normalize} from "@totara/theme";

type GradeDetailsCircleParam = {
  borderRadius?: number,
  width ?: number,
  height? : number,
  backgroundColor?: string,
  shadowColor?: string,
  shadowRadius?:number,
  shadowOpacity?: number,
  borderWidth?: number,
  children?: any[]
}

type GradeDetailsTextParams = {
  text: string,
  color?: string,
  backgroundColor?:string,
  fontWeight? : string,
  fontSize? : number,
  borderColor?: string,
  borderWidth?: number,
  borderRadius?: number
}

const GradeDetailsCircle = ({borderRadius,width,height,backgroundColor,shadowColor,shadowRadius, shadowOpacity, children}: GradeDetailsCircleParam) => {
  return(
    <View style = {styles.container}>
      <View style={[styles.circleStyle,{borderRadius : borderRadius != undefined? borderRadius : Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
      width: width != undefined? width :  Dimensions.get('window').width * 0.7,
      height:height != undefined? height: Dimensions.get('window').width *0.7,
      backgroundColor:backgroundColor != undefined? backgroundColor: "#FFFFFF",
      shadowColor: shadowColor != undefined? shadowColor: "#000",
      shadowRadius:shadowRadius != undefined? shadowRadius: normalize(14),
      shadowOpacity: shadowOpacity != undefined? shadowOpacity: 0.16
      }]}>
      {children}
      </View>
    </View>
  );
};

const GradeDetailsTitle = ({text, fontSize, fontWeight, color}: GradeDetailsTextParams) => {
  return(
      <Text style = {[{
        fontSize: fontSize != undefined? fontSize: 18,
        color:color != undefined? color: "#3D444B",
        fontWeight:fontWeight !=undefined?fontWeight: "600"}
      ]}>{text}</Text>
  );
}

const GradeDetailsProgress = ({text,fontSize, fontWeight, color}: GradeDetailsTextParams) => {
  fontSize = fontSize != undefined? fontSize : 40;
  return(
    <Text style = {{margin: 20}}>
      <Text style = {[styles.percentageTextStyle,{
        fontSize: fontSize,
        color: color != undefined? color: "#3D444B",
        fontWeight: fontWeight !=undefined? fontWeight: "900",
      }
      ]}>{text}</Text>
      <Text style={{
        fontWeight: fontWeight !=undefined? fontWeight: "400", 
        fontSize : (fontSize!/2)}}>%</Text>
   </Text>
  );
}

const GradeDetailsStatus = ({text, borderColor, color, backgroundColor,fontSize, borderRadius, borderWidth }: GradeDetailsTextParams) => {
  return(
    <Text style = {[styles.statusTextStyle, {color: color,
      borderColor:borderColor != undefined? borderColor: "#FFFFFF", 
      backgroundColor : backgroundColor != undefined? backgroundColor: "#FFFFFF",
      fontSize:fontSize != undefined? fontSize: 10,
      borderRadius: borderRadius != undefined? borderRadius: 5,
      borderWidth: borderWidth != undefined? borderWidth:1
    }]}>{text}</Text>
  );
}

const styles = StyleSheet.create({
    container:{
      flex:1, 
      justifyContent: "center", 
      alignContent: "center", 
      paddingBottom: "5%"
    },
    circleStyle: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection:'column',
      shadowOffset: { width: 0, height: normalize(10) },
    },
    percentageTextStyle: {
      margin: 15
    }, 
    statusTextStyle: {
      padding : 2,
      textAlign: 'center'
    }
  });

export  { GradeDetailsCircle,GradeDetailsTitle,GradeDetailsProgress,GradeDetailsStatus };