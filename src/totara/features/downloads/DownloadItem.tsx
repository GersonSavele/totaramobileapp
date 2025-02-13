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

import { TouchableIcon } from '@totara/components';
import Icon from '@totara/components/Icon';
import ResourceDownloader from '@totara/components/ResourceDownloader';
import { humanReadablePercentage } from '@totara/lib/tools';
import { translate } from '@totara/locale';
import { ThemeContext } from '@totara/theme';
import { iconSizes, paddings } from '@totara/theme/constants';
import listViewStyles from '@totara/theme/listView';
import { TotaraTheme } from '@totara/theme/Theme';
import type { Resource } from '@totara/types/Resource';
import { ResourceState } from '@totara/types/Resource';
import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type DownloadItemProps = {
  item: Resource;
  selectable: boolean;
  selected: boolean;
  onItemPress(item: Resource): void;
  onItemLongPress(item: Resource): void;
  testID?: string;
};

const DownloadItem = ({
  item,
  selectable,
  selected = false,
  onItemPress,
  onItemLongPress,
  testID
}: DownloadItemProps) => {
  const theme = useContext(ThemeContext);

  const humanReadableSize = (sizeInBytes: number) => {
    if (!sizeInBytes) return '...';

    return sizeInBytes / 1024 < 1000
      ? `${Math.round(sizeInBytes / 1024)}KB`
      : `${(sizeInBytes / 1024 / 1024).toFixed(2)}MB`;
  };

  const { bytesDownloaded: writtenBytes, sizeInBytes } = item;

  return (
    <TouchableOpacity
      accessibilityHint={translate('downloads.tap_to_launch_hint')}
      testID={testID}
      onPress={() => onItemPress(item)}
      onLongPress={() => onItemLongPress(item)}>
      <View key={item.id} style={listViewStyles.rowItem} testID={'test_DownloadItemItemID'}>
        {selectable && (
          <View style={styles.itemCircle} testID={'test_DownloadItemSelectIcon'}>
            <Icon
              name="check-circle"
              color={selected ? theme.colorLink : TotaraTheme.colorNeutral3}
              size={iconSizes.sizeM}
            />
          </View>
        )}
        <View>
          {item.state !== ResourceState.Completed && (
            <ResourceDownloader
              testID={'test_DownloadItemResourceDownloader'}
              size={iconSizes.sizeM}
              progress={humanReadablePercentage({
                writtenBytes,
                sizeInBytes
              })}
              resourceState={item.state}
            />
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title} testID={'test_DownloadItemName'}>
            {`${item.name}`}
          </Text>
          <Text style={styles.size} testID={'test_DownloadItemSize'}>{`${humanReadableSize(item.sizeInBytes)}`}</Text>
        </View>
        <View
          style={{
            justifyContent: 'flex-end'
          }}>
          <TouchableIcon size={iconSizes.sizeM} color={TotaraTheme.colorNeutral3} icon={'angle-right'} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  title: {
    ...TotaraTheme.textRegular,
    padding: paddings.paddingM
  },
  size: {
    ...TotaraTheme.textSmall,
    color: TotaraTheme.colorNeutral6,
    paddingLeft: paddings.paddingM
  },
  itemCircle: {
    alignSelf: 'center',
    padding: paddings.paddingXL,
    justifyContent: 'center'
  }
});

export default DownloadItem;
