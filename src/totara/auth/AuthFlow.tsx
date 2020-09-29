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

import React, { ReactNode, useContext, useEffect } from "react";

import { InfoModal, PrimaryButton } from "@totara/components";
import { translate } from "@totara/locale";
import { AuthContext, AuthContextState } from "@totara/core";

import ManualFlow from "./manual/ManualFlow";
import { linkingHandler, iOSLinkingHandler } from "./app-link/AppLinkFlow";
import { Images } from "@resources/images";
import { ImageSourcePropType, Linking, Platform } from "react-native";

type Props = {
  children: ReactNode;
};

/**
 * Returns the UI component depending on the authContextState.authStep value
 *
 * AuthFlow child components for authentication must use AuthFlowChildProps type for props
 *
 * @param children - when authenticated it would mount the children
 */
const AuthFlow = ({ children }: Props) => {
  const { authContextState, logOut, onLoginSuccess, onLoginFailure } = useContext(AuthContext);

  useEffect(() => {
    if (!authContextState.isAuthenticated){
      if (Platform.OS === "android") {
        //FIXME: this is running every time we get back to siteUrl component
        //it should only run once. It should be fixed when doing(MOB-786 - Navigation API in Auth)
        //so we are able to control how many times this component runs
        Linking.getInitialURL().then((url) => {
          if (url){
            linkingHandler(url, onLoginSuccess, onLoginFailure)
          }
        });
      } else {
        Linking.addEventListener("url", iOSLinkingHandler(onLoginSuccess, onLoginFailure));
      }
    }
     return (() => {
      Linking.removeAllListeners("url");
     })
   }, []);

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
  
  if (authContextState.isAuthenticated){
    return <>{children}</>;
  }else {
    return <>{showUIFor(authContextState.authStep)}</>;
  }
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


export default AuthFlow;