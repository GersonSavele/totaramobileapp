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

import { by, device, element, waitFor } from "detox";
import { DEV_ORG_URL, DEV_USERNAME, DEV_PASSWORD } from "../../../../lib/constants";
import { TEST_IDS, CL_TEST_IDS, TEST_IDS_SCORM } from "../../../../lib/testIds";

describe("Scorm test", () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await device.launchApp({ newInstance: false, permissions: { notifications: "YES" } });
    await element(by.id(TEST_IDS.SITE_URL_INPUT)).clearText();
    await element(by.id(TEST_IDS.SITE_URL_INPUT)).typeText(DEV_ORG_URL);
    await element(by.id(TEST_IDS.SUBMIT_URL)).tap();
    await element(by.id(TEST_IDS.USER_INPUT)).typeText(DEV_USERNAME);
    await element(by.id(TEST_IDS.USER_PW)).typeText(DEV_PASSWORD);
    await element(by.id(TEST_IDS.LOGIN)).tap();
  });

  it("should navigate user to the scorm summary screen", async () => {
    await waitFor(element(by.text("(BETA) Audiences in Totara")))
      .toBeVisible()
      .whileElement(by.id("CAROUSEL"))
      .scroll(300, "right");
    await element(by.text("(BETA) Audiences in Totara")).tap();
    await element(by.id(CL_TEST_IDS.CL_TAB_2_ID)).tap();
    await element(by.text("Ask Us")).tap();
    await waitFor(element(by.text("Report in Totara Learn")))
      .toBeVisible()
      .whileElement(by.text("Ask Us"))
      .swipe("up", "slow", 0.5);
    await element(by.text("Report in Totara Learn")).tap();
    await element(by.id(TEST_IDS_SCORM.NEW_ATTEMPT)).tap();
  });
});
