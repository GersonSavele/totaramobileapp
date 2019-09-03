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
import { View, StyleSheet } from "react-native";
import { Button } from "native-base";
import { TransparentView, CustomButton, CustomText, CustomImageView, ModalContainer } from "./"
import { TextParams, ButtonParams, ImageParams } from "./types/ComponentsTypes"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { normalize, resizeByScreenSize } from "@totara/theme";
import { translate } from "@totara/locale";

type Params = {
    title : TextParams,
    description : TextParams,
    button : ButtonParams,
    image : ImageParams
}

const ErrorFeedbackView = ({title, description, button, image}: Params) => {
    return(
    <TransparentView>
    <View style = {styles.buttonContainerStyle}>
    <Button style = {styles.buttonStyle} onPress = {()=> ""}>
    <FontAwesomeIcon icon="times" size={24}/>
    </Button>
    </View>
      <ModalContainer>
      <CustomImageView imageType = "complete_action"/>
        <View style ={styles. textContainerStyle}>
          <CustomText text = {translate("error_feedback-modal.title")} fontSize = {normalize(24)} color = "#3D444B" fontWeight = "600"></CustomText>
          <CustomText text = {translate("error_feedback-modal.description")} fontSize = {normalize(16)} color = "#3D444B" fontWeight = "100"></CustomText>
        </View>
        <View style ={styles. textContainerStyle}>
          <CustomButton buttonTitle = {translate("error_feedback-modal.button_title")} onPress = {()=> ""} buttonTitleFontWeight = "600" buttonTitleColor ="#FFF" buttonBackgroundColor = "#8ca83d" fontSize = {normalize(16)}/>
        </View>
      </ModalContainer>
    </TransparentView>
    );
}

const styles = StyleSheet.create({
    textContainerStyle: {
      marginBottom: resizeByScreenSize(32,32, 48, 48),
      alignItems: "center"
    }, 
    buttonContainerStyle: {
        marginStart:resizeByScreenSize(8,12, 12, 16) 
    }, 
    buttonStyle : {
        backgroundColor : "#FFF"
    }
  });

export default ErrorFeedbackView;