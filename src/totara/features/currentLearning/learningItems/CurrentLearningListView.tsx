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

import React from "react";
import { View, Text, FlatList, StyleSheet, RefreshControl } from "react-native";
import { borderRadius, margins, paddings } from "@totara/theme/constants";
import { TotaraTheme } from "@totara/theme/Theme";
import { ProgressCircle } from "@totara/components";
import { capitalizeFirstLetter } from "@totara/lib/tools";
import moment from "moment";
import { DATE_FORMAT } from "@totara/lib/constants";
import { translate } from "@totara/locale";

type CurrentLearningListViewProps = {
  currentLearning?: any;
  loading: boolean;
  onRefresh: () => void;
};

const ListViewItem = (item) => {
  const { shortname, progress, itemtype, duedate, duedateState } = item;

  const DueDateWidget = (dueDate, dueDateState) => {
    if (!dueDate) return <View testID={"test_noDueDate"} />;

    console.log(dueDateState);
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

  return (
    <View style={currentLearningListViewStyles.itemContainer}>
      <View style={currentLearningListViewStyles.itemImage} />
      <View style={currentLearningListViewStyles.item}>
        <Text style={currentLearningListViewStyles.itemTitle}>{shortname}</Text>
        <View style={currentLearningListViewStyles.itemSubLine}>
          <Text style={currentLearningListViewStyles.itemLearningTypeLabel}>{capitalizeFirstLetter(itemtype)}</Text>
          {DueDateWidget(duedate, duedateState)}
        </View>
      </View>
      <View style={currentLearningListViewStyles.itemProgress}>
        <ProgressCircle size={50} progress={progress} />
      </View>
    </View>
  );
};

const CurrentLearningListView = ({ currentLearning, loading, onRefresh }: CurrentLearningListViewProps) => {
  const renderItem = (data) => {
    return ListViewItem(data.item);
  };

  return (
    <View style={currentLearningListViewStyles.container}>
      <FlatList
        data={currentLearning}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
      />
    </View>
  );
};

const currentLearningListViewStyles = StyleSheet.create({
  container: {
    flex: 1
  },
  itemContainer: {
    height: 100,
    padding: paddings.paddingXL,
    flexDirection: "row"
  },
  itemImage: {
    height: 80,
    aspectRatio: 4 / 3,
    borderRadius: borderRadius.borderRadiusM,
    backgroundColor: TotaraTheme.colorNeutral2
  },
  item: {
    flex: 1,
    padding: paddings.paddingL,
    justifyContent: "space-between",
    flexDirection: "column"
  },
  itemTitle: { ...TotaraTheme.textRegular },
  itemSubLine: {
    marginTop: margins.marginXS,
    flexDirection: "row",
    alignItems: "flex-end"
  },
  itemProgress: {
    alignSelf: "center"
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

export default CurrentLearningListView;
