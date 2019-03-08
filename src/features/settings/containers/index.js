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
 * @author Jun Yamog <jun.yamog@totaralearning.com
 *
 */

import React from "react";
import {StyleSheet, Text, View, FlatList} from "react-native";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";

export default class Settings extends React.Component {
  static navigationOptions = {
    title: "Settings",
  };

  renderItem = ({item}) => {

    return (
      <View style={styles.activity}>
        <Text style={styles.activityText}>{item.title}</Text>
      </View>
    );
  };

  data = [
    {
      key: "1",
      title: "Download on Wifi only"

    },
    {
      key: "2",
      title: "Feedback"
    },
    {
      key: "3",
      title: "Help"

    },
    {
      key: "4",
      title: "Version"

    },

  ];

  render() {
    return (
      <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
        <FlatList
          data={this.data}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 50,
  },
  activity: {
    flex: 1,
    marginTop: 10,
    textAlign: "center",
    fontWeight: "bold",
    margin: 0,
    backgroundColor: "#FFFFFF",
    width: wp("100%")
  },
  activityText: {
    fontSize: 20,
    padding: 10,
  },
  button: {
    alignItems: "center",
    padding: 10
  },
});
