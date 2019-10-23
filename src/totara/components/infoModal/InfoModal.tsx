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

import React, {ReactNode, useContext} from "react";
import { View, StyleSheet, Modal } from "react-native";

import {
  TransparentView,
  ModalText,
  ModalImageView,
  ModalContainer
} from ".";
import { resizeByScreenSize } from "@totara/theme";
import { ThemeContext } from "@totara/theme/ThemeContext";

type Params = {
  title?: string;
  description?: string;
  imageType: string;
  children? : ReactNode;
  visible: boolean;
};

const InfoModal = ({ title, description, imageType, children, ...rest }: Params) => {
  
  const [theme] = useContext(ThemeContext);
  
  return (
    <Modal {...rest}>
      <TransparentView>
        <ModalContainer>
          <View style={styles.sectionContainer}>
            <ModalImageView imageType={imageType} />
          </View>
          <View style={styles.sectionContainer}>
            <ModalText text={title} fontSize={theme.textH2.fontSize} fontWeight="bold" />
            <ModalText text={description} />
          </View>
          <View style={styles.actionContainer}>
            {children}
          </View>
        </ModalContainer>
      </TransparentView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginVertical: resizeByScreenSize(8, 8, 16, 16),
    alignItems:"center"
  },
  actionContainer: {
    marginVertical: resizeByScreenSize(8, 8, 16, 16),
    minHeight: 104,
    justifyContent: "space-between"
  }
});

export default InfoModal;
