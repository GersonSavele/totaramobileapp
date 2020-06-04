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

import { NotificationMessage } from "@totara/types";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons, paddings } from "@totara/theme/constants";
import React, { useContext } from "react";
import { ThemeContext } from "@totara/theme";
import { TotaraTheme } from "@totara/theme/Theme";

type NotificationItemProps = {
  item: NotificationMessage;
  selectable: boolean;
  selected: boolean;
  onNotificationItemPress(item: NotificationMessage): void;
  onNotificationItemLongPress(item: NotificationMessage): void;
};

const NotificationItem = ({
  item,
  onNotificationItemPress,
  onNotificationItemLongPress,
  selectable,
  selected
}: NotificationItemProps) => {
  const [theme] = useContext(ThemeContext);
  return (
    <TouchableOpacity
      onPress={() => onNotificationItemPress(item)}
      onLongPress={() => onNotificationItemLongPress(item)}>
      <View key={item.id} style={styles.item}>
        {selectable && (
          <View style={styles.itemCircle}>
            <FontAwesomeIcon
              size={icons.sizeM}
              icon={"check-circle"}
              color={selected ? theme.colorPrimary : TotaraTheme.colorNeutral3}
            />
          </View>
        )}
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, item.read && styles.read]}>
            {item.title}
          </Text>
          <Text style={[styles.subTitle, item.read && styles.read]}>
            {item.body}
          </Text>
        </View>
        <View
          style={{
            alignItems: "flex-end",
            justifyContent: "center"
          }}>
          <FontAwesomeIcon
            size={icons.sizeM}
            color={TotaraTheme.colorNeutral3}
            style={{ padding: paddings.paddingM }}
            icon={"angle-right"}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    padding: paddings.paddingL,
    paddingLeft: 0,
    backgroundColor: TotaraTheme.colorNeutral1
  },
  title: {
    ...TotaraTheme.textH3,
    ...{
      padding: paddings.paddingM,
      fontWeight: "bold"
    }
  },
  subTitle: {
    padding: paddings.paddingM
  },
  read: {
    fontWeight: "normal"
  },
  itemCircle: {
    padding: paddings.paddingL,
    display: "flex",
    justifyContent: "center"
  }
});

export default NotificationItem;
