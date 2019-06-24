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
 */


import {StyleSheet, Text, View} from "react-native";
import {Button} from "native-base";
import moment from "moment";
import React from "react";
import {normalize} from "@totara/theme";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {translate} from "@totara/locale";
import {DATE_FORMAT} from "@totara/lib/Constant";

/**
 * Component to render dueDate and change style depending on the dueDateState
 * it would also offer a button fire a function when state is on warning or danger
 */
type Props = {
  dueDate?: Date
  dueDateState?: string
  onExtension?: () => void
}

const ExtenstionButton = ({onExtension}: Props) =>
  <View style={{paddingTop: 3}}>
    <Button small rounded bordered light onPress={onExtension} style={{padding: 5}}>
      <Text style={styles.buttonText}> {translate("totara-component.extend_date")} </Text>
    </Button>
  </View>;

const DueDateState = ({dueDate, dueDateState, onExtension}: Props) => {

  switch (dueDateState) {
    case DueDateStateStatus.warning:
      return (
        <View style={styles.warning}>
          <View style={{flexDirection: "row"}}>
            <FontAwesomeIcon icon="exclamation-triangle" size={16} color={"#FFFFFF"}/>
            <Text style={styles.warningText}>{translate("totara-component.due")} {moment(dueDate).fromNow()} </Text>
          </View>
          {(onExtension) &&
              <ExtenstionButton onExtension={onExtension}/>}
        </View>
      );

    case DueDateStateStatus.danger:
      return (
        <View style={styles.danger}>
          <View style={{flexDirection: "row"}}>
            <FontAwesomeIcon icon="exclamation-triangle" size={16} color={"#FFFFFF"}/>
            <Text style={styles.dangerText}>{translate("totara-component.due")} {moment(dueDate).fromNow()} </Text>
          </View>
          {(onExtension) &&
              <ExtenstionButton onExtension={onExtension}/>}
        </View>
      );

    case DueDateStateStatus.info:
      return (
        <View style={styles.info}>
          <Text style={styles.infoText}>{moment(dueDate).format(DATE_FORMAT)}</Text>
        </View>
      );

    default:
      return null
  }
};

enum DueDateStateStatus {
  warning = "warning",
  danger = "danger",
  info = "info"
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
    justifyContent: "space-between",
    backgroundColor: "#8E660D",
    alignItems: "center",
    paddingLeft: 16,
    paddingRight: 16,
    height: normalize(50)
  },
  warningText: {
    color: "#FFFFFF",
    paddingLeft: 8,
    fontSize: 14,
  },
  danger: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#953539",
    alignItems: "center",
    height: normalize(50),
    paddingLeft: 16,
    paddingRight: 16,
  },
  dangerText: {
    color: "#FFFFFF",
    paddingLeft: 8,
    fontSize: 14,
  },
  buttonText: {
    color: "#FFFFFF",
  }
});

export default DueDateState;
