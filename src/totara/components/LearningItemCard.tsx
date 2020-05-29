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
  ViewStyle,
  ImageSourcePropType
} from "react-native";
import React, { useContext } from "react";

import { LearningItem } from "@totara/types";
import DueDateState from "./DueDateState";
import { normalize } from "@totara/theme";
import { TotaraTheme } from "@totara/theme/Theme";
import { AUTHORIZATION, learningItemEnum } from "@totara/lib/constants";
import { AuthContext } from "@totara/core";
import { Images } from "@resources/images";

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
  const cardStyleSheet = StyleSheet.flatten([styles.itemCard, cardStyle]);
  return (
    <View style={cardStyleSheet}>
      <View style={{ flexDirection: "row" }}>
        <Text
          numberOfLines={2}
          style={[TotaraTheme.textH2, styles.itemFullName]}
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
  return (
    <View
      style={[imageStyleSheet, { backgroundColor: TotaraTheme.colorNeutral3 }]}>
      {item.duedate && (
        <DueDateState dueDateState={item.duedateState} dueDate={item.duedate} />
      )}
      {image && image.length > 0 ? (
        <Image
          source={{
            uri: image,
            headers: {
              [AUTHORIZATION]: `Bearer ${apiKey}`
            }
          }}
          style={styles.imageWrap}
        />
      ) : (
        <DefaultImage item={item} />
      )}
    </View>
  );
};

const DefaultImage = ({ item }: { item: LearningItem }) => {
  switch (item.itemtype) {
    case learningItemEnum.Course:
      return (
        <Image
          style={styles.imageWrap}
          source={Images.defaultCourses as ImageSourcePropType}
          resizeMode="center"
        />
      );
    case learningItemEnum.Program:
      return (
        <Image
          style={styles.imageWrap}
          source={Images.defaultProgram as ImageSourcePropType}
          resizeMode="center"
        />
      );
    case learningItemEnum.Certification:
      return (
        <Image
          style={styles.imageWrap}
          source={Images.defaultCertifications as ImageSourcePropType}
          resizeMode="center"
        />
      );
    default:
      return null;
  }
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
  },
  imageWrap: {
    flex: 1,
    width: "100%",
    height: "100%"
  }
});

export { LearningItemCard, CardElement, ImageElement };
