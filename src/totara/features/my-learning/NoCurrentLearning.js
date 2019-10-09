/**
 * This file is part of Totara Mobile
 *
 * Copyright (C) 2019 onwards Totara Learning Solutions LTD
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @author Tharaka Dushmantha <tharaka.dushmantha@totaralearning.com>
 **/

import React from "react";
import { View, StyleSheet, Image, Dimensions, Text, Linking } from "react-native";

import { PrimaryButton } from "@totara/components";
import { gutter, resizeByScreenSize, textColorDark, fontSizeH2, lineHeightH2 } from "@totara/theme";
import { translate } from "@totara/locale";
import { AuthConsumer } from "@totara/auth";

const NoCurrentLearning = () => {
  return (
    <View style={styles.containerStyle}>
      <Image style={styles.imageContainer} source={require("@resources/images/no_current_learning/no_current_learning.png")} />
      <Text style={styles.description}>{translate("my-learning.no_learning_message")}</Text>
      <AuthConsumer>
        {auth => (
          <PrimaryButton onPress={() => { Linking.openURL(auth.setup.host); }} text={translate("additional-actions-modal.auth_model_go_to_browser")} icon="external-link-alt" style={{ alignSelf: "center" }} />
        )}
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
    paddingBottom: resizeByScreenSize(32, 32, 48, 48),
  },
  description: {
    alignItems: "flex-start",
    marginBottom: resizeByScreenSize(32, 32, 48, 48),
    marginTop: resizeByScreenSize(32, 32, 48, 48),
    fontSize : fontSizeH2,
    lineHeight: lineHeightH2,
    color:  textColorDark, 
    fontWeight: "bold"
  }
});

export default NoCurrentLearning;
