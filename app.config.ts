import type { ConfigContext, ExpoConfig } from '@expo/config';

export default (): ExpoConfig => ({
  slug: 'TotaraMobileApp',
  name: 'TotaraMobileApp',
  version: '1.3.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'totara',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/images/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.totaralearning.TotaraMobileApp',
    buildNumber: '14',
    googleServicesFile: process.env.EAS_BUILD ? process.env.GOOGLE_SERVICES_FILE_IOS : './GoogleService-Info.plist'
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff'
    },
    package: 'com.totaralearning.TotaraMobileApp',
    googleServicesFile: process.env.EAS_BUILD ? process.env.GOOGLE_SERVICES_FILE_ANDROID : './google-services.json'
  },
  plugins: [
    '@react-native-firebase/app',
    [
      'expo-build-properties',
      {
        ios: {
          useFrameworks: 'static'
        },
        android: {
          minSdkVersion: 28
        }
      }
    ],
    "./plugins/notifee-mod.js"
  ],
  experiments: {},
  extra: {
    eas: {
      projectId: '7a0f187a-4f59-4859-8d6e-728e5d65421f'
    }
  },
  owner: 'abletech'
});
