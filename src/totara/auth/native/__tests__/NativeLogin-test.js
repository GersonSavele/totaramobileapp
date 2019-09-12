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
import {View, TextInput} from "react-native";
import renderer from "react-test-renderer";
import * as  NativeComp from "native-base";

import NativeLogin from "../NativeLogin";

NativeComp.Container = jest.fn(() => <View />);
NativeComp.Content = jest.fn(() => <View />);
NativeComp.Form = jest.fn(() => <View />);
NativeComp.Input = jest.fn(() => <TextInput />);

const mockOnSuccess = jest.fn();
const mockOnFail = jest.fn();

const nativeLogin = renderer.create(
  <NativeLogin onSetupSecretSuccess={mockOnSuccess} siteUrl={"http://mobiledemo.wlg.totaralms.com"} onBack={mockOnFail} />
).getInstance();

describe("Passing different 'username' and 'password' for checking validation", () => {
  it("both valid 'username' and 'password'", () => {
    nativeLogin.setState({
      inputUsername: "username",
      inputPassword: "password"
    });
    nativeLogin.onClickEnter();
    expect(nativeLogin.state.inputUsernameStatus).toBe(undefined);
    expect(nativeLogin.state.inputPasswordStatus).toBe(undefined);
  });
  it("both empty 'username' and 'password'", () => {
    nativeLogin.setState({
      inputUsername: undefined,
      inputPassword: undefined
    });
    nativeLogin.onClickEnter();
    expect(nativeLogin.state.inputUsernameStatus).toBe("error");
    expect(nativeLogin.state.inputPasswordStatus).toBe("error");
  });

  it("valid 'username' and empty 'password'", () => {
    nativeLogin.setState({
      inputUsername: "username",
      inputPassword: undefined
    });
    nativeLogin.onClickEnter();
    expect(nativeLogin.state.inputUsernameStatus).toBe(undefined);
    expect(nativeLogin.state.inputPasswordStatus).toBe("error");
  });

  it("empty 'username' and valid 'password'", () => {
    nativeLogin.setState({
      inputUsername: undefined,
      inputPassword: "password"
    });
    nativeLogin.onClickEnter();
    expect(nativeLogin.state.inputUsernameStatus).toBe("error");
    expect(nativeLogin.state.inputPasswordStatus).toBe(undefined);
  });
});
