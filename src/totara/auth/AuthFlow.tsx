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
 * @author Jun Yamog <jun.yamog@totaralearning.com>
 */

import React, { ReactNode, useContext } from "react";

import { InfoModal, PrimaryButton } from "@totara/components";
import { translate } from "@totara/locale";
import { AuthContext, AuthContextState } from "@totara/core";

import ManualFlow from "./manual/ManualFlow";
import AppLinkFlow from "./app-link/AppLinkFlow";
import { Images } from "@resources/images";
import { ImageSourcePropType } from "react-native";

/**
 * Returns the UI component depending on the authContextState.authStep value
 *
 * AuthFlow child components for authentication must use AuthFlowChildProps type for props
 *
 * @param children - when authenticated it would mount the children
 */
export const AuthFlow = ({ children }: Props) => {
  const { authContextState, logOut, onLoginSuccess, onLoginFailure } = useContext(AuthContext);

  // TODO MOB-307 improve and make this testable, logic is getting more complicated
  const showUIFor = (authStep: AuthContextState["authStep"]) => {
    switch (authStep) {
      case "authError":
        return <AuthErrorModal action={() => logOut(true)} />;
      case "setupDone":
      case "bootstrapDone":
        return <ManualFlow onLoginSuccess={onLoginSuccess} onLoginFailure={onLoginFailure} />;
      case "setupSecretInit":
      case "loading":
        return null; // it's in the middle of transitioning don't return any element
    }
  };

  return (
    <React.Fragment>
      {authContextState.isLoading ? (
        <AppLinkFlow onLoginFailure={onLoginFailure} onLoginSuccess={onLoginSuccess} />
      ) : authContextState.isAuthenticated ? (
        children
      ) : (
        showUIFor(authContextState.authStep)
      )}
    </React.Fragment>
  );
};

type PropAuthError = {
  action: () => void;
};

const AuthErrorModal = ({ action }: PropAuthError) => (
  <InfoModal
    title={translate("native_login.auth_general_error.title")}
    description={translate("native_login.auth_general_error.description")}
    imageSource={Images.generalError as ImageSourcePropType}
    visible={true}>
    <PrimaryButton text={translate("native_login.auth_general_error.action_primary")} onPress={() => action()} />
  </InfoModal>
);

type Props = {
  children: ReactNode;
};
