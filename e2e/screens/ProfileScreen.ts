import { PROFILE_TEST_IDS } from '../../src/totara/lib/testIds';

export class ProfileScreen {
  static logoutButton = element(by.id(PROFILE_TEST_IDS.LOGOUT));
  static confirmLogoutAlertYesButton = element(by.label('Yes')).atIndex(0);

  static async tapOnLogoutButton() {
    await this.logoutButton.tap();
  }

  static async tapOnConfirmLogoutAlertYesButton() {
    await this.confirmLogoutAlertYesButton.tap();
  }
}
