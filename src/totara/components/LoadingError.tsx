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

import React from "react";
import { Image, StyleSheet, View, Text } from "react-native";
import { PrimaryButton } from "@totara/components/index";
import { Images } from "@resources/images";
import { paddings } from "@totara/theme/constants";
import { translate } from "@totara/locale";
import { TotaraTheme } from "@totara/theme/Theme";

type LoadingErrorProps = {
  onRefreshTap(): void;
  testID?: string;
};

const LoadingError = ({ onRefreshTap, testID }: LoadingErrorProps) => {
  return (
    <View style={styles.containerStyle} testID={testID}>
      <View style={styles.errorContainer}>
        <Image source={Images.offline} />
        <Text style={styles.textTitle}>{translate("content_error.title")}</Text>
        <Text style={styles.testDescription}>{translate("content_error.description")}</Text>
      </View>

      <View style={styles.actionContainer}>
        <PrimaryButton onPress={onRefreshTap} text={translate("general.try_again")} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    height: "100%",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center"
  },
  errorContainer: {
    padding: paddings.paddingL,
    alignItems: "center",
    alignContent: "space-between"
  },
  actionContainer: {
    padding: paddings.paddingL
  },
  textTitle: {
    ...TotaraTheme.textH2,
    padding: paddings.paddingL
  },
  testDescription: {
    ...TotaraTheme.textRegular,
    marginHorizontal: paddings.paddingXL,
    textAlign: "center"
  }
});

export default LoadingError;
