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

import React, { useContext } from "react";
import { View, ViewStyle } from "react-native";
// @ts-ignore no types published yet for fortawesome react-native, they do have it react so check in future and remove this ignore
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { Status } from "@totara/types";
import ProgressCircle from "./ProgressCircle";
import {  ThemeContext } from "@totara/theme";


type Props = {
  size: number,
  offsetSize: number,
  status?: Status | number
}

type ProgressProps = {
  size?: number,
  progress: number
}
type IconBadgeProps = {
  size: number,
  color: string
}

const AddBadge = ({status, children, size = 16, offsetSize = 8, ...otherProps}: {status: Status | number, children: JSX.Element, size: number, offsetSize: number}) => {
  return (
    <View>
      {children}
      <RightBadge status={status} size={size} offsetSize={offsetSize} {...otherProps} />
    </View>
  );
};

const RightBadge = ({status, size, offsetSize}: Props) => {
  const [theme] = useContext(ThemeContext);
  const getContainerStyle: ((size: number, offsetSize: number, backgroundColor: string, borderColor: string)=> ViewStyle) = (size: number, offsetSize: number, backgroundColor: string = "transparent", borderColor: string = "transparent") => {
    return {
        top: -1 * offsetSize,
        right: -1 * offsetSize,
        position: "absolute",
        backgroundColor: backgroundColor,
        borderRadius: size * 2,
        borderWidth: size / 8,
        borderColor:  borderColor,
        width: size * 2,
        height: size * 2,
        justifyContent: "center",
        alignItems: "center"
      }
  }
  switch (status) {
    case Status.done: {
      const containerStyle = getContainerStyle(size, offsetSize, "#69BD45", theme.colorNeutral1);
      return <View style={containerStyle}><CheckBadge size={size} color={theme.textColorLight}/></View>;
    } case 100: { 
      const containerStyle = getContainerStyle(size, offsetSize, "#69BD45", theme.colorNeutral1);
      return <View style={containerStyle}><CheckBadge size={size} color={theme.textColorLight}  /></View>;
    } case Status.hidden: {
      const containerStyle = getContainerStyle(size, offsetSize, "#999999", theme.colorNeutral1);
      return <View style={containerStyle}><LockBadge size={size}  color={theme.textColorLight} /></View>
    } case Status.active: { // drop through default
       return null;
    } default: {
      if (typeof status == "number") {
        const containerStyle = getContainerStyle(size, offsetSize, theme.colorNeutral1, theme.colorNeutral1);
        return <View style={containerStyle}><ProgressBadge size={size} progress={status}/></View>;
      } 
      return null;
    }
  }
}

const CheckBadge = ({size, color}: IconBadgeProps) =>  <FontAwesomeIcon icon={"check"} color={color} size={size} />

const LockBadge = ({size, color}: IconBadgeProps) =>  <FontAwesomeIcon icon={"lock"} color={color} size={size} />

const ProgressBadge = ({size, progress}: ProgressProps) =>  <ProgressCircle size={ size ? size * 2 : 32} progress={progress} />

export { AddBadge, CheckBadge, LockBadge, ProgressBadge };