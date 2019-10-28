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

import React from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";

import {Activity} from "@totara/types";
import ContentIcon from "@totara/components/ContentIcon";
import ProgressCircle from "@totara/components/ProgressCircle";
import {translate} from "@totara/locale";

/**
 * Render a preview of the activity and execute a function when component is touched
 *
 * @param item - Activity to be rendered
 * @param onPress - function to fire when component is touched
 */
type Props = {
  item: Activity,
  onPress: (activity: Activity) => void
}

const ActivityLauncher = ({item, onPress = () => {}}: Props) => {
  return(
    <TouchableOpacity style={styles.activityContainer} onPress={() => onPress(item)}>
      <ContentIcon icon={item.type} iconSize={16} size={40}/>
      <View style={styles.container}>
        <Text style={styles.topText}>{translate("totara-component.section_title_continue_learn")}</Text>
        <Text numberOfLines={1} style={styles.bottomText}>{item.itemName}</Text>
      </View>
      <View style={styles.divider}/>
      { (item.progressPercentage) &&
          <ProgressCircle size={32} progress={item.progressPercentage}/>
      }
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  activityContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingRight: 8,
    paddingLeft: 8,
    paddingTop: 8,
    paddingBottom: 8
  },
  container: {
    flex: 1,
    paddingLeft: 8,
    paddingTop: 4
  },
  topText: {
    fontSize: 10,
    lineHeight: 12,
    color: "#64717D"
  },
  bottomText: {
    flex: 1,
    fontSize: 12,
    paddingRight: 64,
    color: "#3D444B",
    fontWeight: "bold"
  },
  divider: {
    marginRight: 16,
    backgroundColor: "#EEEEEE",
    width: 2,
    height: 30
  }
});

export default ActivityLauncher;
