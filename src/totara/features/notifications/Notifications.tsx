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

import React, { useContext } from "react";
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
import { NavigationContext } from "react-navigation";
import totaraNavigationOptions from "@totara/components/NavigationOptions";

import { Images } from "@resources/images";
import { translate } from "@totara/locale";
import headerStyles from "@totara/theme/headers";
import listViewStyles from "@totara/theme/listView";
import NetworkStatus from "@totara/components/NetworkStatus";
import { paddings } from "@totara/theme/constants";
import { NotificationMessage } from "@totara/types";
import NotificationItem from "@totara/features/notifications/NotificationItem";
import { TotaraTheme } from "@totara/theme/Theme";
import NotificationDetails from "@totara/features/notifications/NotificationDetail";
import { useQuery } from "@apollo/react-hooks";
import { notificationsQuery, parser } from "@totara/features/notifications/api";
import { NetworkStatus as NS } from "apollo-client/core/networkStatus";
import { Loading, LoadingError } from "@totara/components";

const Notifications = () => {
  const navigation = useContext(NavigationContext);
  const { error, loading, data, refetch, networkStatus } = useQuery(
    notificationsQuery
  );

  const onItemPress = (item: NotificationMessage) => {
    navigation.navigate("NotificationDetail", item);
  };

  const notificationList = !loading ? parser(data) : [];

  return (
    <View style={TotaraTheme.viewContainer}>
      <View style={headerStyles.navigationHeader}>
        <Text style={TotaraTheme.textH2}>
          {translate("notifications.title")}
        </Text>
      </View>
      <NetworkStatus />
      <View style={{ flex: 1 }}>
        {loading && <Loading />}
        {error && <LoadingError onRefreshTap={refetch} />}
        {!loading && !error && notificationList.length == 0 && (
          <View style={styles.noContent}>
            <Image source={Images.notificationBell as ImageSourcePropType} />
            <Text style={[TotaraTheme.textHeadline, { fontWeight: "bold" }]}>
              {translate("notifications.empty")}
            </Text>
          </View>
        )}
        {!loading && !error && notificationList.length > 0 && (
          <FlatList<NotificationMessage>
            refreshing={networkStatus === NS.refetch}
            onRefresh={refetch}
            contentContainerStyle={listViewStyles.contentContainerStyle}
            ItemSeparatorComponent={() => (
              <View style={listViewStyles.itemSeparator} />
            )}
            data={notificationList}
            keyExtractor={(notificationItem) => notificationItem.id}
            renderItem={({ item }) => (
              <NotificationItem
                selectable={false}
                item={item}
                onNotificationItemPress={onItemPress}
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
            <Text style={TotaraTheme.textHeadline}>Cancel</Text>
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
                TotaraTheme.textHeadline,
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
    defaultNavigationOptions: totaraNavigationOptions({})
  }
);

export default NotificationsStack;
