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
import { View, FlatList, StyleSheet, RefreshControl } from "react-native";
import { NavigationStackProp } from "react-navigation-stack";
import CurrentLearningListViewItem from "@totara/features/currentLearning/learningItems/CurrentLearningListViewItem";
import listViewStyles from "@totara/theme/listView";

type CurrentLearningListViewProps = {
  navigation: NavigationStackProp;
  currentLearning?: any;
  loading: boolean;
  onRefresh: () => void;
};

const CurrentLearningListView = ({ currentLearning, loading, onRefresh, navigation }: CurrentLearningListViewProps) => {
  const renderItem = (data) => {
    return <CurrentLearningListViewItem item={data.item} navigation={navigation} />;
  };

  return (
    <View style={currentLearningListViewStyles.container}>
      <FlatList
        ItemSeparatorComponent={() => <View style={listViewStyles.itemSeparator} />}
        testID={"test_currentLearningListView"}
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
  }
});

export default CurrentLearningListView;
