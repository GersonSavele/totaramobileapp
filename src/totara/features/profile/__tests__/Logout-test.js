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
 * @author Jun Yamog <jun.yamog@totaralearning.com
 */

import Logout from "../Logout";

describe("Profile screen", () => {

  it("when logout button is pressed, it would call a mutation to delete device and then logout", async () => {

    const mockMutate = jest.fn(() => Promise.resolve());
    const mockAuth = {
      logOut: jest.fn(() => Promise.resolve())
    };

    await Logout({ mutate: mockMutate, auth: mockAuth });

    expect(mockMutate.mock.calls.length).toBe(1);
    expect(mockAuth.logOut.mock.calls.length).toBe(1);

  });

});