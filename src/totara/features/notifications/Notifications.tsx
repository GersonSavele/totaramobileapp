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
import totaraNavigationOptions from "@totara/components/NavigationOptions";
import { translate } from "@totara/locale";
import headerStyles from "@totara/theme/headers";
import listViewStyles from "@totara/theme/listView";
import { NavigationActions, NavigationContext } from "react-navigation";
import { Images } from "@resources/images";
import NetworkStatus from "@totara/components/NetworkStatus";
import { useDispatch, useSelector } from "react-redux";
import { paddings } from "@totara/theme/constants";
import { NotificationMessage } from "@totara/types";
import NotificationItem from "@totara/features/notifications/NotificationItem";
import { RootState } from "@totara/reducers";
import { TotaraTheme } from "@totara/theme/Theme";

const Notifications = () => {
  const dispatch = useDispatch();
  const navigation = useContext(NavigationContext);
  const notificationList = useSelector(
    (state: RootState) => state.notificationReducer.notifications
  );

  const [selectable, setSelectable] = useState(false);
  const [selectedList, setSelectedList] = useState<string[]>([]);

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
    if (selectable) toggleSelected(item);

    markNotificationAsRead(item);
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
          {translate("notifications.title")}
        </Text>
      </View>
      <NetworkStatus />
      <View>
        {notificationList.length == 0 && (
          <View style={styles.noContent}>
            <Image source={Images.notificationBell as ImageSourcePropType} />
            <Text style={[TotaraTheme.textH2, { fontWeight: "bold" }]}>
              No notifications yet!
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
        headerLeft: navigation.getParam("showActions") && (
          <TouchableOpacity
            onPress={() => {
              // @ts-ignore
              navigation.emit("onCancelTap");
            }}
            style={{ paddingLeft: paddings.marginXL }}>
            <Text style={TotaraTheme.textH3}>Cancel</Text>
          </TouchableOpacity>
        ),
        headerRight: navigation.getParam("showActions") && (
          <TouchableOpacity
            onPress={() => {
              // @ts-ignore
              navigation.emit("onDeleteTap");
            }}
            style={{ paddingRight: paddings.marginXL }}>
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
