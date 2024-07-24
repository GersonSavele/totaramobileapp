import { expect } from 'detox';

export class CurrentLearningScreen {
  static pageHeader = element(by.id('current_learning_page_header'));

  static async expectToBeOnScreen() {
    await expect(this.pageHeader).toBeVisible();
  }
}
