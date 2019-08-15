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

import deviceCleanup from "../DeviceCleanup";

describe("DeviceCleanup will deregister the device record and cleanup setup in the storage", () => {
  it("Only one chain of promises and cleanup storage should be the end", async () => {
    const setSetup = jest.fn();
    const mockClearStorage = Promise.resolve();
    const mockDeleteDevice = Promise.resolve();

    expect.assertions(1);
    const testResult = deviceCleanup(mockDeleteDevice, mockClearStorage, setSetup);
    await expect(testResult).resolves.toBe(mockClearStorage.resolves);
  });
});