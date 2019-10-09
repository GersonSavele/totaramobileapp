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
import {  Linking } from "react-native";
import {  PrimaryButton, InfoModal, TertiaryButton } from ".";

import { translate } from "@totara/locale";


class GeneralErrorModal extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      visible: true
    }
  }
  render() {
    return (
      <InfoModal title={translate("general_error_feedback-modal.title")} description={translate("general_error_feedback-modal.description")} imageType={"general_error"} visible={this.state.visible}>
        <PrimaryButton text={translate("general_error_feedback-modal.primary_title")} onPress={() => { this.setState({visible: !this.state.visible}); }} />
        <TertiaryButton  text={translate("general_error_feedback-modal.tertiary_title")} onPress={() => { Linking.openURL(this.props.siteUrl); }} />
      </InfoModal>
    );
  }
}

type State = {
  visible: boolean
}
type Props = {
  errorType?: "general_error" | ""
};

export default GeneralErrorModal;
