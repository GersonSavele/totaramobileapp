/**
 * This file is part of Totara Enterprise.
 *
 * Copyright (C) 2020 onwards Totara Learning Solutions LTD
 *
 * Totara Enterprise is provided only to Totara Learning Solutions
 * LTD’s customers and partners, pursuant to the terms and
 * conditions of a separate agreement with Totara Learning
 * Solutions LTD or its affiliate.
 *
 * If you do not have an agreement with Totara Learning Solutions
 * LTD, you may not access, use, modify, or distribute this software.
 * Please contact [sales@totaralearning.com] for more information.
 */

import { ImageStyle, StyleSheet, Text, View, ViewStyle } from "react-native";
import React from "react";
import { LearningItem } from "@totara/types";
import DueDateState from "./DueDateState";
import { TotaraTheme } from "@totara/theme/Theme";
import { paddings, fontWeights, fontSizes } from "@totara/theme/constants";
import { ImageWrapper } from "@totara/components";
import DefaultImage from "@totara/features/currentLearning/components/DefaultImage";
import { deviceScreen } from "@totara/lib/tools";

interface Props {
  item: LearningItem;
  imageStyle?: ImageStyle;
  cardStyle?: ViewStyle;
  children?: JSX.Element;
  image?: string;
  itemType?: string;
}

const LearningItemCard = ({ item, imageStyle, cardStyle, children, image, itemType }: Props) => {
  return (
    <View style={{ flex: 1 }}>
      <ImageElement item={item} imageStyle={imageStyle} image={image} itemType={itemType} />
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
        <Text style={styles.itemFullName}>{item.fullname}</Text>
      </View>
      {children}
    </View>
  );
};

const ImageElement = ({ item, imageStyle, image, itemType }: Props) => {
  const imageStyleSheet = StyleSheet.flatten([styles.itemImage, imageStyle]);
  return (
    <View style={[imageStyleSheet]}>
      {item.duedate && <DueDateState dueDateState={item.duedateState} dueDate={item.duedate} />}
      {image && image.length > 0 ? (
        <ImageWrapper url={image} style={styles.imageWrap} />
      ) : (
        <DefaultImage itemType={itemType} style={styles.imageWrap} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  itemImage: {
    flex: 1,
    flexDirection: "column-reverse"
  },
  itemCard: {
    padding: paddings.paddingXL,
    justifyContent: "flex-start",
    flex: 1
  },
  itemFullName: {
    flexWrap: "wrap",
    paddingTop: paddings.paddingS,
    ...TotaraTheme.textHeadline,
    fontWeight: fontWeights.fontWeightSemiBold,
    fontSize: fontSizes.fontSizeL
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
    width: deviceScreen.width / 2
  }
});

export { LearningItemCard, CardElement, ImageElement };
