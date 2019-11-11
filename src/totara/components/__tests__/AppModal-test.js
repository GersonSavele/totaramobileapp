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
import renderer from "react-test-renderer";

import AppModal from "../AppModal";
import { AuthContext } from "@totara/auth/AuthContext";
import { config } from "@totara/lib";

describe("AppModal", () => {
  config.minApiVersion = "2019101802";
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

    config.minApiVersion = "disabled";
    const disabledAppMinVersionComponent = renderer.create(
      <AuthContext.Provider value={{setup: validSetupVersion}} >
        <AppModal />
      </AuthContext.Provider>
    );
    expect(disabledAppMinVersionComponent.toJSON()).toMatchSnapshot();
  });
});
