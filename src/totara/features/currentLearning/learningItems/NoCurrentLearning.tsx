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
import { View, StyleSheet, Image, Text, Linking, ImageSourcePropType } from "react-native";

import { PrimaryButton } from "@totara/components";
import { TotaraTheme } from "@totara/theme/Theme";
import { translate } from "@totara/locale";
import { AuthConsumer } from "@totara/core";
import { Images } from "@resources/images";
import { paddings } from "@totara/theme/constants";

type NoCurrentLearningProps = {
  testID?: string;
};

const NoCurrentLearning = ({ testID }: NoCurrentLearningProps) => {
  return (
    <View style={styles.containerStyle} testID={testID}>
      <Image source={Images.noCurrentLearning as ImageSourcePropType} />
      <Text style={styles.noCurrentLearningDescription}>{translate("current_learning.no_learning_message")}</Text>
      <View style={styles.goToBrowserAction}>
        <AuthConsumer>
          {(auth) =>
            auth.authContextState.appState &&
            auth.authContextState.appState.host && (
              <PrimaryButton
                onPress={() => {
                  Linking.openURL(auth.authContextState.appState!.host);
                }}
                text={translate("current_learning.find_learning")}
                icon="external-link-alt"
                style={{ alignSelf: "center" }}
              />
            )
          }
        </AuthConsumer>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    alignItems: "center"
  },
  noCurrentLearningDescription: {
    ...TotaraTheme.textHeadline,
    fontWeight: "bold",
    paddingTop: paddings.padding3XL
  },
  goToBrowserAction: {
    paddingTop: paddings.padding3XL
  }
});

export default NoCurrentLearning;
