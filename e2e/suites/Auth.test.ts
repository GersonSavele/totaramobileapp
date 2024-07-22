import { expect } from 'detox';

import { CurrentLearningScreen } from '../screens/CurrentLearningScreen';
import { NativeLoginScreen } from '../screens/NativeLoginScreen';
import { SiteURLScreen } from '../screens/SiteURLScreen';
import { App } from '../util/App';

describe('Demo - Basic app login', () => {
  beforeEach(async () => {
    await App.launch();
  });

  it('Should log in the app', async () => {
    // Enter the correct URL into the SiteURL screen
    await SiteURLScreen.typeIntoOrganisationURLInput('https://demo.mobile.sb.totaralms.com');
    await SiteURLScreen.tapOnTotaraLogoToDismissKeyboard();
    await SiteURLScreen.tapEnterButton();

    // Enter your credentials to complete login
    await NativeLoginScreen.typeIntoUsernameInput('testuser');
    await NativeLoginScreen.typeIntoPasswordInput('Totara2022!');
    await NativeLoginScreen.tapEnterButton();

    // Expect to be on the Current Learning Screen
    expect(CurrentLearningScreen.pageHeader).toBeVisible();
  });
});
