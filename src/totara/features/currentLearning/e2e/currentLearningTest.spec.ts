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

import { by, device, element } from "detox";
import { DEV_ORG_URL, DEV_USERNAME, DEV_PASSWORD } from "../../../lib/constants";
import { CL_TEST_IDS, TEST_IDS } from "../../../lib/testIds";
import { startGraphQLServer, stopGraphQLServer } from "../../../../../e2e/graphql/index";
import { defaultCoreId, defaultCoreDate, defaultString } from "../../../../../e2e/graphql/mocks/scalars";
import { currentLearning } from "../../../../../e2e/graphql/mocks/currentLearning";
import { courseDetails } from "../../../../../e2e/graphql/mocks/courseDetails";
import { mobileMe } from "../../../../../e2e/graphql/mocks/me";

const customMocks = {
  ...defaultCoreId,
  ...defaultCoreDate,
  ...defaultString,

  Query: () => ({ ...mobileMe.default, ...currentLearning.default, ...courseDetails.default })
};

describe("Current learning test", () => {
  beforeAll(async () => {
    await startGraphQLServer(customMocks);
    await device.reloadReactNative();
    await device.launchApp({ newInstance: true, permissions: { notifications: "YES" } });
  });
  afterAll(async () => {
    stopGraphQLServer();
  });
  it("should have organization url input and native login", async () => {
    await element(by.id(TEST_IDS.SITE_URL_INPUT)).clearText();
    await element(by.id(TEST_IDS.SITE_URL_INPUT)).typeText(DEV_ORG_URL);
    await element(by.id(TEST_IDS.SUBMIT_URL)).tap();
    await element(by.id(TEST_IDS.USER_INPUT)).typeText(DEV_USERNAME);
    await element(by.id(TEST_IDS.USER_PW)).typeText(DEV_PASSWORD);
    await element(by.id(TEST_IDS.LOGIN)).tap();
  });

  it("should have user landing on current learning and switch to the list view", async () => {
    await element(by.id(CL_TEST_IDS.SWITCH)).tap();
  });

  it("should navigate to the course and view course overview", async () => {
    await element(by.id("learningItem_1")).tap();
    await element(by.id(CL_TEST_IDS.PROGRESS)).tap();
    await element(by.id(TEST_IDS.CLICK_CLOSE)).tap();
  });

  it("should navigate to the course activity list and activity", async () => {
    await element(by.id(CL_TEST_IDS.TAB_2)).tap();
    let shouldContinue = true;
    let i = 0;
    while (shouldContinue) {
      try {
        await element(by.id(`sectionItem_${i}`)).tap();
      } catch (e) {
        i += 1;
        await element(by.id(CL_TEST_IDS.LIST)).tap();
        if (i == 2) shouldContinue = false;
      }
    }
  });
});
