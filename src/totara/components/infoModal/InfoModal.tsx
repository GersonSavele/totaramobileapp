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

import React, { ReactNode, useContext } from "react";
import { View, StyleSheet, Modal } from "react-native";
import SafeAreaView from "react-native-safe-area-view";

import ModalText from "./ModalText";
import ModalImageView from "./ModalImageView";
import { resizeByScreenSize, ThemeContext } from "@totara/theme";
import { TotaraTheme } from "@totara/theme/Theme";

type Params = {
  title?: string;
  description?: string;
  imageType: string;
  children?: ReactNode;
  visible: boolean;
  transparent?: boolean;
};

const InfoModal = ({
  title,
  description,
  imageType,
  children,
  transparent,
  ...rest
}: Params) => {
  const [theme] = useContext(ThemeContext);

  return (
    <Modal {...rest} transparent={transparent} animationType="fade">
      <View style={styles.transparentViewStyle}>
        <SafeAreaView style={{ flex: 1 }} forceInset={{ bottom: "always" }}>
          <View
            style={[
              styles.containerStyle,
              { backgroundColor: theme.colorNeutral1 }
            ]}>
            <View style={styles.sectionContainer}>
              <ModalImageView imageType={imageType} />
            </View>
            <View style={styles.sectionContainer}>
              <ModalText
                text={title}
                fontSize={theme.textH2.fontSize}
                fontWeight={theme.textH2.fontWeight}
              />
              <ModalText text={description} />
            </View>
            <View style={styles.actionContainer}>{children}</View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  transparentViewStyle: {
    flex: 1,
    backgroundColor: TotaraTheme.colorOpacity70
  },
  containerStyle: {
    flex: 1,
    borderRadius: 4,
    marginHorizontal: resizeByScreenSize(16, 16, 20, 20),
    marginVertical: resizeByScreenSize(32, 32, 32, 32),
    flexDirection: "column",
    marginLeft: "5%",
    marginRight: "5%",
    alignItems: "center",
    justifyContent: "center"
  },
  sectionContainer: {
    marginVertical: resizeByScreenSize(8, 8, 16, 16),
    marginHorizontal: resizeByScreenSize(16, 24, 32, 32),
    alignItems: "center"
  },
  actionContainer: {
    marginVertical: resizeByScreenSize(8, 8, 16, 16),
    minHeight: 104,
    justifyContent: "space-between"
  }
});

export default InfoModal;
