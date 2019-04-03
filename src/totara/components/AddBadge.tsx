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

enum BadgeType {
  Check = "Check",
  Lock = "Lock"
}

interface Badge {
  kind: BadgeType
  color: string
  backgroundColor: string
  icon: string
}

class CheckBadge implements Badge {
  kind = BadgeType.Check;
  color = "#FFFFFF";
  backgroundColor = "#69BD45";
  icon = "check";
}

class LockBadge implements Badge {
  kind = BadgeType.Check;
  color = "#FFFFFF";
  backgroundColor = "#999999";
  icon = "lock";
}

const addBadge = (WrappedComponent: ComponentType<any>,
                  badgeType: BadgeType,
                  size = 8) => {

  const badgeDetails = getBadgeDetails(badgeType);

  return class Badged extends Component {

    styles = StyleSheet.create({
      iconContainer: {
        top: -2 * (size / 4),
        right: 0,
        position: "absolute",
        backgroundColor: badgeDetails.backgroundColor,
        borderRadius: size * 2,
        width: size * 2,
        height: size * 2,
        justifyContent: "center",
        alignItems: "center",
      },
    });

    render() {
      return (
        <View>
          <WrappedComponent/>
          <View style={this.styles.iconContainer}>
            <FontAwesomeIcon icon={badgeDetails.icon} size={size} color={badgeDetails.color}/>
          </View>
        </View>
      );
    }

  };

};

const getBadgeDetails = (badgeType: BadgeType) => {

  switch (badgeType) {
    case BadgeType.Check:
      return new CheckBadge;
    case BadgeType.Lock:
      return new LockBadge;
  }
};

export {addBadge, BadgeType};