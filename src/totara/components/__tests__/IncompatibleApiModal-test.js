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

import React from "react";
import renderer from "react-test-renderer";

import AppModal from "../IncompatibleApiModal";
import { AuthContext } from "@totara/core";
import { config } from "@totara/lib";

describe("IncompatibleApiModal", () => {
  const authContextState = {
    isAuthenticated: false
  };

  it("it should not show any modal screens for valid apiVersion or disabled minApiVersion", async () => {
    config.minApiVersion = "2019101802";
    const validSetupVersion = { apiVersion: "2019101802" };
    const validVersionComponent = renderer.create(
      <AuthContext.Provider
        value={{
          setup: validSetupVersion,
          authContextState: authContextState
        }}>
        <AppModal />
      </AuthContext.Provider>
    );
    expect(validVersionComponent.toJSON()).toMatchSnapshot();

    const higherSetupVersion = { apiVersion: "2030101802" };
    const higherVersionComponent = renderer.create(
      <AuthContext.Provider
        value={{
          setup: higherSetupVersion,
          authContextState: authContextState
        }}>
        <AppModal />
      </AuthContext.Provider>
    );
    expect(higherVersionComponent.toJSON()).toMatchSnapshot();

    config.minApiVersion = "disabled";
    const disabledAppMinVersionComponent = renderer.create(
      <AuthContext.Provider
        value={{
          setup: validSetupVersion,
          authContextState: authContextState
        }}>
        <AppModal />
      </AuthContext.Provider>
    );
    expect(disabledAppMinVersionComponent.toJSON()).toMatchSnapshot();
  });
  it("it should show error modal screens for incompatible version", async () => {
    config.minApiVersion = "2019101802";
    const oldSetupVersion = { apiVersion: "2010101802" };
    const oldVersionComponent = renderer.create(
      <AuthContext.Provider value={{ setup: oldSetupVersion, authContextState: authContextState }}>
        <AppModal />
      </AuthContext.Provider>
    );
    expect(oldVersionComponent.toJSON()).toMatchSnapshot();
  });
});
