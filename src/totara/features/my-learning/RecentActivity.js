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

import {ContentIcon} from "@totara/components";

export default class RecentActivity extends React.Component {

  render() {
    return (
      <TouchableOpacity style={styles.lastAccessed} onPress={() => this.props.onPress()}>
        <ContentIcon icon={"video"} iconSize={20} size={40}/>
        <View style={styles.container}>
          <Text style={styles.topText}>Continue your learning</Text>
          <Text style={styles.bottomText}>Setting up a hierarchy</Text>
        </View>
        <View>
          <FontAwesomeIcon icon="chevron-right" size={16} color={"#3D444B"}/>
        </View>
      </TouchableOpacity>
    );
  }

}

RecentActivity.propTypes = {
  onPress: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  lastAccessed: {
    flexDirection: "row",
    backgroundColor: "#CECECE",
    alignItems: "center",
    paddingRight: 16,
    paddingLeft: 16,
    paddingTop: 10,
    paddingBottom: 10,
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


