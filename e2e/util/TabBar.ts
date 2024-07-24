import { TAB_TEST_IDS } from '../../src/totara/lib/testIds';

export class TabBar {
  static profileButton = element(by.id(TAB_TEST_IDS.PROFILE));

  static async tapOnProfileButton() {
    await this.profileButton.tap();
  }
}
