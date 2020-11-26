import { by, device, element } from "detox";
import { TEST_IDS } from "../../lib/constants";

enum typeText {
  organizationUrl = "mobile.demo.totara.software",
  userName = "tharakad",
  password = "Abcd123$"
}

describe("User authentication", () => {
  beforeEach(async () => {
    await device.reloadReactNative();
    await device.launchApp({ newInstance: true, permissions: { notifications: "YES" } });
  });

  it("should have organization url input and native login", async () => {
    await element(by.id(TEST_IDS.SITE_URL_INPUT)).clearText();
    await element(by.id(TEST_IDS.SITE_URL_INPUT)).typeText(typeText.organizationUrl);
    await element(by.id(TEST_IDS.SUBMIT_URL)).tap();
    await element(by.id(TEST_IDS.USER_INPUT)).typeText(typeText.userName);
    await element(by.id(TEST_IDS.USER_PW)).typeText(typeText.password);
    await element(by.id(TEST_IDS.LOGIN)).tap();
  });
});
