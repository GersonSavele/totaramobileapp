import { expect } from 'detox';

import { TEST_IDS } from '../../src/totara/lib/testIds';

export class NativeLoginScreen {
  static usernameTextInput = element(by.id(TEST_IDS.USER_INPUT));
  static usernameTextInputError = element(by.id(TEST_IDS.USER_INPUT_ERROR));
  static passwordTextInput = element(by.id(TEST_IDS.USER_PW));
  static passwordTextInputError = element(by.id(TEST_IDS.USER_PW_ERROR));
  static enterButton = element(by.id(TEST_IDS.LOGIN));
  static loginError = element(by.id(TEST_IDS.NATIVE_LOGIN_ERROR));
  static logo = element(by.id(TEST_IDS.NATIVE_LOGIN_HEADER));

  static async typeIntoUsernameInput(text: string) {
    await this.usernameTextInput.clearText();
    await this.usernameTextInput.typeText(text);
    await this.tapLogoToDismissKeyboard();
  }

  static async typeIntoPasswordInput(text: string) {
    await this.passwordTextInput.clearText();
    await this.passwordTextInput.typeText(text);
    await this.tapLogoToDismissKeyboard();
  }

  static async tapEnterButton() {
    await this.enterButton.tap();
  }

  static async expectToBeOnScreen() {
    await expect(this.usernameTextInput).toBeVisible();
  }

  static async expectInvalidUsernameErrorToBeVisible() {
    await expect(this.usernameTextInputError).toBeVisible();
  }

  static async expectInvalidPasswordErrorToBeVisible() {
    await expect(this.passwordTextInputError).toBeVisible();
  }

  static async tapLogoToDismissKeyboard() {
    await this.logo.tap();
  }

  static async expectLoginErrorToBeVisible() {
    await expect(this.loginError).toBeVisible();
  }
}
