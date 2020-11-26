import { by, device, element } from "detox";
import { TEST_IDS } from "../../lib/constants";

const ORGANIZATION_URL = "mobile.demo.totara.software";
const USER_NAME = "tharakad";
const PASSWORD = "Abcd123$";

describe("User authentication", () => {
  beforeEach(async () => {
    await device.reloadReactNative();
    await device.launchApp({ newInstance: true, permissions: { notifications: "YES" } });
  });

  it("should have organization url input and native login", async () => {
    await element(by.id(TEST_IDS.SITE_URL_INPUT)).clearText();
    await element(by.id(TEST_IDS.SITE_URL_INPUT)).typeText(ORGANIZATION_URL);
    await element(by.id(TEST_IDS.SUBMIT_URL)).tap();
    await element(by.id(TEST_IDS.USER_INPUT)).typeText(USER_NAME);
    await element(by.id(TEST_IDS.USER_PW)).typeText(PASSWORD);
    await element(by.id(TEST_IDS.LOGIN)).tap();
  });
});
