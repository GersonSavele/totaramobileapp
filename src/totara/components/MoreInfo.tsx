import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { TotaraTheme } from "@totara/theme/Theme";
import { iconSizes, paddings } from "@totara/theme/constants";

type MoreInfoProps = {
  onPress(): void;
  testID?: string;
};

const MoreInfo = ({ onPress, testID }: MoreInfoProps) => {
  return (
    <TouchableOpacity onPress={onPress} testID={testID}>
      <View style={styles.rounded}>
        <FontAwesomeIcon icon={"info"} color={TotaraTheme.colorLink} size={iconSizes.sizeXS} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  rounded: {
    borderRadius: iconSizes.sizeXS,
    borderWidth: 1,
    borderColor: TotaraTheme.colorLink,
    padding: paddings.paddingS
  }
});

export default MoreInfo;
