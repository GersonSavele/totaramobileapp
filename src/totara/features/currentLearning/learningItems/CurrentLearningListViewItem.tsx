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

import { NavigationStackProp } from "react-navigation-stack";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TotaraTheme } from "@totara/theme/Theme";
import { translate } from "@totara/locale";
import moment from "moment";
import { itemToRouteMap, navigateTo } from "@totara/lib/navigation";
import { ImageWrapper, ProgressCircle } from "@totara/components";
import DefaultImage from "@totara/features/currentLearning/components/DefaultImage";
import { capitalizeFirstLetter } from "@totara/lib/tools";
import NativeAccessRestriction from "@totara/features/currentLearning/NativeAccessRestriction";
import { borderRadius, iconSizes, margins, paddings } from "@totara/theme/constants";

type ListViewItemProps = {
  item: any;
  navigation: NavigationStackProp;
};

const CurrentLearningListViewItem = ({ item, navigation }: ListViewItemProps) => {
  const [showRestriction, setShowRestriction] = useState(false);
  const { fullname, progress, itemtype, duedate, duedateState, id, native, imageSrc } = item;

  const DueDateWidget = (dueDate, dueDateState) => {
    if (!dueDate) return <View testID={"test_noDueDate"} />;

    const color =
      dueDateState === "danger"
        ? TotaraTheme.colorAlert
        : dueDateState === "warning"
        ? TotaraTheme.colorWarning
        : TotaraTheme.colorInfo;
    const text =
      dueDateState === "danger" ? translate("current_learning.overdue_by") : translate("current_learning.due_in");

    return (
      <View>
        <Text testID={"test_dueDate"} style={{ ...currentLearningListViewStyles.dueDate, color: color }}>
          {`${text} ${moment(dueDate).toNow(true)}`}
        </Text>
      </View>
    );
  };

  const onItemPress = () => {
    if (native) {
      navigateTo({
        navigate: navigation.navigate,
        routeId: itemToRouteMap[itemtype],
        props: { targetId: id, courseGroupType: item.itemtype }
      });
    } else {
      setShowRestriction(true);
    }
  };

  const onClose = () => {
    setShowRestriction(false);
  };

  return (
    <TouchableOpacity onPress={() => onItemPress()} testID={"test_currentLearningListViewItem"}>
      <View style={currentLearningListViewStyles.itemContainer}>
        <View style={currentLearningListViewStyles.itemImage}>
          {imageSrc && imageSrc.length > 0 ? (
            <ImageWrapper url={imageSrc} style={currentLearningListViewStyles.imageWrap} />
          ) : (
            <DefaultImage itemType={itemtype} style={currentLearningListViewStyles.imageWrap} />
          )}
        </View>
        <View style={currentLearningListViewStyles.item}>
          <Text
            style={currentLearningListViewStyles.itemTitle}
            testID={"test_CurrentLearningItem_Title"}
            numberOfLines={2}>
            {fullname}
          </Text>
          <View style={currentLearningListViewStyles.itemSubLine}>
            <Text style={currentLearningListViewStyles.itemLearningTypeLabel} testID={"test_CurrentLearningItem_Type"}>
              {capitalizeFirstLetter(itemtype)}
            </Text>
            {DueDateWidget(duedate, duedateState)}
          </View>
        </View>
        <View style={currentLearningListViewStyles.itemProgress}>
          {progress !== null && (
            <ProgressCircle size={iconSizes.sizeXXL} progress={progress} testID={"test_CurrentLearningItem_Progress"} />
          )}
        </View>
      </View>
      {showRestriction && <NativeAccessRestriction onClose={onClose} urlView={item.urlView} />}
    </TouchableOpacity>
  );
};

const currentLearningListViewStyles = StyleSheet.create({
  itemContainer: {
    height: 100,
    padding: paddings.paddingXL,
    flexDirection: "row"
  },
  itemImage: {
    alignSelf: "center",
    height: 80,
    aspectRatio: 4 / 3,
    borderRadius: borderRadius.borderRadiusM,
    backgroundColor: TotaraTheme.colorNeutral2
  },
  item: {
    flex: 1,
    justifyContent: "center",
    padding: paddings.paddingL,
    flexDirection: "column"
  },
  itemTitle: { ...TotaraTheme.textRegular },
  itemSubLine: {
    marginTop: margins.marginXS,
    flexDirection: "row",
    alignItems: "flex-end"
  },
  itemProgress: {
    alignSelf: "flex-start",
    alignContent: "center"
  },
  imageWrap: {
    flex: 1,
    borderRadius: borderRadius.borderRadiusM
  },
  itemLearningTypeLabel: {
    ...TotaraTheme.textXXSmall,
    alignSelf: "flex-end",
    paddingHorizontal: paddings.paddingL,
    paddingVertical: paddings.paddingXS,
    borderWidth: 1,
    borderRadius: borderRadius.borderRadiusM,
    color: TotaraTheme.colorNeutral7,
    borderColor: TotaraTheme.colorNeutral6
  },
  dueDate: {
    marginLeft: margins.marginS
  }
});

export default CurrentLearningListViewItem;
