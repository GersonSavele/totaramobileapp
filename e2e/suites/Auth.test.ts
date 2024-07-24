// import { CurrentLearningScreen } from '../screens/CurrentLearningScreen';
import { CurrentLearningScreen } from '../screens/CurrentLearningScreen';
import { NativeLoginScreen } from '../screens/NativeLoginScreen';
import { SiteURLScreen } from '../screens/SiteURLScreen';
import { App } from '../util/App';
import { Session } from '../util/Session';

describe('Demo - Basic app login', () => {
  beforeAll(async () => {
    await App.launch();
  });

  afterAll(async () => {
    await Session.logout();
  });

  test('App login using SiteURL and NativeLoginScreens', async () => {
    // First try log in with a malformed URL
    await SiteURLScreen.typeIntoOrganisationURLInput('not a URL');
    await SiteURLScreen.tapEnterButton();

    // Expect to see the correct feedback message
    await SiteURLScreen.expectInvalidSiteErrorToBeVisible();

    // Then using a valid URL, but one that is not associated with Totara
    await SiteURLScreen.typeIntoOrganisationURLInput('https://google.com');
    await SiteURLScreen.tapEnterButton();

    // Expect to see the relevant error message
    await SiteURLScreen.expectSiteErrorModalToBeVisible();
    await SiteURLScreen.tapSiteErrorModalOKButton();

    // Now enter a valid URL that is associated with Totara
    await SiteURLScreen.typeIntoOrganisationURLInput('https://demo.mobile.sb.totaralms.com');
    await SiteURLScreen.tapEnterButton();

    // Expect to navigate to the Native Login screen
    await NativeLoginScreen.expectToBeOnScreen();

    // Try log in without entering a Username or Password
    await NativeLoginScreen.tapEnterButton();

    // Expect to see the relevant error message
    await NativeLoginScreen.expectInvalidUsernameErrorToBeVisible();
    await NativeLoginScreen.expectInvalidPasswordErrorToBeVisible();

    // Enter an invalid Username and Password combination
    await NativeLoginScreen.typeIntoUsernameInput('invaliduser');
    await NativeLoginScreen.typeIntoPasswordInput('invalidpassword');
    await NativeLoginScreen.tapEnterButton();

    // Expect to see the relevant error message
    await NativeLoginScreen.expectLoginErrorToBeVisible();

    // Enter valid Username and Password and tap enter
    await NativeLoginScreen.typeIntoUsernameInput('testuser');
    await NativeLoginScreen.typeIntoPasswordInput('Totara2022!');
    await NativeLoginScreen.tapEnterButton();

    // Expect to end up on the Current Learning screen
    await CurrentLearningScreen.expectToBeOnScreen();
  });
});
