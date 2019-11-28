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

import { AuthContext } from "@totara/core/AuthContext";
import { AuthStep } from "@totara/core/AuthHook";
import ManualFlow from "./manual/ManualFlow";
import AppLinkFlow from "@totara/auth/app-link";
import { Text } from "react-native";
import { ApolloProvider } from "@apollo/react-common";


export const AuthFlow = ({children}: Props) => {

  const { authContextState, logOut, onLoginSuccess, onLoginFailure, apolloClient } = useContext(AuthContext);

  // TODO MOB-307 improve and make this testable, logic is getting more complicated
  const showUIFor = (authStep: AuthStep) => {
    switch (authStep) {
      case AuthStep.authError:
        return <AuthErrorModal action={()=> logOut(true)}/>;
      case AuthStep.setupDone:
      case AuthStep.bootstrapDone:
        return <ManualFlow onLoginSuccess={onLoginSuccess} onLoginFailure={onLoginFailure}/>;
      case AuthStep.setupSecretInit:
      case AuthStep.loading:
        return null;
    }
  };

  return (
    <React.Fragment>
      <AppLinkFlow onLoginFailure={onLoginFailure} onLoginSuccess={onLoginSuccess}/>
      {
        authContextState.isLoading
        ? <Text>TODO replace with error feedback screen see MOB-117</Text>
        : apolloClient
          ? <ApolloProvider client={apolloClient}>
            {children}
            </ApolloProvider>
          : showUIFor(authContextState.authStep)
      }
    </React.Fragment>
  );
};

type PropAuthError = {
  action: () => void
};

const AuthErrorModal = ({ action }: PropAuthError) => (
  <InfoModal
    title={translate("auth_general_error.title")}
    description={translate("auth_general_error.description")}
    imageType={"general_error"}
    visible={true}
  >
    <PrimaryButton
      text={translate("auth_general_error.action_primary")}
      onPress={() => action()}
    />
  </InfoModal>
);

type Props = {
  children: ReactNode
}
