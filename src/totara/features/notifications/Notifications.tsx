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

import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ImageSourcePropType
} from "react-native";
import { createStackNavigator } from "react-navigation-stack";
import { NavigationActions, NavigationContext } from "react-navigation";
import totaraNavigationOptions from "@totara/components/NavigationOptions";
import { useDispatch, useSelector } from "react-redux";

import { Images } from "@resources/images";
import { translate } from "@totara/locale";
import headerStyles from "@totara/theme/headers";
import listViewStyles from "@totara/theme/listView";
import NetworkStatus from "@totara/components/NetworkStatus";
import { paddings } from "@totara/theme/constants";
import { NotificationMessage } from "@totara/types";
import NotificationItem from "@totara/features/notifications/NotificationItem";
import { RootState } from "@totara/reducers";
import { TotaraTheme } from "@totara/theme/Theme";
import NotificationDetails from "@totara/features/notifications/NotificationDetail";

const Notifications = () => {
  const dispatch = useDispatch();
  const navigation = useContext(NavigationContext);
  const notificationList = useSelector(
    (state: RootState) => state.notificationReducer.notifications
  );

  const [selectable, setSelectable] = useState(false);
  const [selectedList, setSelectedList] = useState<string[]>([]);
  const headerTitle =
    selectable && selectedList.length > 0
      ? translate("notifications.selected", { count: selectedList.length })
      : translate("notifications.title");

  useEffect(() => {
    const onCancelTapListener = navigation.addListener(
      "onCancelTap",
      onCancelTap
    );
    const onDeleteTapListener = navigation.addListener(
      "onDeleteTap",
      onDeleteTap
    );
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
      key: "Notification"
    });
    navigation.dispatch(setParamsAction);
  };

  const onCancelTap = () => {
    unSelectAll();
    setSelectable(false);
  };

  const onDeleteTap = () => {
    if (selectedList.length === 0) return;
    dispatch({ type: "DELETE_NOTIFICATION", payload: selectedList });
    setSelectable(false);
  };

  const unSelectAll = () => {
    setSelectedList([]);
  };

  const onItemLongPress = (item: NotificationMessage) => {
    if (!selectable) {
      setSelectable(true);
    }
    toggleSelected(item);
  };

  const onItemPress = (item: NotificationMessage) => {
    if (selectable) {
      toggleSelected(item);
      return;
    }

    markNotificationAsRead(item);

    const mock = {
      id: 123,
      title: "Content Marketplaces now avilable in Totara",
      received: "18 days 13 hours ago",
      body:
        "Totara learn now supports content marketplaces, allowing you to browse and import external content into your Totara site.",
      action: {
        title: "Setup Content Marketplaces",
        link: "https://www.google.com"
      }
    };

    navigation.navigate("NotificationDetail", mock);
  };

  const markNotificationAsRead = (item: NotificationMessage) => {
    dispatch({ type: "READ_NOTIFICATION", payload: item.id });
  };

  const toggleSelected = (item: NotificationMessage) => {
    const add = !selectedList.find((selected: string) => selected === item.id);
    if (add) {
      setSelectedList([...selectedList, item.id]);
    } else {
      //REMOVE
      const newSelectedList = selectedList.filter(
        (selected) => selected !== item.id
      );
      setSelectedList(newSelectedList);
    }
  };

  const isSelected = (item: NotificationMessage) => {
    return selectedList.some((x) => x === item.id);
  };

  return (
    <View style={TotaraTheme.viewContainer}>
      <View style={headerStyles.navigationHeader}>
        <Text
          style={[
            TotaraTheme.textH1,
            { color: TotaraTheme.navigationHeaderTintColor }
          ]}>
          {headerTitle}
        </Text>
      </View>
      <NetworkStatus />
      <View style={{ flex: 1 }}>
        {notificationList.length == 0 && (
          <View style={styles.noContent}>
            <Image source={Images.notificationBell as ImageSourcePropType} />
            <Text style={[TotaraTheme.textH2, { fontWeight: "bold" }]}>
              {translate("notifications.empty")}
            </Text>
          </View>
        )}
        {notificationList.length > 0 && (
          <FlatList<NotificationMessage>
            contentContainerStyle={listViewStyles.contentContainerStyle}
            ItemSeparatorComponent={() => (
              <View style={listViewStyles.itemSeparator} />
            )}
            data={notificationList}
            keyExtractor={(notificationItem) => notificationItem.id}
            renderItem={({ item }) => (
              <NotificationItem
                item={item}
                selectable={selectable}
                selected={isSelected(item)}
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

const NotificationsStack = createStackNavigator(
  {
    Notification: {
      screen: Notifications,
      navigationOptions: ({ navigation }) => ({
        headerBackTitle: translate("general.back"),
        headerLeft: navigation.getParam("showActions") && (
          <TouchableOpacity
            onPress={() => {
              // @ts-ignore
              navigation.emit("onCancelTap");
            }}
            style={{ paddingLeft: paddings.paddingL }}>
            <Text style={TotaraTheme.textH3}>Cancel</Text>
          </TouchableOpacity>
        ),
        headerRight: navigation.getParam("showActions") && (
          <TouchableOpacity
            onPress={() => {
              // @ts-ignore
              navigation.emit("onDeleteTap");
            }}
            style={{ paddingRight: paddings.paddingL }}>
            <Text
              style={[
                TotaraTheme.textH3,
                { color: TotaraTheme.colorDestructive }
              ]}>
              Delete
            </Text>
          </TouchableOpacity>
        )
      })
    },
    NotificationDetail: {
      screen: NotificationDetails
    }
  },
  {
    initialRouteName: "Notification",
    initialRouteKey: "Notification",
    defaultNavigationOptions: ({ screenProps }: any) =>
      totaraNavigationOptions({
        theme: screenProps.theme
      })
  }
);

export default NotificationsStack;
