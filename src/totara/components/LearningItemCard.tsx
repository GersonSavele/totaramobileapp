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
import React, { useContext } from "react";

import { LearningItem, Status } from "@totara/types";
import { DueDateState }  from "@totara/components";
import { normalize, textColorDark, fontSizeH2, lineHeightH2, fontWeightMedium, colorSecondary4 } from "@totara/theme";
import { X_API_KEY } from "@totara/lib/Constant";
import { AuthContext } from "@totara/auth";

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
        { item.duedate && <DueDateState dueDateState={item.duedateState} dueDate={item.duedate} /> }
        <ImageElement item={item} />
      </View>
      <View style={cardStyleSheet}>
        <View style={{ flexDirection: "row" }}>
          <Text numberOfLines={2} style={styles.itemFullName} ellipsizeMode="tail">{item.fullname}</Text>
        </View>
        {children}
      </View>
    </View>
  );
};

const ImageElement = ({item}: {item: LearningItem}) => {

  const authContext = useContext(AuthContext);
  const apiKey = authContext.setup!.apiKey;

  const imgSrc = item.imageSrc;
  if (item.status === Status.hidden)
    return(
      <View style={{flex: 1}}>
        <Image source={{
          uri: imgSrc,
          headers: {
            [X_API_KEY]: apiKey
          }
        }} style={{flex: 1, width: "100%", height: "100%"}}/>
        <View style={styles.disabledOverlay}/>
      </View>);
  else
      return(<Image source={{
          uri: imgSrc,
          headers: {
            [X_API_KEY]: apiKey
          }
      }} style={{flex: 1, width: "100%", height: "100%"}}/>);

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
  itemFullName: {
    color: textColorDark,
    flexWrap: "wrap",
    fontSize: fontSizeH2,
    fontWeight: fontWeightMedium,
    lineHeight: lineHeightH2,
  },
  disabledOverlay: {
    position: "absolute",
    left: 0,
    top: 0,
    backgroundColor: colorSecondary4,
    opacity: 0.5,
    height: "100%",
    width: "100%"
  },
});


export default LearningItemCard