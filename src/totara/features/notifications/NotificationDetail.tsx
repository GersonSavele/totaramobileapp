import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { NavigationContext } from "react-navigation";
import { NotificationMessage } from "@totara/types";
import { fontWeights, paddings } from "@totara/theme/constants";
import { TotaraTheme } from "@totara/theme/Theme";
import { timeAgo } from "@totara/lib/tools";

const NotificationDetails = () => {
  const navigation = useContext(NavigationContext);
  const { subject, timeCreated, fullMessage } = navigation.state
    .params as NotificationMessage;

  return (
    <View style={styles.mainContainer}>
      <View>
        <Text style={styles.title}>{subject}</Text>
        <Text style={styles.timeCreated}>{timeAgo(timeCreated)}</Text>
      </View>
      <View style={styles.content}>
        <Text>{fullMessage}</Text>
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
