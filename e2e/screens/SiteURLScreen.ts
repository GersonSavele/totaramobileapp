import { TEST_IDS } from '../../src/totara/lib/testIds';

export class SiteURLScreen {
  static urlTextInput = element(by.id(TEST_IDS.SITE_URL_INPUT));
  static enterButton = element(by.id(TEST_IDS.SUBMIT_URL));
  static totaraLogo = element(by.id('totara_logo'));

  static async typeIntoOrganisationURLInput(text: string) {
    await this.urlTextInput.clearText();
    await this.urlTextInput.typeText(text);
  }

  static async tapOnTotaraLogoToDismissKeyboard() {
    await this.totaraLogo.tap();
  }

  static async tapEnterButton() {
    await this.enterButton.tap();
  }
}
