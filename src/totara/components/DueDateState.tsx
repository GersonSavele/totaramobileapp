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

import { StyleSheet, Text, View } from "react-native";
import moment from "moment";
import React from "react";

import { gutter } from "@totara/theme";
import { translate } from "@totara/locale";
import { DATE_FORMAT } from "@totara/lib/Constant";

/**
 * Component to render dueDate and change style depending on the dueDateState
 * it would also offer a button fire a function when state is on warning or danger
 */
type Props = {
  dueDate?: Date
  dueDateState?: string
}


const DuedateModeStyle = ({ dueDateState }: Props) => ((dueDateState == DueDateStateStatus.info) ? styles.normal : styles.warning);
 
const DueDateState = ({ dueDate, dueDateState }: Props) => {

  const duedateModeStyle = DuedateModeStyle({ dueDateState });
  
  return (
    <View style={[styles.container, duedateModeStyle]}>
      <Text style={styles.generalText}>
        {translate("totara-component.due")}&nbsp;
        <Text style={styles.highlighText}>
          {moment(dueDate).fromNow()}&nbsp;
        </Text>
      </Text>
      <Text style={styles.generalText}>
        ({moment(dueDate).format(DATE_FORMAT)})
      </Text>
    </View>
  );
};

enum DueDateStateStatus {
  warning = "warning",
  danger = "danger",
  info = "info"
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flexDirection: "row",
    padding: gutter,
    flexWrap: "wrap"
  },
  normal: {
    backgroundColor: "#4579B2"
  },
  warning: {
    backgroundColor: "#8A3B3C"
  },
  generalText: {
    fontSize: 14,
    color: "#fff"
  },
  highlighText: {
    fontSize: 14,
    fontWeight: "bold"
  }
});

export default DueDateState;
