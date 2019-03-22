/*
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
 */


import {StyleSheet, Text, View} from "react-native";
import moment from "moment";
import React from "react";
import {normalize} from "@totara/theme";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";


type Props = {
  dueDate?: Date
  dueDateState?: string
}

class DueDateState extends React.Component<Props> {

  render() {
    const {dueDate, dueDateState} = this.props;

    switch (dueDateState) {
      case "warning":
        return (
          <View style={styles.warning}>
            <FontAwesomeIcon icon="video" size={16} color={"#FFFFFF"}/>
            <Text style={styles.warningText}>Due {moment(dueDate).fromNow()} </Text>
          </View>
        );

      case "danger":
        return (
          <View style={styles.danger}>
            <FontAwesomeIcon icon="video" size={16} color={"#FFFFFF"}/>
            <Text style={styles.dangerText}>Due {moment(dueDate).fromNow()} </Text>
          </View>
        );

      case "info":
        return (
          <View style={styles.info}>
            <FontAwesomeIcon icon="video" size={16} color={"#FFFFFF"}/>
            <Text style={styles.infoText}>{moment(dueDate).format("D, MMM YYYY")}</Text>
          </View>
        );

      default:
        return null
    }
  }

}

const styles = StyleSheet.create({
  info: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingLeft: 16,
    height: normalize(50)
  },
  infoText: {
    color: "#000000",
    paddingLeft: 8,
    fontSize: 14,
  },
  warning: {
    flexDirection: "row",
    backgroundColor: "#337AB7",
    alignItems: "center",
    paddingLeft: 16,
    height: normalize(50)
  },
  warningText: {
    color: "#FFFFFF",
    paddingLeft: 8,
    fontSize: 14,
  },
  danger: {
    flexDirection: "row",
    backgroundColor: "#953539",
    alignItems: "center",
    height: normalize(50),
    paddingLeft: 16,
  },
  dangerText: {
    color: "#FFFFFF",
    paddingLeft: 8,
    fontSize: 14,
  },
});

export default DueDateState;