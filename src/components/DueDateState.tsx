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


import {StyleSheet, Text, View} from "react-native";
import moment from "moment";
import React from "react";
import {normalize} from "./Styles";

type Props = {
  dueDate: Date
  dueDateState: string
}

class DueDateState extends React.Component<Props> {

  render() {
    const {dueDate, dueDateState} = this.props;

    switch (dueDateState) {
      case "warning":
        return (
          <View style={styles.warning}>
            <Text style={styles.warningText}>Due {moment(dueDate).fromNow()} </Text>
          </View>
        );

      case "danger":
        return (
          <View style={styles.danger}>
            <Text style={styles.dangerText}>Due {moment(dueDate).fromNow()} </Text>
          </View>
        );

      case "info":
        return (
          <View style={styles.info}>
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
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    height: 28
  },
  infoText: {
    color: "#000000",
    paddingLeft: 5,
  },
  warning: {
    backgroundColor: "#FFF062",
    justifyContent: "center",
    height: 28
  },
  warningText: {
    color: "#000000",
    paddingLeft: 5,
  },
  danger: {
    backgroundColor: "#E73C09",
    justifyContent: "center",
    height: 28
  },
  dangerText: {
    color: "#FFFFFF",
    paddingLeft: 5,
  },
});

export default DueDateState;