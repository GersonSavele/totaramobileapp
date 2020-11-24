import { by, device, expect, element } from "detox";
import { TEST_IDS, CL_TEST_IDS } from "../src/totara/lib/constants";

describe("User authentication", () => {
  beforeEach(async () => {
    await device.reloadReactNative();
    await device.launchApp({ newInstance: true, permissions: { notifications: "YES" } });
  });

  it("should have organization url input and native login", async () => {
    await element(by.id(TEST_IDS.SITE_URL_INPUT)).clearText();
    await expect(element(by.id("SITE_URL_INPUT"))).toBeVisible();
    await element(by.id(TEST_IDS.SITE_URL_INPUT)).typeText("mobile.demo.totara.software");
    await element(by.id(TEST_IDS.SUBMIT_URL)).tap();
    await element(by.id(TEST_IDS.USER_INPUT)).typeText("tharakad");
    await element(by.id(TEST_IDS.USER_PW)).typeText("Abcd123$");
    await element(by.id(TEST_IDS.LOGIN)).tap();
  });

  it("should have user landing on current learning and switch to the list view and current learning", async () => {
    await element(by.id(CL_TEST_IDS.CL_SWITCH_ID)).tap();
    await element(by.id("learningItem_2")).tap();
    await element(by.id(CL_TEST_IDS.CL_TAB_2_ID)).tap();
  });

  it("should have scroll carousal and navigate to the learning item", async () => {
    await element(by.id(CL_TEST_IDS.CAROUSEL_WRAPPER_ID)).tap();
    await element(by.id(CL_TEST_IDS.CL_PROGRESS)).tap();
    await element(by.id(TEST_IDS.CLICK_CLOSE)).tap();

    await element(by.id(CL_TEST_IDS.CL_TAB_2_ID)).tap();
    let shouldContinue = true;
    let i = 0;
    while (shouldContinue) {
      try {
        await element(by.id(`sectionItem_${i}`)).tap();
      } catch (e) {
        i += 1;
        await element(by.id(CL_TEST_IDS.CL_LIST)).tap();
        if (i == 2) shouldContinue = false;
      }
    }
  });

  it("should have scroll list item and navigate to the learning item", async () => {
    await element(by.id(CL_TEST_IDS.CL_SWITCH_ID)).tap();
    await element(by.id("learningItem_2")).tap();
    await element(by.id(CL_TEST_IDS.CL_TAB_2_ID)).tap();
    let shouldContinue = true;
    let i = 0;
    while (shouldContinue) {
      try {
        await element(by.id(`sectionItem_${i}`)).tap();
      } catch (e) {
        await element(by.id(CL_TEST_IDS.CL_LIST)).tap();
        shouldContinue = false;
      }
    }
  });
});
