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

import { Images } from '@resources/images';
import NetworkStatusIndicator from '@totara/components/NetworkStatusIndicator';
import { NAVIGATION } from '@totara/lib/navigation';
import ResourceManager from '@totara/lib/resourceManager';
import { translate } from '@totara/locale';
import type { RootState } from '@totara/reducers';
import { paddings } from '@totara/theme/constants';
import headerStyles from '@totara/theme/headers';
import listViewStyles from '@totara/theme/listView';
import { TotaraTheme } from '@totara/theme/Theme';
import type { Resource } from '@totara/types';
import React, { useEffect, useState } from 'react';
import type { ImageSourcePropType, ListRenderItemInfo } from 'react-native';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';

import { useNavigation } from '../../lib/hooks';
import DownloadItem from './DownloadItem';
const { SCORM_ACTIVITY } = NAVIGATION;

const Downloads = () => {
  const resourcesList = useSelector((state: RootState) => state.resourceReducer.resources);
  const navigation = useNavigation('Downloads');

  const [selectable, setSelectable] = useState(false);
  const [selectedList, setSelectedList] = useState<string[]>([]);
  const headerTitle =
    selectable && selectedList.length > 0
      ? translate('downloads.selected', { count: selectedList.length })
      : translate('downloads.title');

  useEffect(() => {
    showOptions(selectable);
  }, [selectable, navigation, selectedList]);

  const showOptions = (show: boolean) => {
    const leftOption = show && (
      <TouchableOpacity onPress={onCancelTap} style={{ paddingLeft: paddings.paddingL }}>
        <Text style={TotaraTheme.textMedium}>{translate('general.cancel')}</Text>
      </TouchableOpacity>
    );

    const rightOption = show && (
      <TouchableOpacity onPress={onDeleteTap} style={{ paddingRight: paddings.paddingL }}>
        <Text style={[TotaraTheme.textMedium, { color: TotaraTheme.colorDestructive }]}>
          {translate('general.delete')}
        </Text>
      </TouchableOpacity>
    );

    navigation.setOptions({
      headerLeft: () => leftOption,
      headerRight: () => rightOption
    });
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
      navigation.navigate(SCORM_ACTIVITY, {
        id: item.customId,
        title: item.name
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
    const exists = selectedList.some(x => x === item.id);
    if (!exists) setSelectedList([...selectedList, item.id]);
    else {
      setSelectedList([...selectedList.filter(x => x !== item.id)]);
    }
  };
  //ACTIONS

  const isSelected = (item: Resource) => {
    return selectedList.some(x => x === item.id);
  };

  return (
    <View style={TotaraTheme.viewContainer} testID={'downloadsContainer'}>
      <View style={[headerStyles.navigationHeader, { flexDirection: 'row' }]}>
        <Text style={TotaraTheme.textH2}>{headerTitle}</Text>
      </View>
      <NetworkStatusIndicator />
      <View style={{ flex: 1 }}>
        {resourcesList.length == 0 ? (
          <View style={listViewStyles.noContent} testID={'test_DownloadsEmptyState'}>
            <Image source={Images.noDownloads as ImageSourcePropType} />
            <Text style={[TotaraTheme.textHeadline, listViewStyles.noContentTitle]}>
              {translate('downloads.empty')}
            </Text>
          </View>
        ) : (
          <FlatList
            contentContainerStyle={listViewStyles.contentContainerStyle}
            data={resourcesList}
            keyExtractor={resourceItem => resourceItem.id}
            ItemSeparatorComponent={() => <View style={listViewStyles.itemSeparator} />}
            renderItem={(data: ListRenderItemInfo<Resource>) => (
              <DownloadItem
                testID={'test_DownloadsItem'}
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

export default Downloads;
