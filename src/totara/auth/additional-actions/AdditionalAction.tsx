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
import { View, StyleSheet, Linking} from "react-native";

import { TransparentView, CustomButton, CustomText, CustomImageView, ModalContainer } from "@totara/components"
import { normalize, resizeByScreenSize } from "@totara/theme";
import { translate } from "@totara/locale";
import { AuthConsumer } from "@totara/auth";
import AdditionalActionRule from "./AdditionalActionRule"


type Props = {
  children: Element
}
class AdditionalAction extends React.Component<Props> {

render() {
  return (
    <AdditionalActionRule>
    <AdditionalActionModal/>
    </AdditionalActionRule>
    )
  }
}

const styles = StyleSheet.create({
  textContainerStyle: {
    marginBottom: resizeByScreenSize(32,32, 48, 48)
  }
});

const AdditionalActionModal =() => {
  return(
    <TransparentView>
      <ModalContainer>
      <CustomImageView imageType = "complete_action"/>
        <View style ={styles. textContainerStyle}>
          <CustomText text = {translate("additional-actions-modal.auth_model_title")} fontSize = {normalize(24)} color = "#3D444B" fontWeight = "600"></CustomText>
          <CustomText text = {translate("additional-actions-modal.auth_model_description")} fontSize = {normalize(16)} color = "#3D444B" fontWeight = "100"></CustomText>
        </View>
      <AuthConsumer>
        { auth =>
        <View style ={styles. textContainerStyle}>
          <CustomButton buttonTitle = {translate("additional-actions-modal.auth_model_go_to_browser")} onPress = {()=>{ Linking.openURL(auth.setup!.host)}} buttonTitleFontWeight = "600" buttonTitleColor ="#FFF" buttonBackgroundColor = "#8ca83d" fontSize = {normalize(16)} buttonIcon = "external-link-alt"/>
          <CustomButton buttonTitle = {translate("additional-actions-modal.auth_model_logout")} onPress = {() => auth.logOut()} fontSize = {normalize(16)}></CustomButton>
        </View>
        }
      </AuthConsumer>
      </ModalContainer>
    </TransparentView>
  );
}


export default AdditionalAction;
