import { CurrentLearningScreen, NativeLoginScreen, SiteURLScreen } from '../screens';
import { App, Session } from '../util';

beforeAll(App.launch);

afterAll(Session.logout);

describe('Login flow - SiteURL', () => {
  describe('when a malformed URL is entered', () => {
    it('should show the expected error message', async () => {
      await SiteURLScreen.typeIntoOrganisationURLInput('not a URL');
      await SiteURLScreen.tapEnterButton();
      await SiteURLScreen.typeIntoOrganisationURLInput('not a URL');

      await SiteURLScreen.expectInvalidSiteErrorToBeVisible();
    });
  });

  describe('when a valid URL is entered', () => {
    describe('but it is not associated with Totara', () => {
      it('should show the expected error modal', async () => {
        await SiteURLScreen.typeIntoOrganisationURLInput('https://google.com');
        await SiteURLScreen.tapEnterButton();

        await SiteURLScreen.expectSiteErrorModalToBeVisible();
        await SiteURLScreen.tapSiteErrorModalOKButton();
      });
    });

    describe('and it is associated with Totara', () => {
      it('should navigate to the NativeLogin Screen', async () => {
        await SiteURLScreen.typeIntoOrganisationURLInput('https://demo.mobile.sb.totaralms.com');
        await SiteURLScreen.tapEnterButton();

        await NativeLoginScreen.expectToBeOnScreen();
      });
    });
  });
});

describe('Login flow - NativeLogin', () => {
  describe('when no Username or Password are entered', () => {
    it('should show the expected error messages', async () => {
      await NativeLoginScreen.tapEnterButton();

      await NativeLoginScreen.expectInvalidUsernameErrorToBeVisible();
      await NativeLoginScreen.expectInvalidPasswordErrorToBeVisible();
    });
  });

  describe('when an invalid Username and Password combination is entered', () => {
    it('should show the expected form error message', async () => {
      await NativeLoginScreen.typeIntoUsernameInput('invaliduser');
      await NativeLoginScreen.typeIntoPasswordInput('invalidpassword');
      await NativeLoginScreen.tapEnterButton();

      await NativeLoginScreen.expectLoginErrorToBeVisible();
    });
  });

  describe('when a valid Username and Password combination is entered', () => {
    it('should navigate to the Current Leaning screen', async () => {
      await NativeLoginScreen.typeIntoUsernameInput('testuser');
      await NativeLoginScreen.typeIntoPasswordInput('Totara2022!');
      await NativeLoginScreen.tapEnterButton();

      await CurrentLearningScreen.expectToBeOnScreen();
    });
  });
});
