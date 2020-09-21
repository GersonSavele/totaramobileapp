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

import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { LearningItem } from "@totara/types";
import { TotaraTheme } from "@totara/theme/Theme";
import { paddings, fontWeights, fontSizes } from "@totara/theme/constants";
import carouselItemStyles from "@totara/features/currentLearning/learningItems/carouselItemStyles";
import { capitalizeFirstLetter } from "@totara/lib/tools";
import ImageElement from "./ImageElement";

interface LearningItemCardProps {
  item: LearningItem;
}

const LearningItemCard = ({ item }: LearningItemCardProps) => {
  return (
    <View style={{ flex: 1 }}>
      <ImageElement item={item} image={item.imageSrc} itemType={item.itemtype} />
      <View style={styles.itemCard}>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.itemFullName} numberOfLines={2}>
            {item.fullname}
          </Text>
        </View>
        <View style={{ flexGrow: 1 }}>
          <Text style={carouselItemStyles.type}>{capitalizeFirstLetter(item.itemtype)}</Text>
          <View style={{ flex: 1, paddingVertical: paddings.paddingM }}>
            <Text style={carouselItemStyles.summary} numberOfLines={30}>
              {item.summary}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemCard: {
    padding: paddings.paddingXL,
    justifyContent: "flex-start",
    flex: 1
  },
  itemFullName: {
    flexWrap: "wrap",
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
  }
});

export default LearningItemCard;
