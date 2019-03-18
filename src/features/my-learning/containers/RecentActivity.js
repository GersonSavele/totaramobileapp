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
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faVideo, faChevronRight} from "@fortawesome/free-solid-svg-icons";
import {normalize} from "../../../components/Styles";

export default class RecentActivity extends React.Component {
  style = StyleSheet.create({
    lastAccessed: {
      flexDirection: "row",
      backgroundColor: "#CECECE",
      alignItems: "center",
      paddingRight: 16,
      paddingLeft: 16,
      paddingTop: 10,
      paddingBottom: 10,
    },
    icon: {
      padding: 0,
      backgroundColor: "#3D444B",
      borderRadius: 20,
      borderWidth: 1,
      borderColor: "#3D444B",
      height: normalize(40),
      width: normalize(40),
      justifyContent: "center",
      alignItems: "center",
    },

    container: {
      flex: 1,
      justifyContent: 'space-between',
      paddingLeft: 8,
    },
    topText: {
      fontSize: 12,
      lineHeight: 14,
      color: "#64717D"
    },
    bottomText: {
      fontSize: 16,
      lineHeight: 18,
    }
  });

  render() {
    return (
      <TouchableOpacity style={this.style.lastAccessed} onPress={() => this.props.onPress()}>
        <View style={this.style.icon}>
          <FontAwesomeIcon icon={faVideo} size={16} color={"#FFFFFF"}/>
        </View>
        <View style={this.style.container}>
          <Text style={this.style.topText}>Continue your learning</Text>
          <Text style={this.style.bottomText}>Setting up a hierarchy</Text>
        </View>
        <View>
          <FontAwesomeIcon icon={faChevronRight} size={16} color={"#3D444B"}/>
        </View>
      </TouchableOpacity>
    );
  }
}

RecentActivity.propTypes = {
  onPress: PropTypes.func.isRequired
};


