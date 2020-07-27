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

import {
  Image,
  ImageStyle,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  ImageSourcePropType
} from "react-native";
import React from "react";
import { LearningItem } from "@totara/types";
import DueDateState from "../../../components/DueDateState";
import { TotaraTheme } from "@totara/theme/Theme";
import { learningItemEnum } from "../constants";
import { Images } from "@resources/images";
import { paddings, fontWeights, fontSizes } from "@totara/theme/constants";
import { ImageWrapper } from "@totara/components";

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
        <Text style={styles.itemFullName}>{item.fullname}</Text>
      </View>
      {children}
    </View>
  );
};

const ImageElement = ({ item, imageStyle, image }: Props) => {
  const imageStyleSheet = StyleSheet.flatten([styles.itemImage, imageStyle]);
  return (
    <View
      style={[imageStyleSheet, { backgroundColor: TotaraTheme.colorNeutral3 }]}>
      {item.duedate && (
        <DueDateState dueDateState={item.duedateState} dueDate={item.duedate} />
      )}
      {image && image.length > 0 ? (
        <ImageWrapper url={image} style={styles.imageWrap} />
      ) : (
        <DefaultImage itemType={item.itemtype} />
      )}
    </View>
  );
};

const DefaultImage = ({ itemType }: { itemType: string }) => {
  switch (itemType) {
    case learningItemEnum.Course:
      return (
        <Image
          style={styles.imageWrap}
          source={Images.defaultCourses as ImageSourcePropType}
          resizeMode="contain"
        />
      );
    case learningItemEnum.Program:
      return (
        <Image
          style={styles.imageWrap}
          source={Images.defaultProgram as ImageSourcePropType}
          resizeMode="contain"
        />
      );
    case learningItemEnum.Certification:
      return (
        <Image
          style={styles.imageWrap}
          source={Images.defaultCertifications as ImageSourcePropType}
          resizeMode="contain"
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
    flex: 1,
    width: "100%",
    height: "100%"
  }
});

export { LearningItemCard, CardElement, ImageElement };
