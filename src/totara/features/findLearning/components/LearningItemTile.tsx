/**
 * This file is part of Totara Enterprise.
 *
 * Copyright (C) 2021 onwards Totara Learning Solutions LTD
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
import { TotaraTheme } from "@totara/theme/Theme";
import { paddings, fontWeights, margins, borderRadius } from "@totara/theme/constants";
import { capitalizeFirstLetter } from "@totara/lib/tools";
import { CatalogItem } from "@totara/types/CatalogItem";
import { ImageElement } from "./ImageElement";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { TouchableOpacity } from "react-native-gesture-handler";

interface LearningItemTileProps {
  item: CatalogItem;
  onItemTap: () => void
}

export const LearningItemTileSkeleton = () => {

  return <View style={styles.skeletonWrapper}>
    <SkeletonPlaceholder highlightColor={TotaraTheme.colorNeutral2} backgroundColor={TotaraTheme.colorNeutral3}>
      <View style={{ aspectRatio: 1 }}>
        <View style={styles.skeletonImage} />
        <View style={styles.skeletonTitle} />
        <View style={styles.skeletonType} />
      </View>
    </SkeletonPlaceholder>
  </View >
};

export const LearningItemTile = ({ item, onItemTap }: LearningItemTileProps) => {

  return (
    <TouchableOpacity containerStyle={styles.itemWrapper} onPress={onItemTap}>
      <ImageElement imageSrc={item.mobile_image} style={styles.itemImage} />
      <View style={styles.detailWrapper}>
        <View style={styles.detail}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.itemType}>{capitalizeFirstLetter(item.itemtype)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemWrapper: {
    justifyContent: "flex-start",
    flex: 1,
    marginHorizontal: margins.marginS,
    marginBottom: margins.marginL,
    borderColor: TotaraTheme.colorNeutral5,
    borderWidth: 1,
    overflow: "hidden",
    borderRadius: borderRadius.borderRadiusS
  },
  itemImage: {
    width: "100%",
    aspectRatio: 2,
  },
  detailWrapper: {
    backgroundColor: TotaraTheme.colorNeutral2
  },
  detail: {
    padding: paddings.paddingL
  },
  title: {
    flexWrap: "wrap",
    ...TotaraTheme.textRegular,
    fontWeight: fontWeights.fontWeightBold
  },
  itemType: {
    marginTop: margins.marginS,
    ...TotaraTheme.textSmall,
    color: TotaraTheme.colorNeutral7
  },
  skeletonWrapper: {
    flexBasis: '50%',
    padding: paddings.paddingL,
    paddingTop: 0,
    marginBottom: margins.marginS,
  },
  skeletonImage: {
    aspectRatio: 2,
    borderRadius: borderRadius.borderRadiusS
  },
  skeletonTitle: {
    height: 30,
    marginTop: margins.marginL,
    borderRadius: borderRadius.borderRadiusS
  },
  skeletonType: {
    height: 15,
    marginTop: margins.marginL,
    borderRadius: borderRadius.borderRadiusS
  }
});
