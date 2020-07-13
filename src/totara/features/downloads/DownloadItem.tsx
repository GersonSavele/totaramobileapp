import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import React, { useContext } from "react";
import { ThemeContext } from "@totara/theme";
import ResourceDownloader from "@totara/components/ResourceDownloader";
import { TouchableIcon } from "@totara/components";
import { iconSizes, paddings } from "@totara/theme/constants";
import { Resource, ResourceState } from "@totara/types/Resource";
import { TotaraTheme } from "@totara/theme/Theme";
import { humanReadablePercentage } from "@totara/lib/tools";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import listViewStyles from "@totara/theme/listView";

type DownloadItemProps = {
  item: Resource;
  selectable: boolean;
  selected: boolean;
  onItemPress(item: Resource): void;
  onItemLongPress(item: Resource): void;
};

const DownloadItem = ({
  item,
  selectable,
  selected = false,
  onItemPress,
  onItemLongPress
}: DownloadItemProps) => {
  const [theme] = useContext(ThemeContext);

  const humanReadableSize = (sizeInBytes: number) => {
    if (!sizeInBytes) return "...";

    return sizeInBytes / 1024 < 1000
      ? `${Math.round(sizeInBytes / 1024)}KB`
      : `${(sizeInBytes / 1024 / 1024).toFixed(2)}MB`;
  };

  const { bytesDownloaded: writtenBytes, sizeInBytes } = item;

  return (
    <TouchableOpacity
      testID={"test_DownloadItem"}
      onPress={() => onItemPress(item)}
      onLongPress={() => onItemLongPress(item)}>
      <View
        key={item.id}
        style={listViewStyles.rowItem}
        testID={"test_DownloadItemItemID"}>
        {selectable && (
          <View
            style={styles.itemCircle}
            testID={"test_DownloadItemSelectIcon"}>
            <FontAwesomeIcon
              size={iconSizes.sizeM}
              icon={"check-circle"}
              color={selected ? theme.colorLink : TotaraTheme.colorNeutral3}
            />
          </View>
        )}
        <View>
          {item.state !== ResourceState.Completed && (
            <ResourceDownloader
              testID={"test_DownloadItemResourceDownloader"}
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
          <Text style={styles.title} testID={"test_DownloadItemName"}>
            {`${item.name}`}
          </Text>
          <Text
            style={styles.size}
            testID={"test_DownloadItemSize"}>{`${humanReadableSize(
            item.sizeInBytes
          )}`}</Text>
        </View>
        <View
          style={{
            justifyContent: "flex-end"
          }}>
          <TouchableIcon
            size={iconSizes.sizeM}
            color={TotaraTheme.colorNeutral3}
            icon={"angle-right"}
          />
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
    alignSelf: "center",
    padding: paddings.paddingXL,
    justifyContent: "center"
  }
});

export default DownloadItem;
