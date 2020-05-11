/**
 * This file is part of Totara Mobile
 *
 * Copyright (C) 2020 onwards Totara Learning Solutions LTD
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @author Rodrigo Mathias <rodrigo.mathias@totaralearning.com
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

type NotificationItem = {
  id: number;
  title: string;
  subtitle: string;
  read: boolean;
  selected?: boolean;
};

const Notifications = ({ navigation }: any) => {
  const [theme] = useContext(ThemeContext);
  const [notificationList, setNotificationList] = useState<NotificationItem[]>(
    []
  );
  const [selectable, setSelectable] = useState(false);
  const [error] = useState(true);

  useEffect(() => {
    setNotificationList(
      Array.from({ length: 0 }, (value, key) => {
        return {
          id: key,
          title: `this is a title ${key}`,
          subtitle: `this is a subtitle ${key}`,
          read: false,
        };
      })
    );
  }, []);

  const onNotificationItemPress = (item: NotificationItem) => {
    //open notification view

    //mark item as read or selected
    if (selectable) {
      item.selected = !item.selected;
    } else item.read = true;

    const idx = notificationList.findIndex((x) => x.id == item.id);
    notificationList[idx] = item;
    setNotificationList([...notificationList]);
  };

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
            flex: 1,
            flexDirection: "row",
            backgroundColor: theme.colorNeutral1,
          }}>
          {selectable && (
            <View
              style={{
                padding: 16,
                display: "flex",
                justifyContent: "center",
              }}>
              <FontAwesomeIcon
                size={32}
                icon={"check-circle"}
                color={item.selected ? theme.colorPrimary : theme.colorNeutral3}
              />
            </View>
          )}
          <View style={{ flex: 2 }}>
            <Text
              style={[
                theme.textH3,
                { padding: 5, fontWeight: item.read ? "normal" : "bold" },
              ]}>
              {item.title}
            </Text>
            <Text
              style={[
                theme.textH4,
                { padding: 5, fontWeight: item.read ? "normal" : "bold" },
              ]}>
              {item.subtitle}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              alignItems: "flex-end",
              justifyContent: "center",
            }}>
            <FontAwesomeIcon
              size={25}
              color={theme.colorNeutral3}
              style={{ padding: 5 }}
              icon={"caret-right"}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const onContentRefreshTap = () => {};

  return (
    <View style={[{ flex: 1 }, theme.viewContainer]}>
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
      <View style={styles.notificationsContainer}>
        <View>
          <View>
            {error && <LoadingError onRefreshTap={onContentRefreshTap} />}
            {!error && notificationList.length == 0 && (
              <View style={styles.noContent}>
                <Image source={Images.notificationBell} />
                <Text style={[theme.textH2, { fontWeight: "bold" }]}>
                  No notifications yet!
                </Text>
              </View>
            )}
            {!error && notificationList.length > 0 && (
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
  notificationsContainer: {
    flex: 1,
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
