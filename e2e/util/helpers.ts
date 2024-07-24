import { expect } from 'detox';

export class Helpers {
  /**
   * Checks if a given element is visible in the viewport without failing.
   * This is useful if you just to see if something exists before doing something else
   * without causing the whole test to fail.
   *
   * @param element Element to check exists
   * @returns `true` if it's visible, otherwise `false`
   */
  static async isElementVisible(element: Detox.IndexableNativeElement) {
    try {
      await expect(element).toBeVisible();
      return true;
    } catch (e) {
      return false;
    }
  }
}
