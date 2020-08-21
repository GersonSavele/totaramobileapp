/**
 * This file is part of Totara Enterprise.
 *
 * Copyright (C) 2020 onwards Totara Learning Solutions LTD
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
import { NotificationBell } from "@totara/components";

describe("NotificationBell", () => {
  const tintColor = "red"; //COLOR DOES NOT MAKES ANY DIFFERENCE

  it("active with zero notifications", async () => {
    const active = true;
    const counting = 0;
    const notificationBell = renderer.create(
      <NotificationBell active={active} tintColor={tintColor} counting={counting} />
    );
    expect(notificationBell.toJSON()).toMatchSnapshot();
  });

  it("active with 10 notifications", async () => {
    const active = true;
    const counting = 10;
    const notificationBell = renderer.create(
      <NotificationBell active={active} tintColor={tintColor} counting={counting} />
    );
    expect(notificationBell.toJSON()).toMatchSnapshot();
  });

  it("inactive with 100 notifications", async () => {
    const active = false;
    const counting = 100;
    const notificationBell = renderer.create(
      <NotificationBell active={active} tintColor={tintColor} counting={counting} />
    );
    expect(notificationBell.toJSON()).toMatchSnapshot();
  });
});
