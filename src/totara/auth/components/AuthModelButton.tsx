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
import { View, TouchableOpacity, StyleSheet,Text  } from "react-native";


type ButtonParam = {
    onPress : any, 
    title : string
}

const AuthModelGoToBrowserButton = ( {onPress , title}: ButtonParam) => {
  <View style = {styles.containerGoToBrowserStyle}>
    <TouchableOpacity style =  {styles.goToBrowserButtonStyle}  onPress = {onPress}>
     <Text style={styles.goToBrowserTextStyle}>{title}</Text>
    </TouchableOpacity>
  </View>
}

const AuthModelLogOutButton = ({onPress , title}: ButtonParam) => {
    <View style = {styles.containerLogOutStyle}>
       <TouchableOpacity style =  {styles.gAuthModelLogOutButtonStyle}  onPress = {onPress}>
        <Text style={styles.logOutTextStyle}>{title}</Text>
       </TouchableOpacity>
    </View>
}


const styles = StyleSheet.create({
    containerGoToBrowserStyle: {
     
    },
    containerLogOutStyle: {
     
    },
    goToBrowserButtonStyle:{

    },
    gAuthModelLogOutButtonStyle:{
        
    },
    goToBrowserTextStyle: {

    },
    logOutTextStyle: {

    }
  });

export { AuthModelGoToBrowserButton, AuthModelLogOutButton };