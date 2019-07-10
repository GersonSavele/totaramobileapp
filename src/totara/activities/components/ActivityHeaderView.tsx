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

type ActivityHeaderViewParam = {
    title: string,
    fontSize: number
  }
  
const ActivityHeaderView = ({title, fontSize}: ActivityHeaderViewParam) => {
    return(
      <View style= { styles.container }>
      <Text style= { [styles.titleText, {fontSize: fontSize}]}>{title}</Text>
      </View>
    );
};

  const styles = StyleSheet.create({
    container: {
      paddingTop: 20,
      paddingLeft: 20,
      paddingRight: 20,
      justifyContent:"flex-start"
    },
    titleText: {
        color: "#3D444B",
        fontWeight: "500",
        textAlign: 'center',
      }
    });

  export default ActivityHeaderView;