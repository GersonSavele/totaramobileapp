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
 **/

import React from "react";
import { View, StyleSheet, Modal } from "react-native";
import { Button } from "native-base";
import {
  TransparentView,
  ButtonWithIcon,
  ModalText,
  ModalImageView,
  ModalContainer
} from "./";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { normalize, resizeByScreenSize } from "@totara/theme";
import { translate } from "@totara/locale";


type ButtonParams = {
  buttonTitle?: string;
  buttonBackgroundColor?: string;
  buttonTitleColor?: string;
  buttonBorderColor?: string;
  buttonTitleFontWeight?: string;
  borderRadius?: number;
  borderWidth?: number;
  fontSize?: number;
  onPress: () => void;
  buttonIcon?: string;
};

type ImageParams = {
  imageType: string;
};

type TextParams = {
  text: string;
  fontSize?: number;
  color?: string;
  fontWeight?: string;
};

type Params = {
  title: TextParams;
  description: TextParams;
  button: ButtonParams;
  image: ImageParams;
};

const ErrorFeedbackView = ({ title, description, button, image }: Params) => {
  return (
    <Modal>
      <TransparentView>
        <View style={styles.buttonContainerStyle}>
          <Button style={styles.buttonStyle} onPress={() => ""}>
            <FontAwesomeIcon icon="times" size={24} />
          </Button>
        </View>
        <ModalContainer>
        <View style={styles.ContainerStyle}>
          <ModalImageView imageType="url_not_valid" />
          </View>
          <View style={styles.ContainerStyle}>
            <ModalText
              text={translate("error_feedback-modal.title")}
              fontSize={normalize(24)}
              color="#3D444B"
              fontWeight="600"
            ></ModalText>
            <ModalText
              text={translate("error_feedback-modal.description")}
              fontSize={normalize(16)}
              color="#3D444B"
              fontWeight="100"
            ></ModalText>
          </View>
          <View style={styles.ContainerStyle}>
            <ButtonWithIcon
              buttonTitle={translate("error_feedback-modal.button_title")}
              onPress={() => ""}
              buttonTitleFontWeight="600"
              buttonTitleColor="#FFF"
              buttonBackgroundColor="#8ca83d"
              fontSize={normalize(16)}
            />
            <ButtonWithIcon
                buttonTitle={translate(
                  "error_feedback-modal.try_in_browser"
                )}
                onPress={() => ""}
                fontSize={normalize(16)}
              ></ButtonWithIcon>
          </View>
        </ModalContainer>
      </TransparentView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  ContainerStyle: {
    marginBottom: resizeByScreenSize(16, 16, 24, 24),
    marginTop: resizeByScreenSize(16, 16, 24, 24),
    alignItems:"center"
  },
  buttonContainerStyle: {
    marginStart: resizeByScreenSize(8, 12, 12, 16)
  },
  buttonStyle: {
    backgroundColor: "#FFF"
  }
});

export default ErrorFeedbackView;
