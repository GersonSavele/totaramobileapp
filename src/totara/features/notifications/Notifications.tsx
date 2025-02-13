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

import { NetworkStatus, useMutation, useQuery } from '@apollo/client';
import type { StackScreenProps } from '@react-navigation/stack';
import { Images } from '@resources/images';
import { Loading, MessageBar } from '@totara/components';
import NetworkStatusIndicator from '@totara/components/NetworkStatusIndicator';
import { notificationQueryMarkRead, notificationsQuery, parser } from '@totara/features/notifications/api';
import NotificationItem from '@totara/features/notifications/NotificationItem';
import { translate } from '@totara/locale';
import { paddings } from '@totara/theme/constants';
import headerStyles from '@totara/theme/headers';
import listViewStyles from '@totara/theme/listView';
import { TotaraTheme } from '@totara/theme/Theme';
import type { NotificationMessage } from '@totara/types';
import React, { useEffect, useState } from 'react';
import type { ImageSourcePropType } from 'react-native';
import { FlatList, Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { TEST_IDS } from '../../lib/testIds';

const Notifications = ({ navigation }: StackScreenProps<any>) => {
  const { error, networkStatus, data, refetch } = useQuery(notificationsQuery, { notifyOnNetworkStatusChange: true });
  const [mutationMarkAsRead] = useMutation(notificationQueryMarkRead);

  const notificationList = parser(data);
  const [, setLastRefresh] = useState(Date.now());
  const [selectedList, setSelectedList] = useState<string[]>([]);
  const [selectable, setSelectable] = useState(false);
  const headerTitle =
    selectable && selectedList.length > 0
      ? translate('notifications.selected', { count: selectedList.length })
      : translate('notifications.title');

  //EVENTS
  useEffect(() => {
    showOptions(selectable);
  }, [navigation, selectable, selectedList]);

  const showOptions = (show: boolean) => {
    const leftOption = show && (
      <TouchableOpacity testID={'test_cancel'} onPress={onCancelTap} style={{ paddingLeft: paddings.paddingL }}>
        <Text style={TotaraTheme.textMedium}> {translate('general.cancel')}</Text>
      </TouchableOpacity>
    );

    const rightOption = show && (
      <TouchableOpacity
        testID={'test_markAsRead'}
        onPress={markAsReadAllSelected}
        style={{ paddingRight: paddings.paddingL }}>
        <Text style={[TotaraTheme.textMedium, { color: TotaraTheme.colorLink }]}>
          {translate('notifications.mark_as_read')}
        </Text>
      </TouchableOpacity>
    );

    navigation.setOptions({
      headerLeft: () => leftOption,
      headerRight: () => rightOption
    });
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

    navigation.navigate('NotificationDetail', item);
  };

  const onItemLongPress = (item: NotificationMessage) => {
    if (!selectable) {
      setSelectable(true);
    }
    toggleSelected(item);
  };

  const toggleSelected = (item: NotificationMessage) => {
    const exists = selectedList.some(x => x === item.id);
    if (!exists) setSelectedList([...selectedList, item.id]);
    else {
      setSelectedList([...selectedList.filter(x => x !== item.id)]);
    }
  };

  const markAsReadAllSelected = () => {
    const toMarkAsReadList = (notificationList as NotificationMessage[]).filter(
      x => !x.isRead && selectedList.find(y => y === x.id)
    );
    markAsRead(toMarkAsReadList.map(x => x.id));
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
    }).then(result => {
      if (!result.errors) {
        refetch();
      }
    });
  };

  const isSelected = (item: NotificationMessage) => {
    return selectedList.some(x => x === item.id);
  };

  const onRefresh = () => {
    if (refetch) {
      refetch().finally(() => setLastRefresh(Date.now()));
    }
  };

  return (
    <View style={TotaraTheme.viewContainer}>
      <View style={headerStyles.navigationHeader}>
        <Text style={TotaraTheme.textH2}>{headerTitle}</Text>
      </View>
      <NetworkStatusIndicator />
      {error && (
        <MessageBar
          mode={'alert'}
          text={translate('general.error_unknown')}
          icon={'exclamation-circle'}
          testID={TEST_IDS.MESSAGE_ERROR_ID}
        />
      )}
      <View style={{ flex: 1 }}>
        {networkStatus === NetworkStatus.loading && <Loading testID={'test_loading'} />}
        {notificationList.length == 0 && (
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center'
            }}
            refreshControl={<RefreshControl refreshing={networkStatus === NetworkStatus.refetch} onRefresh={refetch} />}
            testID={'test_notificationsEmptyContainer'}>
            <View style={listViewStyles.noContent}>
              <Image source={Images.noNotifications as ImageSourcePropType} />
              <Text style={[TotaraTheme.textHeadline, listViewStyles.noContentTitle]}>
                {translate('notifications.empty')}
              </Text>
            </View>
          </ScrollView>
        )}
        {notificationList.length > 0 && (
          <FlatList<NotificationMessage>
            testID={'test_notificationsList'}
            refreshing={networkStatus === NetworkStatus.refetch}
            onRefresh={onRefresh}
            contentContainerStyle={listViewStyles.contentContainerStyle}
            ItemSeparatorComponent={() => <View style={listViewStyles.itemSeparator} />}
            data={notificationList}
            keyExtractor={notificationItem => notificationItem.id}
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

export default Notifications;
