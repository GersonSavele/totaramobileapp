/**
 * This file is part of Totara Mobile
 *
 * Copyright (C) 2020 onwards Totara Learning Solutions LTD
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
 * @author: Rodrigo Mathias <rodrigo.mathias@totaralearning.com>
 */

import React from "react";
import renderer from "react-test-renderer";
import {NotificationBell} from "@totara/components";

describe("NotificationBell", () => {
    const tintColor = "red"; //COLOR DOES NOT MAKES ANY DIFFERENCE

    it("active with zero notifications", async () => {
        const active = true;
        const counting = 0;
        const notificationBell = renderer.create(
            <NotificationBell active={active} tintColor={tintColor} counting={counting}/>
        );
        expect(notificationBell.toJSON()).toMatchSnapshot();
    });

    it("active with 10 notifications", async () => {
        const active = true;
        const counting = 10;
        const notificationBell = renderer.create(
            <NotificationBell active={active} tintColor={tintColor} counting={counting}/>
        );
        expect(notificationBell.toJSON()).toMatchSnapshot();
    });

    it("inactive with 100 notifications", async () => {
        const active = false;
        const counting = 100;
        const notificationBell = renderer.create(
            <NotificationBell active={active} tintColor={tintColor} counting={counting}/>
        );
        expect(notificationBell.toJSON()).toMatchSnapshot();
    });
});