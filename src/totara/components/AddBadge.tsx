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
import {Component, ComponentType} from "react";
import {View, StyleSheet} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";


const addBadge = (WrappedComponent: ComponentType<any>) =>
  class Badged extends Component {

    render() {
      return (
        <View>
          <WrappedComponent/>
          <View style={styles.iconContainer}>
            <FontAwesomeIcon icon="check" size={8} color={"white"}/>
          </View>
        </View>
      );
    }

  };


const styles = StyleSheet.create({
  iconContainer: {
    top: -2,
    right: 0,
    position: "absolute",
    backgroundColor: "#69BD45",
    borderRadius: 16,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  }
});

export default addBadge;