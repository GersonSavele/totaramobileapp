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


import {Text} from "react-native";
import moment from "moment";
import React from "react";

const dueDateStateStyle = (dateDateState: string) => {
  let style;
  switch (dateDateState) {
    case "warning":
      style = {
        padding: 2,
        backgroundColor: "#FFF062",
        color: "#000000"
      };
      break;
    case "danger":
      style = {
        padding: 2,
        backgroundColor: "#E73C09",
        color: "#FFFFFF"
      };
      break;
    default:
      style = {};
  }

  return style;
};

type Props = {
  dueDate: Date
  dueDateState: string
}

class DueDateState extends React.Component<Props> {

  render() {
    const {dueDate, dueDateState} = this.props;

    if (dueDate && dueDateState != "info") {
      return (<Text style={dueDateStateStyle(dueDateState)}> Due {moment(dueDate).fromNow()} </Text>);
    } else if (dueDate) {
      return (<Text> {moment(dueDate).format("D, MMM YYYY")}</Text>);
    } else {
      return null;
    }
  }

}


export default DueDateState;