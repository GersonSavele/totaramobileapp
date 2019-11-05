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

import renderer from "react-test-renderer";
// import { MockedProvider } from "@apollo/react-testing";
import React from "react";
import {Text} from "react-native";
import wait from "waait";

import AppModal, { isCompatible, isValidApiVersion } from "../AppModal";
import { AuthContext } from "@totara/auth/AuthContext";

describe("AppModal", () => {
  
  it("should returns available features for current older and higher API version", () => {
    const validVersion = isCompatible("2019101802");
    expect(validVersion).toEqual([1]);
    
    const oldVersion = isCompatible("2010101802");
    expect(oldVersion).toEqual([]);

    const higherVersion = isCompatible("2030101802");
    expect(higherVersion).toEqual([1]);
  });

  it("should returns true/false according to `minimum api version`", () => {
    const validVersion = isValidApiVersion({ apiVersion: "2019101802" });
    expect(validVersion).toBeTruthy();
    
    const oldVersion = isValidApiVersion({ apiVersion: "2010101802" });
    expect(oldVersion).toBeFalsy();

    const higherVersion = isValidApiVersion({ apiVersion: "2030101802" });
    expect(higherVersion).toBeTruthy();
  });

  it("screens for different apiVersion", async () => {
    const validSetupVersion = { apiVersion: "2019101802"};
    const validVersionComponent = renderer.create(
      <AuthContext.Provider value={{setup: validSetupVersion}} >
        <AppModal />
      </AuthContext.Provider>
    );
    expect(validVersionComponent.toJSON()).toMatchSnapshot();

    const oldSetupVersion = { apiVersion: "2010101802"};
    const oldVersionComponent = renderer.create(
      <AuthContext.Provider value={{setup: oldSetupVersion}} >
        <AppModal />
      </AuthContext.Provider>
    );
    expect(oldVersionComponent.toJSON()).toMatchSnapshot();

    const higherSetupVersion = { apiVersion: "2030101802"};
    const higherVersionComponent = renderer.create(
      <AuthContext.Provider value={{setup: higherSetupVersion}} >
        <AppModal />
      </AuthContext.Provider>
    );
    expect(higherVersionComponent.toJSON()).toMatchSnapshot();
  });
});
