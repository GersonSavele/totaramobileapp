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

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { NotificationMessage } from "@totara/types";
import { fontWeights, paddings } from "@totara/theme/constants";
import { TotaraTheme } from "@totara/theme/Theme";
import { timeAgo } from "@totara/lib/tools";

type ParamList = {
  messageDetails: NotificationMessage;
};

type NotificationDetailProps = StackScreenProps<ParamList, "messageDetails">;

const NotificationDetails = ({ route }: NotificationDetailProps) => {
  const { subject, timeCreated, fullMessage } = route.params;

  return (
    <View style={styles.mainContainer}>
      <View>
        <Text testID={"test_title"} style={styles.title}>
          {subject}
        </Text>
        <Text testID={"test_timeCreated"} style={styles.timeCreated}>
          {timeAgo(timeCreated)}
        </Text>
      </View>
      <View style={styles.content}>
        <Text testID={"test_fullMessage"}>{fullMessage}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    ...TotaraTheme.viewContainer,
    padding: paddings.paddingXL
  },
  timeCreated: {
    ...TotaraTheme.textSmall,
    color: TotaraTheme.colorNeutral6
  },
  title: {
    ...TotaraTheme.textRegular,
    fontWeight: fontWeights.fontWeightSemiBold
  },
  content: {
    ...TotaraTheme.textRegular,
    paddingTop: paddings.padding2XL
  }
});

export default NotificationDetails;
