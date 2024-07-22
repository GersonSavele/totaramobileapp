import { TEST_IDS } from '../../src/totara/lib/testIds';

export class NativeLoginScreen {
  static usernameTextInput = element(by.id(TEST_IDS.USER_INPUT));
  static passwordTextInput = element(by.id(TEST_IDS.USER_PW));
  static enterButton = element(by.id(TEST_IDS.LOGIN));

  static async typeIntoUsernameInput(text: string) {
    await this.usernameTextInput.typeText(text);
  }

  static async typeIntoPasswordInput(text: string) {
    await this.passwordTextInput.typeText(text);
    await this.passwordTextInput.tapReturnKey();
  }

  static async tapEnterButton() {
    await this.enterButton.tap();
  }
}
