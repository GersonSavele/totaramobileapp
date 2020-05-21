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

import React, { useContext, useState } from "react";
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
import { ThemeContext } from "@totara/theme";
import { translate } from "@totara/locale";
import headerStyles from "@totara/theme/headers";
import listViewStyles from "@totara/theme/listView";
import { NavigationActions } from "react-navigation";
import { Images } from "@resources/images";
import NetworkStatus from "@totara/components/NetworkStatus";
import { useDispatch, useSelector } from "react-redux";
import { paddings } from "@totara/theme/constants";
import { NotificationMessage } from "@totara/types";
import NotificationItem from "@totara/features/notifications/NotificationItem";
import { RootState } from "@totara/reducers";

const Notifications = ({ navigation }: any) => {
  const [theme] = useContext(ThemeContext);
  const [selectable, setSelectable] = useState(false);
  const notificationList = useSelector(
    (state: RootState) => state.notificationReducer.notifications
  );
  const dispatch = useDispatch();
  const [selectedList, setSelectedList] = useState<string[]>([]);

  const onNotificationItemPress = (item: NotificationMessage) => {
    //open notification view
    if (selectable) {
      toggleSelected(item);
    } else {
      markNotificationAsRead(item);
    }
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

  const toggleAllUnselected = () => {
    setSelectedList([]);
  };

  const markNotificationAsRead = (item: NotificationMessage) => {
    dispatch({ type: "READ_NOTIFICATION", payload: item.id });
  };

  const onNotificationItemLongPress = (item: NotificationMessage) => {
    setSelectable(true);
    toggleSelected(item);
    showActions(true);
  };

  const showActions = (show: boolean) => {
    const setParamsAction = NavigationActions.setParams({
      params: {
        leftAction: show && (
          <TouchableOpacity
            onPress={onDelete}
            style={{ paddingLeft: paddings.marginXL }}>
            <Text style={theme.textH3}>Delete</Text>
          </TouchableOpacity>
        ),
        rightAction: show && (
          <TouchableOpacity
            onPress={onCancelPress}
            style={{ paddingRight: 16 }}>
            <Text style={theme.textH3}>Cancel</Text>
          </TouchableOpacity>
        )
      },
      key: "Notification"
    });
    navigation.dispatch(setParamsAction);
  };

  const onCancelPress = () => {
    toggleAllUnselected();
    setSelectable(false);
    showActions(false);
  };

  const onDelete = () => {
    const selected = selectedList;
    dispatch({ type: "DELETE_NOTIFICATION", payload: selected });
  };

  const isSelected = (item: NotificationMessage) => {
    return selectedList.some((selected: string) => selected === item.id);
  };

  return (
    <View style={theme.viewContainer}>
      <View
        style={[
          headerStyles.navigationHeader,
          { backgroundColor: theme.colorSecondary1 }
        ]}>
        <Text
          style={[theme.textH1, { color: theme.navigationHeaderTintColor }]}>
          {translate("notifications.action_primary")}
        </Text>
      </View>
      <NetworkStatus />
      <View>
        <View>
          <View>
            {notificationList.length == 0 && (
              <View style={styles.noContent}>
                <Image
                  source={Images.notificationBell as ImageSourcePropType}
                />
                <Text style={[theme.textH2, { fontWeight: "bold" }]}>
                  No notifications yet!
                </Text>
              </View>
            )}
            {notificationList.length > 0 && (
              <FlatList<NotificationMessage>
                style={{ flexGrow: 1 }}
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
                    onNotificationItemPress={onNotificationItemPress}
                    onNotificationItemLongPress={onNotificationItemLongPress}
                  />
                )}
              />
            )}
          </View>
        </View>
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
      screen: Notifications
    }
  },
  {
    initialRouteName: "Notification",
    initialRouteKey: "Notification",
    defaultNavigationOptions: ({ screenProps, navigation }: any) =>
      totaraNavigationOptions({
        theme: screenProps.theme,
        rightAction: navigation.getParam("rightAction"),
        leftAction: navigation.getParam("leftAction")
      })
  }
);

export default NotificationsStack;
