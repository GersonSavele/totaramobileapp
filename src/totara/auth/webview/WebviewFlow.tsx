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

import React, { useState } from "react";
import { Modal, View } from "react-native";

import SiteUrl from "../manual/SiteUrl";
import WebviewLogin from "./WebviewLogin";
import { AuthProviderStateLift } from "../AuthComponent";
import { SetupSecret } from "../AuthContext";


const WebviewFlow = ({onLoginSuccess, onLoginFailure}: AuthProviderStateLift) => {
  const {
    step,
    setupSecret,
    onSuccessfulUri,
    onSuccessfulSecret,
    onCancelLogin
  } = useWebviewFlow({onLoginSuccess: onLoginSuccess, onLoginFailure: onLoginFailure});

  switch (step) {
    case steps.webviewLogin:
      return <WebviewLoginWrapper onSuccessfulSecret={onSuccessfulSecret} uri={setupSecret.uri!} onCancelLogin={onCancelLogin}/>
    default:
      return <SiteUrl onSuccessfulSiteUrl={ (siteUrl, action) => onSuccessfulUri(siteUrl) } siteUrl={ setupSecret.uri } />;

  }

};


const WebviewLoginWrapper = ({onSuccessfulSecret, uri, onCancelLogin}: {onSuccessfulSecret: (secret: string) => void, uri: string, onCancelLogin: () => void}) =>
  (
    <View style={{ flex: 1 }}>
      <Modal animationType="slide" transparent={false} >
        <WebviewLogin onSuccessfulLogin={(setupSecret, action) => onSuccessfulSecret(setupSecret)} siteUrl={uri} onCancelLogin={(action) => onCancelLogin()} />
      </Modal>
    </View>
  );

export enum steps {
  siteUrl,
  webviewLogin,
  done
}

export const useWebviewFlow = ({onLoginSuccess, onLoginFailure}: AuthProviderStateLift) => {

  const [step, nextStep] = useState(steps.siteUrl);

  const initialSetupSecret: Partial<SetupSecret> = {};
  const [setupSecret, setSetupSecret] = useState(initialSetupSecret);

  if (setupSecret.secret && setupSecret.uri && steps.done) {
    const validSetupSecret = {
      secret: setupSecret.secret,
      uri: setupSecret.uri
    };

    console.log("successful login", validSetupSecret);

    onLoginSuccess(validSetupSecret);
  }

  const onSuccessfulUri = (uri: string) => {
    setSetupSecret({
      secret: setupSecret.secret,
      uri: uri
    });

    nextStep(steps.webviewLogin);
  };

  const onSuccessfulSecret = (secret: string) => {
    setSetupSecret({
      secret: secret,
      uri: setupSecret.uri
    });

    nextStep(steps.done);
  };

  const onCancelLogin = () => {
    console.log("onCancelLogin", step);
    nextStep(steps.siteUrl);
  };

  return ({
    step,
    setupSecret,
    onSuccessfulUri,
    onSuccessfulSecret,
    onCancelLogin
  });

};

export default  WebviewFlow;
