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

import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { TotaraTheme } from "@totara/theme/Theme";
import { paddings, fontWeights, margins } from "@totara/theme/constants";
import { capitalizeFirstLetter } from "@totara/lib/tools";
import { CatalogItem } from "@totara/types/CatalogItem";

interface LearningItemTileProps {
  item: CatalogItem;
}

export const LearningItemTile = ({ item }: LearningItemTileProps) => {
  return (
    <View style={styles.itemWrapper}>
      <View style={styles.tileWrapper}>
        <Image
          source={{
            uri: item.mobile_image
          }}
          style={styles.itemImage}
        />
        <View style={styles.detailWrapper}>
          <View style={styles.detail}>
            <Text style={styles.itemFullName} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.itemType}>{capitalizeFirstLetter(item.itemtype)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemWrapper: {
    flex: 0.5,
    aspectRatio: 1
  },
  tileWrapper: {
    justifyContent: "flex-start",
    flex: 2,
    marginHorizontal: margins.marginS,
    marginTop: 0,
    marginBottom: margins.marginL,
    borderColor: TotaraTheme.colorNeutral5,
    borderWidth: 1,
    overflow: "hidden",
    borderRadius: margins.marginS
  },
  itemImage: {
    width: "100%",
    height: "auto",
    aspectRatio: 2,
    resizeMode: "cover",
    flex: 1
  },
  detailWrapper: {
    flex: 1,
    backgroundColor: TotaraTheme.colorNeutral2
  },
  detail: {
    padding: paddings.paddingL
  },
  itemFullName: {
    flexWrap: "wrap",
    ...TotaraTheme.textRegular,
    fontWeight: fontWeights.fontWeightBold
  },
  itemType: {
    marginTop: margins.marginS,
    ...TotaraTheme.textSmall,
    color: TotaraTheme.colorNeutral7
  }
});
