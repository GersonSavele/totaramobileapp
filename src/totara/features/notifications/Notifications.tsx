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
} from "react-native";
import { createStackNavigator } from "react-navigation-stack";
import totaraNavigationOptions from "@totara/components/NavigationOptions";
import { ThemeContext } from "@totara/theme";
import { translate } from "@totara/locale";
import headerStyles from "@totara/theme/headers";
import listViewStyles from "@totara/theme/listView";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { NavigationActions } from "react-navigation";
import { Images } from "@resources/images";
import LoadingError from "@totara/components/LoadingError";
import NetworkStatus from "@totara/components/NetworkStatus";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { Spinner } from "native-base";
import { icons, paddings } from "@totara/theme/constants";

type NotificationItem = {
  id: number;
  title: string;
  body: string;
  read: boolean;
  selected?: boolean;
  received: number;
};

const QUERY_NOTIFICATIONS = gql`
  {
    notifications {
      id
      title
      payload
      read
      received
    }
  }
`;

const MUTATION_NOTIFICATION = gql`
  {
    mutation notifications {
      title
      payload
    }
  }
`;

const Notifications = ({ navigation }: any) => {
  const [theme] = useContext(ThemeContext);
  const [notificationList, setNotificationList] = useState<NotificationItem[]>(
    []
  );
  const [selectable, setSelectable] = useState(false);
  const { loading, data, error }  = useQuery(QUERY_NOTIFICATIONS);
  // const [markAsRead, { data : mutationData }] = useMutation(MUTATION_NOTIFICATION);
  
  useEffect(() => {
    const _list = data ? data.notifications : [];
    setNotificationList(
      _list.map(notification=>{
        return {
          id: notification.id,
          title: notification.title,
          body: notification.payload,
          read: notification.read,
          received: notification.received,
          selected: false,
        }
      })
    );
  }, [data]);

  const onNotificationItemPress = (item: NotificationItem) => {
    //open notification view

    //mark item as read or selected
    if (selectable) {
      item.selected = !item.selected;
    } else{
      //mark as read
       markNotificationAsRead(item);
    }

    // const idx = notificationList.findIndex((x) => x.id == item.id);
    // notificationList[idx] = item;
    // setNotificationList([...notificationList]);
  };

  const markNotificationAsRead = (item: NotificationItem)=>{
    item.read = true;
  }

  const onNotificationItemLongPress = (item: NotificationItem) => {
    item.selected = true;
    const idx = notificationList.findIndex((x) => x.id == item.id);
    notificationList[idx] = item;
    setNotificationList([...notificationList]);
    setSelectable(true);
    showActions(true);
  };

  const showActions = (show: boolean) => {
    const setParamsAction = NavigationActions.setParams({
      params: {
        tabBarVisible: false,
        leftAction: show && (
          <TouchableOpacity
            onPress={onSelectAllPress}
            style={{ paddingLeft: 16 }}>
            <Text style={theme.textH3}>Select All</Text>
          </TouchableOpacity>
        ),
        rightAction: show && (
          <TouchableOpacity
            onPress={onCancelPress}
            style={{ paddingRight: 16 }}>
            <Text style={theme.textH3}>Cancel</Text>
          </TouchableOpacity>
        ),
      },
      key: "Notification",
    });
    navigation.dispatch(setParamsAction);
  };

  const onCancelPress = () => {
    setSelectable(false);
    showActions(false);
    selectAll(false);
  };

  const onSelectAllPress = () => {
    selectAll(true);
  };

  const selectAll = (selected: boolean) => {
    const newList = notificationList.map((item) => {
      item.selected = selected;
      return item;
    });

    setNotificationList(Array.from(newList.values()));
  };

  const renderItem = ({ item }: { item: NotificationItem }) => {
    return (
      <TouchableOpacity
        onPress={() => onNotificationItemPress(item)}
        onLongPress={() => onNotificationItemLongPress(item)}>
        <View
          key={item.id}
          style={{
            display: "flex",
            flexDirection: "row",
            backgroundColor: theme.colorNeutral1,
          }}>
          {selectable && (
            <View
              style={styles.itemCircle}>
              <FontAwesomeIcon
                size={icons.sizeL}
                icon={"check-circle"}
                color={item.selected ? theme.colorPrimary : theme.colorNeutral3}
              />
            </View>
          )}
          <View style={{ flex: 2 }}>
            <View style={{justifyContent: "space-between", flexDirection: "row"}}>
              <View>
                <Text
                  style={[
                    theme.textH3,
                    { padding: paddings.paddingM, fontWeight: item.read ? "normal" : "bold" },
                  ]}>
                  {item.title}
                </Text>
              </View>
              <View>
                <Text
                  style={[
                    theme.textB3,
                    { padding: paddings.paddingM, fontWeight: item.read ? "normal" : "bold" },
                  ]}>
                  {item.received}
                </Text>
              </View>
            </View>
            <Text
              style={[
                theme.textH4,
                { padding: paddings.paddingM, fontWeight: item.read ? "normal" : "bold" },
              ]}>
              {item.body}
            </Text>
          </View>
          <View
            style={{
              alignItems: "flex-end",
              justifyContent: "center",
            }}>
            <FontAwesomeIcon
              size={icons.sizeM}
              color={theme.colorNeutral3}
              style={{ padding: paddings.paddingM }}
              icon={"caret-right"}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const onContentRefreshTap = () => {};

  return (
    <View style={theme.viewContainer}>
      <View
        style={[
          headerStyles.navigationHeader,
          { backgroundColor: theme.colorSecondary1 },
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
            {loading && <Spinner/>}
            {error && <LoadingError onRefreshTap={onContentRefreshTap} />}
            {!loading && !error && notificationList.length == 0 && (
              <View style={styles.noContent}>
                <Image source={Images.notificationBell} />
                <Text style={[theme.textH2, { fontWeight: "bold" }]}>
                  No notifications yet!
                </Text>
              </View>
            )}
            {!loading && !error && notificationList.length > 0 && (
              <FlatList<NotificationItem>
                style={{ flexGrow: 1 }}
                contentContainerStyle={listViewStyles.contentContainerStyle}
                ItemSeparatorComponent={() => (
                  <View style={listViewStyles.itemSeparator} />
                )}
                data={notificationList}
                keyExtractor={(notificationItem) =>
                  notificationItem.id.toString()
                }
                renderItem={renderItem}
              />
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemCircle:{
    padding: paddings.marginXL,
    display: "flex",
    justifyContent: "center",
  },
  noContent: {
    height: "100%",
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
});

const NotificationsStack = createStackNavigator(
  {
    Notification: {
      screen: Notifications,
    },
  },
  {
    initialRouteName: "Notification",
    initialRouteKey: "Notification",
    defaultNavigationOptions: ({ screenProps, navigation }: any) =>
      totaraNavigationOptions({
        theme: screenProps.theme,
        rightAction: navigation.getParam("rightAction"),
        leftAction: navigation.getParam("leftAction"),
      }),
  }
);

export default NotificationsStack;
