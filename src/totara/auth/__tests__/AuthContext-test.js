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

import { isCompatible, isValidApiVersion } from "@totara/auth/AuthContext";
import { config } from "@totara/lib";

describe("AppModal", () => {
  it("should returns available features for current older and higher API version", async () => {
    config.minApiVersion = "2019101802";
    const validVersion = isCompatible("2019101802");
    expect(validVersion).toEqual([1]);
    
    const oldVersion = isCompatible("2010101802");
    expect(oldVersion).toEqual([]);

    const higherVersion = isCompatible("2030101802");
    expect(higherVersion).toEqual([1]);

    config.minApiVersion = "disabled";
    const disabledAppMinVersion = isCompatible("2030101802");
    expect(disabledAppMinVersion).toEqual([1]);
  });

  it("should returns true for `disabled` or valid `minApiVersion` ", () => {
    config.minApiVersion = "2019101802";
  
    const validVersion = isValidApiVersion("2019101802");
    expect(validVersion).toBeTruthy();

    const higherVersion = isValidApiVersion("2030101802");
    expect(higherVersion).toBeTruthy();

    config.minApiVersion = "disabled";
    const disabledAppMinVersion = isValidApiVersion("2030101802");
    expect(disabledAppMinVersion).toBeTruthy();
    
  });

  it("should returns false for undefined, null or invalid `minApiVersion` ", () => {
    config.minApiVersion = "2019101802";

    const oldVersion = isValidApiVersion("2010101802");
    expect(oldVersion).toBeFalsy();

    const undefinedVersion = isValidApiVersion(undefined);
    expect(undefinedVersion).toBeFalsy();

    const nullVersion = isValidApiVersion(null);
    expect(nullVersion).toBeFalsy();
  });
});