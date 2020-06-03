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
      <View
        key={item.id}
        style={{
          flexDirection: "row",
          backgroundColor: TotaraTheme.colorNeutral1
        }}>
        {selectable && (
          <View style={styles.itemCircle}>
            <FontAwesomeIcon
              size={icons.sizeL}
              icon={"check-circle"}
              color={selected ? theme.colorPrimary : TotaraTheme.colorNeutral3}
            />
          </View>
        )}
        <View style={{ flex: 2 }}>
          <Text
            style={[
              TotaraTheme.textH3,
              {
                padding: paddings.paddingM,
                fontWeight: item.read ? "normal" : "bold"
              }
            ]}>
            {item.title}
          </Text>
          <Text
            style={{
              padding: paddings.paddingM,
              fontWeight: item.read ? "normal" : "bold"
            }}>
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
  itemCircle: {
    padding: paddings.marginXL,
    display: "flex",
    justifyContent: "center"
  }
});

export default NotificationItem;
