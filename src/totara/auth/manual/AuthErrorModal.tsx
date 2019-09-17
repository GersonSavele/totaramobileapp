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
 * @author: Kamala Tennakoon <kamala.tennakoon@totaralearning.com>
 */

import React from "react";
import { Linking } from "react-native";

import { PrimaryButton, InfoModal, TertiaryButton } from "@totara/components";
import { translate } from "@totara/locale";

export default class AuthErrorModal extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      visible: this.props.visible
    }
  }
  render() {
    return (
      <InfoModal title={translate("error-not-valid-url.title")} description={translate("error-not-valid-url.description")} imageType={"url_not_valid"} visible={this.state.visible}>
        <PrimaryButton text={translate("error-not-valid-url.primary_title")} style={{ marginBottom: 18 }} onPress={() => { this.setState({visible: !this.state.visible}); }} />
        <TertiaryButton  text={translate("error-not-valid-url.tertiary_title")} onPress={() => { Linking.openURL(this.props.siteUrl); }} />
      </InfoModal>
    );
  }
}

type State = {
  visible: boolean
}
type Props = {
  errorType: "not_valid_url",
  siteUrl: string,
  visible: boolean
};