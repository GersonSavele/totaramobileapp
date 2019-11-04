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
 * @author Tharaka Dushmantha <tharaka.dushmantha@totaralearning.com
 */

import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import SafeAreaView from "react-native-safe-area-view";

import { resizeByScreenSize, ThemeContext } from "@totara/theme";

const TransparentView = ({ children }: Props) => {
  const [theme] = useContext(ThemeContext);
  return (
    <View style={styles.transparentViewStyle}>
      <SafeAreaView style={{ flex: 1}} forceInset={{ bottom: "always" }}>
        <View style={[styles.containerStyle, {backgroundColor: theme.colorNeutral1 }]}>{children}</View>
      </SafeAreaView>
    </View>
  );
};

type Props = {
  children? : Element
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    borderRadius: 4,
    marginHorizontal: resizeByScreenSize(16, 16, 20, 20),
    marginVertical: resizeByScreenSize(32, 32, 32, 32),
  },
  transparentViewStyle: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)"
  }
});

export default TransparentView;