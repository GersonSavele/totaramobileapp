import { expect } from 'detox';

import { CurrentLearningScreen } from '../screens/CurrentLearningScreen';
import { NativeLoginScreen } from '../screens/NativeLoginScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SiteURLScreen } from '../screens/SiteURLScreen';
import { TabBar } from './TabBar';

export class Session {
  static async login() {
    // Enter the correct URL into the SiteURL screen
    await SiteURLScreen.typeIntoOrganisationURLInput('https://demo.mobile.sb.totaralms.com');
    await SiteURLScreen.tapTotaraLogoToDismissKeyboard();
    await SiteURLScreen.tapEnterButton();

    // Enter your credentials to complete login
    await NativeLoginScreen.typeIntoUsernameInput('testuser');
    await NativeLoginScreen.typeIntoPasswordInput('Totara2022!');
    await NativeLoginScreen.tapEnterButton();

    // Expect to be on the Current Learning Screen
    await expect(CurrentLearningScreen.pageHeader).toBeVisible();
  }

  static async logout() {
    // Go to the Profile Screen
    await TabBar.tapOnProfileButton();

    // Tap and confirm logout
    await ProfileScreen.tapOnLogoutButton();
    await ProfileScreen.tapOnConfirmLogoutAlertYesButton();

    // Expect to be on the SiteURL screen
    await expect(SiteURLScreen.totaraLogo).toBeVisible();
  }
}
