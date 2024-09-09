import type { ExpoConfig } from '@expo/config';

export default (): ExpoConfig => ({
  slug: 'totara-mobile-app',
  name: 'Totara',
  version: '2.0.0',
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
    buildNumber: '104',
    googleServicesFile: process.env.EAS_BUILD ? process.env.GOOGLE_SERVICES_FILE_IOS : './GoogleService-Info.plist'
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff'
    },
    blockedPermissions: ['android.permission.USE_FULL_SCREEN_INTENT'],
    package: 'com.totaramobileapp',
    googleServicesFile: process.env.EAS_BUILD ? process.env.GOOGLE_SERVICES_FILE_ANDROID : './google-services.json',
    versionCode: 104
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
    './plugins/notifee-mod.js',
    [
      '@sentry/react-native/expo',
      {
        // 'sentry org slug, or use the `SENTRY_ORG` environment variable'
        organization: process.env.SENTRY_ORG,
        // 'sentry project name, or use the `SENTRY_PROJECT` environment variable'
        project: process.env.SENTRY_PROJECT,
        // If you are using a self-hosted instance, update the value of the url property
        // to point towards your self-hosted instance. For example, https://self-hosted.example.com/.
        url: 'https://sentry.io/'
      }
    ]
  ],
  experiments: {},
  extra: {
    eas: {
      projectId: '384245c6-9fab-4b8d-8c3c-77d4d5638f64'
    }
  },
  owner: 'totara'
});
