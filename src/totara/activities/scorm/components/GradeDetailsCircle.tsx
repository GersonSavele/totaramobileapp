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

type GradeCircleParam = {
  gradeTitle: string,
  progress: number,
  status : string,
  statusColor : string
}

const GradeDetailsCircle = ({gradeTitle, progress, status, statusColor}: GradeCircleParam) => {
  return(
    <View style = {{flex:1, justifyContent: "center", alignContent: "center", paddingBottom: "5%"}}>
    <View style={styles.container}>
    <Text style = {styles.titleText}>{gradeTitle}</Text>
    <Text style = {{margin: 20}}>
     <Text style = {styles.percentageText}>{progress}</Text>
     <Text style={{fontWeight: "400", fontSize : 18}}>%</Text>
    </Text>
    <Text style = {[styles.statusText, {color: statusColor, borderColor:statusColor}]}>{status}</Text>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
      width: Dimensions.get('window').width * 0.7,
      height: Dimensions.get('window').width *0.7,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection:'column',
      shadowOpacity: 0.16,
      backgroundColor: "#FFFFFF",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: normalize(10) },
      shadowRadius: normalize(14)
    },
    titleText: {
      fontSize: 18,
      color: "#3D444B",
      fontWeight: "600"
    },
    percentageText: {
      fontSize: 40,
      color: "#3D444B",
      fontWeight: "900",
      margin: 15
    }, 
    statusText: {
      borderRadius: 5,
      borderWidth: 1,
      backgroundColor: "#FFFFFF",    
      padding : 2,
      fontSize: 10,
      textAlign: 'center'
    }
  });

export default GradeDetailsCircle;