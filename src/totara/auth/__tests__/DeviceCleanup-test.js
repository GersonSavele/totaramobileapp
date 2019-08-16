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

describe("Deregister the device and cleanup setup in the storage", () => {
  it("Successfully deregistration and cleanup storage",  async () => {
    const clearApollo = jest.fn();
    const setSetup = jest.fn();
    const mockDeleteDevice = Promise.resolve();
    const mockClearStorage = Promise.resolve();
    
    await deviceCleanup(mockDeleteDevice, mockClearStorage, clearApollo, setSetup)
    expect(clearApollo).toHaveBeenCalledTimes(1);
    expect(setSetup).toHaveBeenCalledTimes(1);
  });
  
  it("Handled error on cleanup non-existing storage", async () => {
    const errorNoneExistStorage = new Error("Failed to delete storage directory with");
    const clearApollo = jest.fn();
    const setSetup = jest.fn();
    const mockDeleteDevice = Promise.resolve();
    const mockClearStorageReject = Promise.reject(errorNoneExistStorage);
    await deviceCleanup(mockDeleteDevice, mockClearStorageReject, clearApollo, setSetup);
    expect(clearApollo).toHaveBeenCalledTimes(1);
    expect(setSetup).not.toHaveBeenCalled();
  });

  it("Un-handeled error on deregister the device", async () => {
    const unHandledErrorServer = new Error("Server error");
    const clearApollo = jest.fn();
    const setSetup = jest.fn();
    const mockDeleteDevice = Promise.reject(unHandledErrorServer);
    const mockClearStorageReject = Promise.resolve();
    
    await deviceCleanup(mockDeleteDevice, mockClearStorageReject, clearApollo, setSetup).catch((e) => {
      expect(clearApollo).not.toHaveBeenCalled();
      expect(setSetup).not.toHaveBeenCalled();
      expect(e).toBe(unHandledErrorServer);
    });
  });

  it("Un-handeled error on cleanup the storage", async () => {
    const unHandledErrorStorage = new Error("Un handled errors for clean storage");
    const clearApollo = jest.fn();
    const setSetup = jest.fn();
    const mockDeleteDevice = Promise.resolve();
    const mockClearStorageReject = Promise.reject(unHandledErrorStorage);
    
    await deviceCleanup(mockDeleteDevice, mockClearStorageReject, clearApollo, setSetup).catch((e) => {
      expect(clearApollo).toHaveBeenCalledTimes(1);
      expect(setSetup).not.toHaveBeenCalled();
      expect(e).toBe(unHandledErrorStorage);
    });
  });

  it("All Un-handeled errors", async () => {
    const unHandledErrorServer = new Error("Server error");
    const unHandledErrorStorage = new Error("Un handled errors for clean storage");
    const clearApollo = jest.fn();
    const setSetup = jest.fn();
    const mockDeleteDevice = Promise.reject(unHandledErrorServer);
    const mockClearStorageReject = Promise.reject(unHandledErrorStorage);
    
    await deviceCleanup(mockDeleteDevice, mockClearStorageReject, clearApollo, setSetup).catch((e) => {
      expect(clearApollo).not.toHaveBeenCalled();
      expect(setSetup).not.toHaveBeenCalled();
      expect(e).toBe(unHandledErrorServer);
    });
  });
});