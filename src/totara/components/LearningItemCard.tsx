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

import {Image, ImageStyle, StyleSheet, Text, View, ViewStyle} from "react-native";
import React from "react";
import {Component, ComponentType} from "react";
import * as Progress from 'react-native-progress';

import {LearningItem} from "@totara/types";
import {config} from "@totara/lib";
import DueDateState from "./DueDateState";
import {normalize} from "@totara/theme";

interface Props {
  item: LearningItem
  imageStyle: ImageStyle
  cardStyle: ViewStyle
}

const learningItemCard = (WrappedComponent: ComponentType<any>) =>
  class LearningItemCard extends Component<Props> {

    render() {
      const {item, imageStyle, cardStyle} = this.props;

      const imgSrc = `${config.mobileStatic}/public/${item.id}.JPG`;

      const progressPercentage = item.progressPercentage ? item.progressPercentage/100 : 0;

      const imageStyleSheet = StyleSheet.flatten([styles.itemImage, imageStyle]);
      const cardStyleSheet = StyleSheet.flatten([styles.itemCard, cardStyle]);

      return(
        <View style={{flex: 1}}>
          <View style={imageStyleSheet}>
            <DueDateState dueDateState={item.dueDateState} dueDate={item.dueDate}/>
            <Image source={{uri: imgSrc}} style={{flex: 1, width: "100%", height: "100%"}}/>
          </View>
          <View style={cardStyleSheet}>
            <View style={{flexDirection: "row"}}>
              <Text style={styles.itemFullName}>{item.fullname}</Text>
            </View>
            <View style={styles.itemInfo}>
              <Text style={styles.itemType}>{item.type}</Text>
              <Text style={styles.pipe}> | </Text>
              <Progress.Circle progress={progressPercentage} size={16} borderColor={"#E6E6E6"} color={"#0066CC"}/>
              <Text style={styles.percentagetext}> {item.progressPercentage} %</Text>
            </View>
            {
              WrappedComponent ? <WrappedComponent/> : null
            }
          </View>
        </View>
      );
    }
  };

const styles = StyleSheet.create({
  itemImage: {
    flex: 1,
    flexDirection: "column-reverse",
  },
  itemCard: {
    padding: normalize(16),
    justifyContent: "flex-start",
    flex: 1
  },
  itemType: {
    fontSize: 12,
    color: "#A0A0A0"
  },
  pipe: {
    color: "#A0A0A0",
    paddingRight: 8,
    paddingLeft: 8,
    fontSize: 10,
  },
  percentagetext: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#A0A0A0",
  },
  itemFullName: {
    color: "#3D444B",
    flexWrap: "wrap",
    fontSize: normalize(22),
    fontWeight: "400",
    padding: 0,
    lineHeight: normalize(24),
  },
  itemInfo: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    minHeight: 30,
    maxHeight: 35,
    paddingTop: 5,
  },
});


export default learningItemCard

