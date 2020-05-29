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

import {
  Image,
  ImageStyle,
  StyleSheet,
  Text,
  View,
  ViewStyle
} from "react-native";
import React, { useContext } from "react";

import { LearningItem } from "@totara/types";
import DueDateState from "./DueDateState";
import { normalize, ThemeContext } from "@totara/theme";
import { AUTHORIZATION } from "@totara/lib/constants";
import { AuthContext } from "@totara/core";

interface Props {
  item: LearningItem;
  imageStyle?: ImageStyle;
  cardStyle?: ViewStyle;
  children?: JSX.Element;
  image?: string;
}

const LearningItemCard = ({
  item,
  imageStyle,
  cardStyle,
  children,
  image
}: Props) => {
  return (
    <View style={{ flex: 1 }}>
      <ImageElement item={item} imageStyle={imageStyle} image={image} />
      <CardElement item={item} cardStyle={cardStyle}>
        {children}
      </CardElement>
    </View>
  );
};

const CardElement = ({ item, cardStyle, children }: Props) => {
  const [theme] = useContext(ThemeContext);
  const cardStyleSheet = StyleSheet.flatten([styles.itemCard, cardStyle]);
  return (
    <View style={cardStyleSheet}>
      <View style={{ flexDirection: "row" }}>
        <Text
          numberOfLines={2}
          style={[theme.textH2, styles.itemFullName]}
          ellipsizeMode="tail">
          {item.fullname}
        </Text>
      </View>
      {children}
    </View>
  );
};

const ImageElement = ({ item, imageStyle, image }: Props) => {
  const imageStyleSheet = StyleSheet.flatten([styles.itemImage, imageStyle]);
  const {
    authContextState: { appState }
  } = useContext(AuthContext);
  const apiKey = appState!.apiKey;
  const imgSrc = image;
  return (
    <View style={imageStyleSheet}>
      {item.duedate && (
        <DueDateState dueDateState={item.duedateState} dueDate={item.duedate} />
      )}
      <Image
        source={{
          uri: imgSrc,
          headers: {
            [AUTHORIZATION]: `Bearer ${apiKey}`
          }
        }}
        style={{ flex: 1, width: "100%", height: "100%" }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  itemImage: {
    flex: 1,
    flexDirection: "column-reverse"
  },
  itemCard: {
    padding: normalize(16),
    justifyContent: "flex-start",
    flex: 1
  },
  itemFullName: {
    flexWrap: "wrap"
  },
  disabledOverlay: {
    position: "absolute",
    left: 0,
    top: 0,
    opacity: 0.5,
    height: "100%",
    width: "100%"
  }
});

export { LearningItemCard, CardElement, ImageElement };
