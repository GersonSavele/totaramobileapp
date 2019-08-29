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

import React from 'react';
import NativeLogin, { StatusInput } from "../NativeLogin";
import renderer from "react-test-renderer";


const mockOnSuccess = jest.fn();
const mockOnFail = jest.fn();

const nativeLogin = renderer.create(
  <NativeLogin onSuccessfulSiteUrl={mockOnSuccess} siteUrl={"http://mobiledemo.wlg.totaralms.com"} onBack={mockOnFail} />
).getInstance();

describe("Passing different 'username' and 'password' for checking validation", () => {
  const testCases = [
    {
      "testcase": "both valid 'username' and 'password'",
      "username": "uname",
      "password": "pword",
      "stateUsername": StatusInput.normal,
      "statePassword": StatusInput.normal
    }, {
      "testcase": "both empty 'username' and 'password'",
      "username": undefined,
      "password": undefined,
      "stateUsername": StatusInput.error,
      "statePassword": StatusInput.error
    }, {
      "testcase": "valid 'username' and empty 'password'",
      "username": "uname",
      "password": undefined,
      "stateUsername": StatusInput.normal,
      "statePassword": StatusInput.error
    }, {
      "testcase": "empty 'username' and valid 'password'",
      "username": undefined,
      "password": "pword",
      "stateUsername": StatusInput.error,
      "statePassword": StatusInput.normal
    }, {
      "testcase": "invalid 'username' and valid 'password'",
      "username": "wrong",
      "password": "pword",
      "stateUsername": StatusInput.error,
      "statePassword": StatusInput.normal
    }
  ];
  function testOnClickEnter() {
    for (let i = 0; i < testCases.length; i++) {
      var testCase = testCases[i];
      const testcase = testCase["testcase"];
      it(testcase, () => {
        const expectStateUname = testCase["stateUsername"];
        const expectStatePword = testCase["statePassword"];
        nativeLogin.setState({
          inputUsername: testCase["username"],
          inputPassword: testCase["password"]
        });
        nativeLogin.onClickEnter();
        expect(nativeLogin.state.statusInputUsername).toBe(expectStateUname);
        expect(nativeLogin.state.statusInputPassword).toBe(expectStatePword);
      });
    }
  }
  testOnClickEnter();
});
