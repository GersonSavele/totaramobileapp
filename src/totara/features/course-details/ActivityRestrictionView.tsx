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
 * @author @author Tharaka Dushmantha <tharaka.dushmantha@totaralearning.com>
 *
 *
 */

import React, { ReactNode, useContext, useState } from "react";
import { View, StyleSheet, Modal, Image, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { resizeByScreenSize, ThemeContext } from "@totara/theme";
import { Text } from "react-native-animatable";
import { translate } from "@totara/locale";

const ActivityRestrictionView = () => {
  const [theme] = useContext(ThemeContext);
  const [visible, setVisible] = useState(true);
  return (
    <Modal transparent={true} visible={visible}>
      <View style={styles.transparentViewStyle}>
        <View
          style={[
            styles.containerStyle,
            { backgroundColor: theme.colorNeutral1 }
          ]}
        >
          <View
            style={{ marginLeft: 16, marginTop: 16, height: 20, width: 20 }}
          >
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => {
                setVisible(false);
              }}
            >
              <FontAwesomeIcon
                icon="times"
                size="20"
                color={theme.textColorDisabled}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.alertStyle}>
            <Image
              style={styles.imageStyle}
              source={require("@resources/images/general_error/general_error.png")}
            />
            <View style={styles.componentWrapStyle}>
              <Text style={[theme.textH4, { fontWeight: "bold" }]}>
                {translate("activity_not_available.title")}
              </Text>
            </View>
            <View style={styles.componentWrapStyle}>
              <Text
                style={{
                  alignSelf: "center",
                  textAlign: "center",
                  color: theme.colorNeutral6
                }}
              >
                {translate("activity_not_available.description")}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  transparentViewStyle: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end"
  },
  containerStyle: {
    borderRadius: 16,
    marginLeft: 0,
    marginRight: 0,
    flex: 0.4,
    flexDirection: "column"
  },
  alertStyle: {
    alignItems: "center",
    flex: 1
  },
  componentWrapStyle: {
    marginVertical: resizeByScreenSize(8, 8, 16, 16),
    marginHorizontal: resizeByScreenSize(16, 24, 32, 32),
    alignItems: "center"
  },
  imageStyle: {
    marginTop: resizeByScreenSize(32, 32, 48, 48),
    marginVertical: resizeByScreenSize(8, 8, 16, 16),
    justifyContent: "center",
    height: "40%",
    width: "50%",
    resizeMode: "contain"
  }
});

export default ActivityRestrictionView;
