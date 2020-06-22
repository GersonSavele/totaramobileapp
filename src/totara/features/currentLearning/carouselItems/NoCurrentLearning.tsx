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
 *
 */

import React, { useContext } from "react";
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  Text,
  Linking
} from "react-native";

import { PrimaryButton } from "@totara/components";
import { gutter, resizeByScreenSize, ThemeContext } from "@totara/theme";
import { translate } from "@totara/locale";
import { AuthConsumer } from "@totara/core";

const NoCurrentLearning = () => {
  const [theme] = useContext(ThemeContext);

  return (
    <View style={styles.containerStyle}>
      <Image
        style={styles.imageContainer}
        source={require("@resources/images/no_current_learning/no_current_learning.png")}
      />
      <Text style={[theme.textH2, styles.description]}>
        {translate("current_learning.no_learning_message")}
      </Text>
      <AuthConsumer>
        {(auth) =>
          auth.authContextState.appState &&
          auth.authContextState.appState.host && (
            <PrimaryButton
              onPress={() => {
                Linking.openURL(auth.authContextState.appState!.host);
              }}
              text={translate(
                "additional_actions_modal.auth_model_go_to_browser"
              )}
              icon="external-link-alt"
              style={{ alignSelf: "center" }}
            />
          )
        }
      </AuthConsumer>
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: gutter
  },
  imageContainer: {
    height: Dimensions.get("window").width * 0.5,
    width: Dimensions.get("window").width * 0.7,
    resizeMode: "contain",
    paddingBottom: resizeByScreenSize(32, 32, 48, 48)
  },
  description: {
    alignItems: "flex-start",
    marginVertical: resizeByScreenSize(32, 32, 48, 48)
  }
});

export default NoCurrentLearning;
