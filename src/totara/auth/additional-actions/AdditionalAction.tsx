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

import { TransparentView, ButtonWithIcon, ModalText, ModalImageView, ModalContainer } from "@totara/components"
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
  ContainerStyle: {
    marginBottom: resizeByScreenSize(16,16, 24, 24),
    marginTop: resizeByScreenSize(16,16, 24, 24)
  }
});

const AdditionalActionModal =() => {
  return(
    <TransparentView>
      <ModalContainer>
      <View style ={styles.ContainerStyle}>
      <ModalImageView imageType = "complete_action"/>
      </View>
        <View style ={styles.ContainerStyle}>
          <ModalText text = {translate("additional-actions-modal.auth_model_title")} fontSize = {normalize(24)} color = "#3D444B" fontWeight = "600"></ModalText>
          <ModalText text = {translate("additional-actions-modal.auth_model_description")} fontSize = {normalize(16)} color = "#3D444B" fontWeight = "100"></ModalText>
        </View>
      <AuthConsumer>
        { auth =>
        <View style ={styles. ContainerStyle}>
          <ButtonWithIcon buttonTitle = {translate("additional-actions-modal.auth_model_go_to_browser")} onPress = {()=>{ Linking.openURL(auth.setup!.host)}} buttonTitleFontWeight = "600" buttonTitleColor ="#FFF" buttonBackgroundColor = "#8ca83d" fontSize = {normalize(16)} buttonIcon = "external-link-alt"/>
          <ButtonWithIcon buttonTitle = {translate("additional-actions-modal.auth_model_logout")} onPress = {() => auth.logOut()} fontSize = {normalize(16)}></ButtonWithIcon>
        </View>
        }
      </AuthConsumer>
      </ModalContainer>
    </TransparentView>
  );
}


export default AdditionalAction;
