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
import * as Progress from "react-native-progress";
import {Status} from "@totara/types";

enum BadgeType {
  Check = "Check",
  Lock = "Lock",
  Progress = "Progress"
}

interface Badge {
  kind: BadgeType
  color: string
  backgroundColor: string
  icon: string
}

// TODO rethink if this should be a class
class CheckBadge implements Badge {
  kind = BadgeType.Check;
  color = "#FFFFFF";
  backgroundColor = "#69BD45";
  icon = "check";
  borderColor = "#FFFFFF"
}

class LockBadge implements Badge {
  kind = BadgeType.Check;
  color = "#FFFFFF";
  backgroundColor = "#999999";
  icon = "lock";
  borderColor = "#FFFFFF"
}

class ProgressBadge implements Badge { // TODO just not have a class, too brittle
  kind = BadgeType.Progress;
  color = "#69BD45";
  backgroundColor = "#E6E6E6";
  icon = undefined;
  borderColor = "#FFFFFF"
}

const addBadge = (WrappedComponent: ComponentType<any>,
                  badgeType: BadgeType,
                  size = 8,
                  offsetSize = (size / 2),
                  progress = 0) => () => {

  const badgeDetails = getBadgeDetails(badgeType);

  const styles = StyleSheet.create({
      iconContainer: {
        top: -1 * offsetSize,
        right: -1 * offsetSize,
        position: "absolute",
        backgroundColor: badgeDetails.backgroundColor,
        borderRadius: size * 2,
        borderWidth: size / 8,
        borderColor: badgeDetails.borderColor,
        width: size * 2,
        height: size * 2,
        justifyContent: "center",
        alignItems: "center",
      },
    });

  const Badge = () => (badgeDetails.kind === BadgeType.Progress) ?
    <ProgressCircle size={size * 2} progress={progress}/>
    :
    <FontAwesomeIcon icon={badgeDetails.icon} size={size} color={badgeDetails.color}/>


  return (
      <View>
        <WrappedComponent/>
        <View style={styles.iconContainer}>
          <Badge/>
        </View>
      </View>
    );

};

const getBadgeDetails = (badgeType: BadgeType) => {

  switch (badgeType) {
    case BadgeType.Check:
      return new CheckBadge;
    case BadgeType.Lock:
      return new LockBadge;
    case BadgeType.Progress:
      return new ProgressBadge;
    default:
      throw "unsupported badgeType: " + badgeType;
  }
};

const applyBadge = (status: Status | number, component: ComponentType<any>) => {
  switch (status) {
    case Status.done: return addBadge(component, BadgeType.Check, 16);
    case 100: return addBadge(component, BadgeType.Check, 16);
    case Status.hidden: return addBadge(component, BadgeType.Lock, 16);
    case Status.active: // drop through default
    default:
      if (typeof status == "number")
        return addBadge(component, BadgeType.Progress, 16, 8, status);
      else
        return component
  }
};

type ProgressCircleParam = {
  progress: number,
  size: number
}

const ProgressCircle = ({size, progress}: ProgressCircleParam) => {

  return <Progress.Circle progress={progress/100}
                   size={size}
                   unfilledColor={"#E6E6E6"}
                   color={"#69BD45"}
                   thickness={2}
                   borderWidth={0}
                   formatText={() =>  progress+"%"}
                   showsText={true}
                   textStyle={{fontSize: 11, fontWeight: "bold", color: "#000000"}}/>

};

export {addBadge, BadgeType, applyBadge, ProgressCircle};