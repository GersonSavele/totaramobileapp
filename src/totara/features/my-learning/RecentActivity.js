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
import {Text, TouchableOpacity, View} from "react-native";
import PropTypes from "prop-types";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faVideo, faChevronRight} from "@fortawesome/free-solid-svg-icons";
import styles from "./styles/RecentActivity"

export default class RecentActivity extends React.Component {

  render() {
    return (
      <TouchableOpacity style={styles.lastAccessed} onPress={() => this.props.onPress()}>
        <View style={styles.icon}>
          <FontAwesomeIcon icon={faVideo} size={16} color={"#FFFFFF"}/>
        </View>
        <View style={styles.container}>
          <Text style={styles.topText}>Continue your learning</Text>
          <Text style={styles.bottomText}>Setting up a hierarchy</Text>
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


