/**
 * This file is part of Totara Enterprise.
 *
 * Copyright (C) 2019 onwards Totara Learning Solutions LTD
 *
 * Totara Enterprise is provided only to Totara Learning Solutions
 * LTD’s customers and partners, pursuant to the terms and
 * conditions of a separate agreement with Totara Learning
 * Solutions LTD or its affiliate.
 *
 * If you do not have an agreement with Totara Learning Solutions
 * LTD, you may not access, use, modify, or distribute this software.
 * Please contact [sales@totaralearning.com] for more information.
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
        return (
          <ManualFlow
            onLoginSuccess={onLoginSuccess}
            onLoginFailure={onLoginFailure}
            siteUrl={authContextState.setup?.uri}
          />
        );
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
