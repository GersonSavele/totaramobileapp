/**
 *
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
 *
 */

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, FlatList, ImageSourcePropType, ScrollView, RefreshControl } from "react-native";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { NetworkStatus as NS } from "apollo-client/core/networkStatus";
import { NavigationStackProp } from "react-navigation-stack";

import { Images } from "@resources/images";
import { translate } from "@totara/locale";
import headerStyles from "@totara/theme/headers";
import listViewStyles from "@totara/theme/listView";
import NetworkStatus from "@totara/components/NetworkStatus";
import { NotificationMessage } from "@totara/types";
import NotificationItem from "@totara/features/notifications/NotificationItem";
import { TotaraTheme } from "@totara/theme/Theme";
import { Loading, LoadingError } from "@totara/components";
import { notificationQueryMarkRead, notificationsQuery, parser } from "@totara/features/notifications/api";
import { NavigationActions } from "react-navigation";

type NotificationsProps = {
  navigation: NavigationStackProp<NotificationMessage>;
};

const Notifications = ({ navigation }: NotificationsProps) => {
  const { error, loading, data, refetch, networkStatus } = useQuery(notificationsQuery);
  const [mutationMarkAsRead] = useMutation(notificationQueryMarkRead);
  const notificationList = !loading && !error ? parser(data) : ([] as NotificationMessage[]);
  const [selectedList, setSelectedList] = useState<string[]>([]);
  const [selectable, setSelectable] = useState(false);
  const headerTitle =
    selectable && selectedList.length > 0
      ? translate("notifications.selected", { count: selectedList.length })
      : translate("notifications.title");

  //EVENTS
  useEffect(() => {
    headerDispatch(selectable);
  }, [selectable]);

  useEffect(() => {
    const onCancelTapListener = navigation.addListener("onCancelTap", onCancelTap);
    const onMarkAsRead = navigation.addListener("onMarkAsRead", markAsReadAllSelected);
    return () => {
      onCancelTapListener.remove();
      onMarkAsRead.remove();
    };
  });

  const headerDispatch = (showActions: boolean) => {
    const setParamsAction = NavigationActions.setParams({
      params: {
        showActions: showActions
      },
      key: "Notification"
    });
    navigation.dispatch(setParamsAction);
  };

  const onCancelTap = () => {
    unSelectAll();
    setSelectable(false);
  };

  const unSelectAll = () => {
    setSelectedList([]);
  };

  const onItemPress = (item: NotificationMessage) => {
    if (selectable) {
      toggleSelected(item);
      return;
    }

    if (!item.isRead) markAsRead([item.id]);

    navigation.navigate("NotificationDetail", item);
  };

  const onItemLongPress = (item: NotificationMessage) => {
    if (!selectable) {
      setSelectable(true);
    }
    toggleSelected(item);
  };

  const toggleSelected = (item: NotificationMessage) => {
    const exists = selectedList.some((x) => x === item.id);
    if (!exists) setSelectedList([...selectedList, item.id]);
    else {
      setSelectedList([...selectedList.filter((x) => x !== item.id)]);
    }
  };

  const markAsReadAllSelected = () => {
    const toMarkAsReadList = (notificationList as NotificationMessage[]).filter(
      (x) => !x.isRead && selectedList.find((y) => y === x.id)
    );
    markAsRead(toMarkAsReadList.map((x) => x.id));
    unSelectAll();
    setSelectable(false);
  };

  const markAsRead = (messageIds: string[]) => {
    if (messageIds.length === 0) return;

    mutationMarkAsRead({
      variables: {
        input: {
          message_ids: messageIds
        }
      }
    }).then((result) => {
      if (!result.errors) {
        refetch();
      }
    });
  };

  const isSelected = (item: NotificationMessage) => {
    return selectedList.some((x) => x === item.id);
  };

  return (
    <View style={TotaraTheme.viewContainer}>
      <View style={headerStyles.navigationHeader}>
        <Text style={TotaraTheme.textH2}>{headerTitle}</Text>
      </View>
      <NetworkStatus />
      <View style={{ flex: 1 }}>
        {loading && <Loading testID={"test_loading"} />}
        {error && <LoadingError onRefreshTap={refetch} testID={"test_loadingError"} />}
        {!loading && !error && notificationList.length == 0 && (
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center"
            }}
            refreshControl={<RefreshControl refreshing={networkStatus === NS.refetch} onRefresh={refetch} />}
            testID={"test_notificationsEmptyContainer"}>
            <View style={styles.noContent}>
              <Image source={Images.noNotifications as ImageSourcePropType} />
              <Text style={[TotaraTheme.textHeadline, { fontWeight: "bold" }]}>{translate("notifications.empty")}</Text>
            </View>
          </ScrollView>
        )}
        {!loading && !error && notificationList.length > 0 && (
          <FlatList<NotificationMessage>
            testID={"test_notificationsList"}
            refreshing={networkStatus === NS.refetch}
            onRefresh={refetch}
            contentContainerStyle={listViewStyles.contentContainerStyle}
            ItemSeparatorComponent={() => <View style={listViewStyles.itemSeparator} />}
            data={notificationList}
            keyExtractor={(notificationItem) => notificationItem.id}
            renderItem={({ item }) => (
              <NotificationItem
                testID={`test_notificationItem`}
                selectable={selectable}
                selected={isSelected(item)}
                item={item}
                onNotificationItemPress={onItemPress}
                onNotificationItemLongPress={onItemLongPress}
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

export default Notifications;
