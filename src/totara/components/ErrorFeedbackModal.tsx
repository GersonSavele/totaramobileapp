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
import { View, StyleSheet } from "react-native";
import { ButtonWithIcon, InfoModal } from ".";

import { normalize, resizeByScreenSize } from "@totara/theme";
import { translate } from "@totara/locale";

type Params = {
  title?: string;
  description?: string;
  imageType?: string;
};

const ErrorFeedbackModal = ({ title, description, imageType }: Params) => {
  return (
    <InfoModal
      title={title != null ? title : translate("general_error_feedback-modal.title")}
      description={
        description != null
          ? description
          : translate("general_error_feedback-modal.description")
      }
      imageType={imageType != null ? imageType : "general_error"}
    >
      <ErrorFeedbackViewButtons />
    </InfoModal>
  );
};

const ErrorFeedbackViewButtons = () => {
  return (
    <View style={styles.ContainerStyle}>
      <ButtonWithIcon
        buttonTitle={translate("general_error_feedback-modal.button_title")}
        onPress={() => ""}
        buttonTitleFontWeight="600"
        buttonTitleColor="#FFF"
        buttonBackgroundColor="#8ca83d"
        fontSize={normalize(16)}
      />
      <ButtonWithIcon
        buttonTitle={translate("general_error_feedback-modal.try_in_browser")}
        onPress={() => ""}
        fontSize={normalize(16)}
      ></ButtonWithIcon>
    </View>
  );
};

const styles = StyleSheet.create({
  ContainerStyle: {
    marginBottom: resizeByScreenSize(16, 16, 24, 24)
  },
  buttonContainerStyle: {
    marginStart: resizeByScreenSize(8, 12, 12, 16)
  },
  buttonStyle: {
    backgroundColor: "#FFF"
  }
});

export default ErrorFeedbackModal;
