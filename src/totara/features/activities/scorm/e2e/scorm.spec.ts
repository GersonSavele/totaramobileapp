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
import { TEST_IDS, CL_TEST_IDS, TEST_IDS_SCORM, NAVIGATION_TEST_IDS, TEST_IDS_RESOURCE } from "../../../../lib/testIds";
import { startGraphQLServer, stopGraphQLServer } from "../../../../../../e2e/graphql/index";
import { defaultCoreId, defaultCoreDate, defaultString } from "../../../../../../e2e/graphql/mocks/scalars";
import { scorm } from "../../../../../../e2e/graphql/mocks/scorm";
import { currentLearning } from "../../../../../../e2e/graphql/mocks/currentLearning";
import { courseDetails } from "../../../../../../e2e/graphql/mocks/courseDetails";
import { mobileMe } from "../../../../../../e2e/graphql/mocks/me";
import { notifications } from "../../../../../../e2e/graphql/mocks/notifications";
import { lang } from "../../../../../../e2e/graphql/mocks/lang";
const customMocks = {
  ...defaultCoreId,
  ...defaultCoreDate,
  ...defaultString,

  Query: () => ({
    ...mobileMe.default,
    ...currentLearning.default,
    ...courseDetails.scorm,
    ...scorm.default,
    ...notifications.default,
    ...lang.default
  })
};
describe("Scorm test", () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await device.launchApp({ newInstance: true, permissions: { notifications: "YES" } });
    await startGraphQLServer(customMocks);
    await element(by.id(TEST_IDS.SITE_URL_INPUT)).clearText();
    await element(by.id(TEST_IDS.SITE_URL_INPUT)).typeText(DEV_ORG_URL);
    await element(by.id(TEST_IDS.SUBMIT_URL)).tap();
    await element(by.id(TEST_IDS.USER_INPUT)).typeText(DEV_USERNAME);
    await element(by.id(TEST_IDS.USER_PW)).typeText(DEV_PASSWORD);
    await element(by.id(TEST_IDS.LOGIN)).tap();
  });

  afterAll(async () => {
    await stopGraphQLServer();
  });

  it("should navigate to the scorm summary screen and complete online work flow", async () => {
    await waitFor(element(by.text("(BETA) Audiences in Totara")))
      .toBeVisible()
      .whileElement(by.id(CL_TEST_IDS.CAROUSEL))
      .scroll(300, "right");
    await element(by.text("(BETA) Audiences in Totara")).tap();
    await element(by.id(CL_TEST_IDS.TAB_2)).tap();
    await element(by.text("Ask Us")).tap();
    await waitFor(element(by.text("Report in Totara Learn")))
      .toBeVisible()
      .whileElement(by.text("Ask Us"))
      .swipe("up", "slow", 0.5);
    await element(by.text("Report in Totara Learn")).tap();
    await element(by.id(TEST_IDS_SCORM.ATTEMPTS_LIST)).tap();
    await element(by.id(NAVIGATION_TEST_IDS.BACK)).atIndex(1).tap();
    await element(by.id(TEST_IDS_SCORM.LAST_ATTEMPT)).tap();
    await element(by.id(NAVIGATION_TEST_IDS.BACK)).atIndex(1).tap();
    await element(by.label("Cancel").and(by.type("_UIAlertControllerActionView"))).tap();
    await element(by.id(NAVIGATION_TEST_IDS.BACK)).atIndex(1).tap();
    //TODO: this is for selecting alert confirmation action button and it needs to check for the android
    await element(by.label("Ok").and(by.type("_UIAlertControllerActionView"))).tap();
    await element(by.id(TEST_IDS_SCORM.NEW_ATTEMPT)).tap();
    await element(by.id(NAVIGATION_TEST_IDS.BACK)).atIndex(1).tap();
    //TODO: this is for selecting alert confirmation action button and it needs to check for the android
    await element(by.label("Cancel").and(by.type("_UIAlertControllerActionView"))).tap();
    await element(by.id(NAVIGATION_TEST_IDS.BACK)).atIndex(1).tap();
    //TODO: this is for selecting alert confirmation action button and it needs to check for the android
    await element(by.label("Ok").and(by.type("_UIAlertControllerActionView"))).tap();
    await element(by.id(NAVIGATION_TEST_IDS.BACK)).atIndex(0).tap();
  });

  it("should be able to follow full offline scorm activity flow", async () => {
    customMocks.Query = () => ({
      ...mobileMe.default,
      ...currentLearning.default,
      ...courseDetails.scorm,
      ...scorm.offline,
      ...notifications.default,
      ...lang.default
    });
    await startGraphQLServer(customMocks);
    await element(by.text("Introduction to User Experience Design")).tap();
    await element(by.id(TEST_IDS_SCORM.DOWNLOAD)).tap();
    await waitFor(element(by.id(TEST_IDS_RESOURCE.DOWNLOADED)))
      .toBeVisible()
      .withTimeout(10000);
    await element(by.id(TEST_IDS_SCORM.NEW_ATTEMPT)).tap();

    await element(by.id(NAVIGATION_TEST_IDS.BACK)).atIndex(1).tap();
    //TODO: this is for selecting alert confirmation action button and it needs to check for the android
    await element(by.label("Cancel").and(by.type("_UIAlertControllerActionView"))).tap();
    await element(by.id(NAVIGATION_TEST_IDS.BACK)).atIndex(1).tap();
    //TODO: this is for selecting alert confirmation action button and it needs to check for the android
    await element(by.label("Ok").and(by.type("_UIAlertControllerActionView"))).tap();
    await element(by.id(NAVIGATION_TEST_IDS.BACK)).atIndex(0).tap();
  });
});
