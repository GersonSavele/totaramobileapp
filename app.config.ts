import type { ExpoConfig } from '@expo/config';

export default (): ExpoConfig => ({
  slug: 'totara-mobile-app',
  name: 'Totara',
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
    package: 'com.totaramobileapp',
    googleServicesFile: process.env.EAS_BUILD ? process.env.GOOGLE_SERVICES_FILE_ANDROID : './google-services.json'
  },
  plugins: [
    '@react-native-firebase/app',
    [
      'expo-build-properties',
      {
        ios: {
          useFrameworks: 'static',
          deploymentTarget: '13.4'
        },
        android: {
          minSdkVersion: 28
        }
      }
    ],
    [
      'app-icon-badge',
      {
        enabled: process.env.APP_ENV !== 'prod',
        badges: [
          {
            text: process.env.APP_ENV,
            type: 'banner',
            color: 'white',
            background: '#000000'
          }
        ]
      }
    ],
    '@config-plugins/detox',
    './plugins/notifee-mod.js'
  ],
  experiments: {},
  extra: {
    eas: {
      projectId: '384245c6-9fab-4b8d-8c3c-77d4d5638f64'
    }
  },
  owner: 'totara'
});
