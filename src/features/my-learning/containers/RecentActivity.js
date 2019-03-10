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
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import PropTypes from "prop-types";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";
import Icon from "react-native-vector-icons/FontAwesome";

export default class RecentActivity extends React.Component {
  style = StyleSheet.create({
    lastAccessed: {
      fontSize: 20,
      height: 65,
      width: wp("100%"),
      backgroundColor: "#CECECE",
    },
    topText: {
      padding: 5,
      borderBottomWidth: 1,
      borderBottomColor: "#AAAAAA",
      paddingLeft: 20,
      fontWeight: "bold",

    },
    bottomText: {
      padding: 5,
      height: 40,
      flexDirection: "row"
    }
  });

  render() {
    return (
      <TouchableOpacity style={this.style.lastAccessed} onPress={() => this.props.onPress()}>
        <Text style={this.style.topText}>Continue your learning</Text>
        <View style={{flexDirection: "row", paddingLeft: 20}}>
          <Icon name="film" size={24}/>
          <Text style={this.style.bottomText}>Setting up a hierarchy</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

RecentActivity.propTypes = {
  onPress: PropTypes.func.isRequired
};


