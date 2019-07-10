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
    title: string,
    fontSize: number,
    buttonTitle : string,
    buttonBackgroundColor : string,
    buttonTitleColor : string,
    buttonBorderColor : string,
    onPress: (()=> void)
  }
  
const ActivityBottomView = ({title, fontSize, buttonTitle, buttonBackgroundColor, buttonTitleColor, buttonBorderColor, onPress }: ActivityBottomViewParam) => {
    return(
      <View style= { styles.container }>
        <Text>
        <Text style= { styles.titleText }>You have done </Text>
        <Text style= {{fontWeight: "bold", fontSize : 14}}>0</Text>
        <Text style= { styles.titleText }> attempt {"\n"}and </Text>
        <Text style= {{fontWeight: "bold", fontSize : 14}}>unlimited</Text>
        <Text style= { styles.titleText }> attempt left.</Text>
        </Text>
        <Button style = {styles.buttonStyle} onPress = {onPress}>
         <Text style = {{color: "#FFF", fontWeight: "600"}}>{buttonTitle}</Text>
      </Button>
      </View>
    );
};

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
        textAlign: 'center',
      },
    buttonStyle : {
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#69BD45",
        color: "#FFF",
        backgroundColor: "#69BD45",    
        margin : 20,
        paddingRight:"20%",
        paddingLeft: "20%",
        fontSize: 10,
        alignSelf: 'center',
        
    }
    });

  export default ActivityBottomView;