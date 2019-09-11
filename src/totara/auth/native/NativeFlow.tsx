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
 * @author Jun Yamog <jun.yamog@totaralearning.com
 *
 */

import React from "react";
import { Modal } from "react-native";
import { StyleProvider } from "native-base";

import { theme, getTheme } from "@totara/theme";

import NativeLogin from "./NativeLogin";
import { ManualAuthProps } from "../manual/ManualAuthProps";

class NativeFlow extends React.Component<ManualAuthProps> {

  constructor(props: ManualAuthProps) {
    super(props);
  }

  onSetupLoginData = (data: string) => {
    this.props.onSetupSecretSubmit(data);
  };

  onCancelLogin = () => {
    this.props.onSetupSecretCancel();
  };

  render() {

    // TODO re-apply the theme here from the SiteInfo

    return (
      <StyleProvider style={getTheme(theme)}>
        <Modal animationType="slide" transparent={false} >
          {/* //TODO will be covered in MOB-172 */}
          <NativeLogin
            onSuccessfulSiteUrl={(siteUrl) => this.onSetupLoginData(siteUrl)}
            siteUrl={this.props.siteUrl}
            onBack={this.onCancelLogin} />
        </Modal>
      </StyleProvider>
    );
  }

}

export default NativeFlow;