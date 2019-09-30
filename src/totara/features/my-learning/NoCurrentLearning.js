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
import { ButtonWithIcon } from "@totara/components";
import { resizeByScreenSize, normalize } from "@totara/theme";
import { translate } from "@totara/locale";
import { AuthConsumer } from "@totara/auth";

const NoCurrentLearning = () => {
  return (
    
    <View style={styles.MainContainerStyle}>
        <Image
          style={styles.ImageStyle}
          source={require("@resources/images/no_current_learning/no_current_learning.png")}
        />
      <View style={styles.TextStyle}>
        <Text style = {{fontSize : 24,color:  "#3d444b", fontWeight: "700"}}>No current learning</Text>
      </View>
      <AuthConsumer>
      {auth => (
      <ButtonWithIcon
            buttonTitle={translate(
              "additional-actions-modal.auth_model_go_to_browser"
            )}
            onPress={() => {
                Linking.openURL(auth.setup.host);
            }}
            buttonTitleFontWeight="600"
            buttonTitleColor="#FFF"
            buttonBackgroundColor="#8ca83d"
            fontSize={normalize(16)}
            buttonIcon="external-link-alt"
            borderRadius= {5}/>
      )}</AuthConsumer>
    </View>

  );
};

const styles = StyleSheet.create({
  MainContainerStyle: {
    flex: 1,
    flexDirection: "column",
    marginLeft: "5%",
    marginRight: "5%",
    marginBottom: "5%",
    alignItems: "center",
    justifyContent: "center"
  },
  containerStyle: {
    flex: 1,
    borderRadius: 4,
    marginHorizontal: resizeByScreenSize(16, 16, 20, 20),
    marginVertical: resizeByScreenSize(32, 32, 32, 32),
    backgroundColor: "#FFF"
  },
  transparentViewStyle: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)"
  },
  ImageStyle: {
    alignItems: "center",
    height: Dimensions.get("window").width * 0.5,
    width: Dimensions.get("window").width * 0.7,
    resizeMode: "contain",
    paddingBottom: resizeByScreenSize(32, 32, 48, 48)
  },
  TextStyle: {
    alignItems: "flex-start",
    paddingBottom: resizeByScreenSize(32, 32, 48, 48),
    paddingTop: resizeByScreenSize(32, 32, 48, 48)
  },
  buttonContainerStyle: {
    marginStart: resizeByScreenSize(8, 12, 12, 16)
  },
  buttonStyle: {
    backgroundColor: "#FFF"
  }
});

export default NoCurrentLearning;
