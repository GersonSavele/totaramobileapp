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

import { Image, ImageStyle, StyleSheet, Text, View, ViewStyle } from "react-native";
import React from "react";

import { LearningItem, Status } from "@totara/types";
import { DueDateState }  from "@totara/components";
import { normalize } from "@totara/theme";

interface Props {
  item: LearningItem
  imageStyle: ImageStyle
  cardStyle: ViewStyle,
  children: JSX.Element
}

const LearningItemCard = ({item, imageStyle, cardStyle, children}: Props) => {

  const imageStyleSheet = StyleSheet.flatten([styles.itemImage, imageStyle]);
  const cardStyleSheet = StyleSheet.flatten([styles.itemCard, cardStyle]);
  return (
    <View style={{ flex: 1 }}>
      <View style={imageStyleSheet}>
        { item.dueDate && <DueDateState dueDateState={item.dueDateState} dueDate={item.dueDate} /> }
        <ImageElement item={item} />
      </View>
      <View style={cardStyleSheet}>
        <View style={{ flexDirection: "row" }}>
          <Text numberOfLines={1} style={styles.itemFullName}>
            {item.fullname}
          </Text>
        </View>
        {children}
      </View>
    </View>
  );
};

const ImageElement = ({item}: {item: LearningItem}) => {

  const imgSrc = item.imageSrc;
  if (item.status === Status.hidden)
    return(
      <View style={{flex: 1}}>
        <Image source={{uri: imgSrc}} style={{flex: 1, width: "100%", height: "100%"}}/>
        <View style={styles.disabledOverlay}/>
      </View>);
  else
      return(<Image source={{uri: imgSrc}} style={{flex: 1, width: "100%", height: "100%"}}/>);

};

const styles = StyleSheet.create({
  itemImage: {
    flex: 1,
    flexDirection: "column-reverse",
  },
  itemCard: {
    paddingLeft: normalize(16),
    paddingTop: normalize(16),
    paddingRight: normalize(16),
    paddingBottom: normalize(16),
    justifyContent: "flex-start",
    flex: 1
  },
  itemFullName: {
    color: "#3D444B",
    flexWrap: "wrap",
    fontSize: normalize(20),
    fontWeight: "500",
    padding: 0,
    lineHeight: normalize(24),
  },
  disabledOverlay: {
    position: "absolute",
    left: 0,
    top: 0,
    backgroundColor: "white",
    opacity: 0.5,
    height: "100%",
    width: "100%"
  },
});


export default LearningItemCard