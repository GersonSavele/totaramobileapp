import { expect } from 'detox';

import { TEST_IDS } from '../../src/totara/lib/testIds';

export class SiteURLScreen {
  static urlTextInput = element(by.id(TEST_IDS.SITE_URL_INPUT));
  static urlTextInputError = element(by.id(TEST_IDS.SITE_URL_INPUT_ERROR));
  static enterButton = element(by.id(TEST_IDS.SUBMIT_URL));
  static totaraLogo = element(by.id('totara_logo'));
  static siteErrorModal = element(by.id(TEST_IDS.SITE_ERROR_MODAL));
  static siteErrorModalOKButton = element(by.label('OK'));

  static async typeIntoOrganisationURLInput(text: string) {
    await this.urlTextInput.clearText();
    await this.urlTextInput.typeText(text);
    await this.tapTotaraLogoToDismissKeyboard();
  }

  static async tapTotaraLogoToDismissKeyboard() {
    await this.totaraLogo.tap();
  }

  static async tapEnterButton() {
    await this.enterButton.tap();
  }
  static async tapSiteErrorModalOKButton() {
    await this.siteErrorModalOKButton.tap();
  }

  static async expectToBeOnScreen() {
    await expect(this.totaraLogo).toBeVisible();
  }

  static async expectSiteErrorModalToBeVisible() {
    await expect(this.siteErrorModal).toBeVisible();
  }

  static async expectInvalidSiteErrorToBeVisible() {
    await expect(this.urlTextInputError).toBeVisible();
  }
}
