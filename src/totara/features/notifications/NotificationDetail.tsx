import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { NavigationContext } from "react-navigation";
import { NotificationMessage } from "@totara/types";
import { paddings } from "@totara/theme/constants";
import { TotaraTheme } from "@totara/theme/Theme";
import { PrimaryButton } from "@totara/components";

const NotificationDetails = () => {
  const navigation = useContext(NavigationContext);
  const { title, received, body, action } = navigation.state
    .params as NotificationMessage;
  return (
    <View style={styles.mainContainer}>
      <View>
        <Text style={TotaraTheme.textH3}>{title}</Text>
        <Text style={{ color: TotaraTheme.colorNeutral6 }}>{received}</Text>
      </View>
      <View style={{ paddingTop: paddings.padding2XL }}>
        <Text>{body}</Text>
      </View>
      <View style={{ paddingTop: paddings.padding2XL }}>
        <PrimaryButton
          text={action.title}
          onPress={() => {
            console.warn(action.link);
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    ...TotaraTheme.viewContainer,
    ...{
      padding: paddings.paddingXL
    }
  }
});

export default NotificationDetails;
