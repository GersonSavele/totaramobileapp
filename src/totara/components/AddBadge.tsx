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
import { ComponentType } from "react";
import { View, StyleSheet } from "react-native";
// @ts-ignore no types published yet for fortawesome react-native, they do have it react so check in future and remove this ignore
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { Status } from "@totara/types";
import ProgressCircle from "./ProgressCircle";
import { colorNeutral1, textColorDark, textColorLight } from "@totara/theme";


type Props = {
  size?: number,
  offsetSize?: number
}

abstract class Badge<P extends Props> extends React.Component<P> {
  abstract backgroundColor: string;
  abstract borderColor: string;
  abstract BadgeElement: ComponentType<any>;

  getStyles(size: number = 8, offsetSize: number = (size / 2)) {
    return StyleSheet.create({
      iconContainer: {
        top: -1 * offsetSize,
        right: -1 * offsetSize,
        position: "absolute",
        backgroundColor: this.backgroundColor,
        borderRadius: size * 2,
        borderWidth: size / 8,
        shadowColor: "red",
        borderColor: this.borderColor,
        width: size * 2,
        height: size * 2,
        justifyContent: "center",
        alignItems: "center"
      }
    });
  }

  render() {
    const {size, offsetSize, ...otherProps} = this.props;

    return (
      <View>
        {this.props.children}
        <View style={this.getStyles(size, offsetSize).iconContainer}>
          <this.BadgeElement size={size} {...otherProps}/>
        </View>
      </View>
    );
  }

}

class CheckBadge extends Badge<Props> {
  color = textColorLight;
  icon = "check";
  backgroundColor = "#69BD45";
  borderColor = colorNeutral1;
  BadgeElement = ({size}: Props) => <FontAwesomeIcon icon={this.icon} color={this.color} size={size}/>
}

class LockBadge extends Badge<Props> {
  color = textColorLight;
  icon = "lock";
  backgroundColor = "#999999";
  borderColor = colorNeutral1;
  BadgeElement = ({size}: Props) => <FontAwesomeIcon icon={this.icon} color={this.color} size={size}/>
}

type ProgressBadgeProps = {
  progress: number
} & Props

class ProgressBadge extends Badge<ProgressBadgeProps> {
  color = textColorDark;
  backgroundColor = colorNeutral1;
  borderColor = colorNeutral1;
  BadgeElement = ({size = 8, progress}: ProgressBadgeProps) => <ProgressCircle size={size * 2} progress={progress} />
}

const AddBadge = ({status, children, size = 16}: {status: Status | number, children: JSX.Element, size: number}) => {
  switch (status) {
    case Status.done: return <CheckBadge size={size} offsetSize={8}>{children}</CheckBadge>;
    case 100: return <CheckBadge size={size} offsetSize={8}>{children}</CheckBadge>;
    case Status.hidden: return <LockBadge size={size} offsetSize={8}>{children}</LockBadge>;
    case Status.active: // drop through default
    default:
      if (typeof status == "number")
        return <ProgressBadge size={size} offsetSize={5} progress={status}>{children}</ProgressBadge>;
      else
        return <View>{children}</View>
  }
};

export {AddBadge, CheckBadge, LockBadge, ProgressBadge};