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

import React, { useEffect, useState } from "react";
import { FlatList, Image, ImageSourcePropType, ListRenderItemInfo, StyleSheet, Text, View } from "react-native";
import { NavigationActions } from "react-navigation";
import { useSelector } from "react-redux";
import headerStyles from "@totara/theme/headers";
import { translate } from "@totara/locale";
import NetworkStatus from "@totara/components/NetworkStatus";
import { RootState } from "@totara/reducers";
import { Resource } from "@totara/types";

import { Images } from "@resources/images";
import ResourceManager from "@totara/lib/resourceManager";
import listViewStyles from "@totara/theme/listView";
import { navigateTo, NAVIGATION } from "@totara/lib/navigation";
import { TotaraTheme } from "@totara/theme/Theme";
import DownloadItem from "./DownloadItem";
import { NavigationStackProp } from "react-navigation-stack";
const { SCORM_ROOT } = NAVIGATION;

type DownloadsProps = {
  navigation: NavigationStackProp;
};

const Downloads = ({ navigation }: DownloadsProps) => {
  const resourcesList = useSelector((state: RootState) => state.resourceReducer.resources);

  const [selectable, setSelectable] = useState(false);
  const [selectedList, setSelectedList] = useState<string[]>([]);
  const headerTitle =
    selectable && selectedList.length > 0
      ? translate("downloads.selected", { count: selectedList.length })
      : translate("downloads.title");

  useEffect(() => {
    const onCancelTapListener = navigation.addListener("onCancelTap", onCancelTap);
    const onDeleteTapListener = navigation.addListener("onDeleteTap", onDeleteTap);
    return () => {
      onCancelTapListener.remove();
      onDeleteTapListener.remove();
    };
  });

  useEffect(() => {
    headerDispatch(selectable);
  }, [selectable]);

  const headerDispatch = (showActions: boolean) => {
    const setParamsAction = NavigationActions.setParams({
      params: {
        showActions: showActions
      },
      key: "Downloads"
    });
    navigation.dispatch(setParamsAction);
  };

  //EVENTS
  const onItemLongPress = (item: Resource) => {
    if (!selectable) {
      setSelectable(true);
    }
    toggleSelected(item);
  };

  const onItemPress = (item: Resource) => {
    toggleSelected(item);

    if (!selectable) {
      navigateTo({
        navigate: navigation.navigate,
        routeId: SCORM_ROOT,
        props: {
          id: item.customId,
          title: item.name
        }
      });
    }
  };

  const onCancelTap = () => {
    unSelectAll();
    setSelectable(false);
  };

  const onDeleteTap = () => {
    ResourceManager.deleteResource(selectedList).finally(() => {
      unSelectAll();
      setSelectable(false);
    });
  };
  //EVENTS

  //ACTIONS
  const unSelectAll = () => {
    setSelectedList([]);
  };

  const toggleSelected = (item: Resource) => {
    const exists = selectedList.some((x) => x === item.id);
    if (!exists) setSelectedList([...selectedList, item.id]);
    else {
      setSelectedList([...selectedList.filter((x) => x !== item.id)]);
    }
  };
  //ACTIONS

  const isSelected = (item: Resource) => {
    return selectedList.some((x) => x === item.id);
  };

  return (
    <View style={TotaraTheme.viewContainer}>
      <View style={[headerStyles.navigationHeader, { flexDirection: "row" }]}>
        <Text style={TotaraTheme.textH2}>{headerTitle}</Text>
      </View>
      <NetworkStatus />
      <View style={{ flex: 1 }}>
        {resourcesList.length == 0 ? (
          <View style={styles.noContent} testID={"test_DownloadsEmptyState"}>
            <Image source={Images.noDownloads as ImageSourcePropType} />
            <Text style={[TotaraTheme.textHeadline, { fontWeight: "bold" }]}>{translate("downloads.empty")}</Text>
          </View>
        ) : (
          <FlatList
            contentContainerStyle={listViewStyles.contentContainerStyle}
            data={resourcesList}
            keyExtractor={(resourceItem) => resourceItem.id}
            ItemSeparatorComponent={() => <View style={listViewStyles.itemSeparator} />}
            renderItem={(data: ListRenderItemInfo<Resource>) => (
              <DownloadItem
                testID={"test_DownloadsItem"}
                item={data.item}
                selected={isSelected(data.item)}
                selectable={selectable}
                onItemPress={onItemPress}
                onItemLongPress={onItemLongPress}
              />
            )}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  noContent: {
    height: "100%",
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }
});

export default Downloads;
