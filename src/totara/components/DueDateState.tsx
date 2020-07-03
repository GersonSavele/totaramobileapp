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

import { translate } from "@totara/locale";
import { DATE_FORMAT } from "@totara/lib/constants";
import { TotaraTheme } from "@totara/theme/Theme";

/**
 * Component to render dueDate and change style depending on the dueDateState
 * it would also offer a button fire a function when state is on warning or danger
 */
type Props = {
  dueDate?: Date;
  dueDateState?: string;
};

const getDueDateModeStyle = (dueDateState?: string) => {
  switch (dueDateState) {
    case DueDateStateStatus.danger:
      return { backgroundColor: TotaraTheme.colorAlert };
    case DueDateStateStatus.warning:
      return { backgroundColor: TotaraTheme.colorWarning };
    default:
      return { backgroundColor: TotaraTheme.colorInfo };
  }
};

const DueDateState = ({ dueDate, dueDateState }: Props) => {
  const dueDateModeStyle = getDueDateModeStyle(dueDateState);

  return (
    <View style={[styles.container, dueDateModeStyle]}>
      <Text
        style={[TotaraTheme.textXSmall, { color: TotaraTheme.textColorLight }]}>
        {dueDateState && dueDateState == DueDateStateStatus.danger
          ? translate("totara_component.overdue_by")
          : translate("totara_component.due_in")}
        &nbsp;
        <Text style={{ fontWeight: "bold" }}>
          {moment(dueDate).toNow(true)}&nbsp;
        </Text>
      </Text>
      <Text
        style={[TotaraTheme.textXSmall, { color: TotaraTheme.textColorLight }]}>
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
    flexDirection: "row",
    padding: 8,
    flexWrap: "wrap",
    alignItems: "center"
  }
});

export default DueDateState;
