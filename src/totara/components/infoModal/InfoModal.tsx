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

import React, {ReactNode} from "react";
import { View, StyleSheet, Modal } from "react-native";
import {
  TransparentView,
  ModalText,
  ModalImageView,
  ModalContainer
} from ".";
import { normalize, resizeByScreenSize } from "@totara/theme";

type Params = {
  title?: string;
  description?: string;
  imageType: string;
  children? : ReactNode
};

const InfoModal = ({ title, description, imageType, children, ...rest }: Params) => {
  return (
    <Modal {...rest}>
      <TransparentView>
        <ModalContainer>
        <View style={styles.ContainerStyle}>
          <ModalImageView imageType= {imageType} />
          </View>
          <View style={styles.ContainerStyle}>
            <ModalText
              text={title}
              fontSize={normalize(24)}
              color="#3D444B"
              fontWeight="600"
            ></ModalText>
            <ModalText
              text={description}
              fontSize={normalize(16)}
              color="#3D444B"
              fontWeight="100"
            ></ModalText>
          </View>
          {children}
        </ModalContainer>
      </TransparentView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  ContainerStyle: {
    marginBottom: resizeByScreenSize(8, 8, 16, 16),
    marginTop: resizeByScreenSize(8, 8, 16, 16),
    alignItems:"center"
  },
  buttonContainerStyle: {
    marginStart: resizeByScreenSize(8, 12, 12, 16)
  },
  buttonStyle: {
    backgroundColor: "#FFF"
  }
});

export default InfoModal;
