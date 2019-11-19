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
 *
 */
import React from "react";
import { Modal } from "react-native";
import NativeLogin from "./NativeLogin";
import { useNativeLogin } from "./NativeLoginHook";
import { ManualAuthProps } from "../ManualAuthProps";

const NativeFlow = ({
  siteUrl,
  onSetupSecretSuccess,
  onSetupSecretCancel,
  onSetupSecretFailure
}: ManualAuthProps) => {
  const onSetupLoginData = (data: string) => {
    onSetupSecretSuccess(data);
  };

  const onCancelLogin = () => {
    onSetupSecretCancel();
  };

  const UserNativeLogin = () =>
    NativeLogin(
      useNativeLogin({
        siteUrl: siteUrl,
        onSetupSecretSuccess: onSetupLoginData,
        onBack: onCancelLogin,
        onSetupSecretFailure: onSetupSecretFailure

      })
    );

  return (
      <Modal animationType="slide" transparent={false}>
        <UserNativeLogin />
      </Modal>
  );
};

export default NativeFlow;
