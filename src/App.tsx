/**
 * This file is part of Totara Enterprise.
 *
 * Copyright (C) 2019 onwards Totara Learning Solutions LTD
 *
 * Totara Enterprise is provided only to Totara Learning Solutions
 * LTD’s customers and partners, pursuant to the terms and
 * conditions of a separate agreement with Totara Learning
 * Solutions LTD or its affiliate.
 *
 * If you do not have an agreement with Totara Learning Solutions
 * LTD, you may not access, use, modify, or distribute this software.
 * Please contact [sales@totaralearning.com] for more information.
 */

import * as Sentry from '@sentry/react-native';
import Loading from '@totara/components/Loading';
import { config } from '@totara/lib';
import { PLATFORM_ANDROID } from '@totara/lib/constants';
import RootContainer from '@totara/RootContainer';
import { persistor, store } from '@totara/store';
import { ThemeProvider } from '@totara/theme';
import type { ReactNode } from 'react';
import React from 'react';
import { LogBox, Platform, StatusBar, Text } from 'react-native';
import FlashMessage from 'react-native-flash-message';
import { OrientationLocker, PORTRAIT } from 'react-native-orientation-locker';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

if (Platform.OS === PLATFORM_ANDROID) {
  StatusBar.setBackgroundColor('rgba(0,0,0,0)');
  StatusBar.setBarStyle('dark-content');
  StatusBar.setTranslucent(true);
} else {
  StatusBar.setBarStyle('default');
}

if (config.disableConsoleYellowBox) {
  LogBox.ignoreAllLogs();
}
LogBox.ignoreLogs(['new NativeEventEmitter']);

Sentry.init({
  dsn: config.sentryDsn,
  debug: false // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
});

const App: () => ReactNode = () => {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={<Loading />} persistor={persistor}>
          <OrientationLocker orientation={PORTRAIT} />
          <ThemeProvider>
            <RootContainer />
          </ThemeProvider>
        </PersistGate>
      </Provider>
      <FlashMessage position="top" />
    </>
  );
};

export default Sentry.wrap(App);
