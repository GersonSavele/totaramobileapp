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
 * @author Tharaka Dushmantha <tharaka.dushmantha@totaralearning.com>
 */

import renderer from "react-test-renderer";
import React from "react";
import AppStateListener from "../AppStateListener";

const onActive = jest.fn();
const onBackground = jest.fn();
const onInactive = jest.fn();

const stateListener = renderer
  .create(
    <AppStateListener
      onActive={onActive}
      onBackground={onBackground}
      onInactive={onInactive}
    />
  )
  .getInstance();

describe("App is in Active Foreground/active Mode", () => {
  it("Test result : App state should be changed to active state, in when user comes foreground", () => {
    stateListener.handleAppStateChange("active");
    expect(stateListener.state.appState).toBe("active");
    expect(onActive).toHaveBeenCalledTimes(1);
  });
});

describe("App is in Background Mode", () => {
  it("Test result : App state should be changed to background state, in when user comes background", () => {
    stateListener.handleAppStateChange("background");
    expect(stateListener.state.appState).toBe("background");
    expect(onBackground).toHaveBeenCalledTimes(1);
  });
});

describe("App is in inactive Mode", () => {
  it("Test result : App state should be changed to inactive state, in when user comes inactive", () => {
    stateListener.handleAppStateChange("inactive");
    expect(stateListener.state.appState).toBe("inactive");
    expect(onInactive).toHaveBeenCalledTimes(1);
  });
});
