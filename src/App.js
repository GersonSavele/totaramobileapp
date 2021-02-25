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

import React from "react";
import { StatusBar, Platform } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import * as Sentry from "@sentry/react-native";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { Root } from "native-base";
import ScreenOrientation, { PORTRAIT } from "react-native-orientation-locker/ScreenOrientation";

import { store, persistor } from "./totara/store";
import { AuthProvider } from "@totara/core/AuthProvider";
import AuthFlow from "@totara/auth/AuthFlow";
import { AdditionalAction } from "@totara/auth/additional-actions";
import { ThemeProvider } from "@totara/theme";
import AttemptSynchronizer from "@totara/activities/scorm/AttemptSynchronizer";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { config } from "@totara/lib";
import FontAwesome from "@totara/lib/fontAwesome";
import { LocaleResolver } from "@totara/locale/LocaleResolver";
import AppContainer from './totara/AppContainer'
import { PLATFORM_ANDROID } from './totara/lib/constants';
// this check will make sure we only use sentry for production flavors
if (!__DEV__ && config.sentryUri) {
  Sentry.init({
    dsn: config.sentryUri,
    environment: "production"
  });
}

if (Platform.OS === PLATFORM_ANDROID) {
  StatusBar.setBackgroundColor("rgba(0,0,0,0)")
  StatusBar.setBarStyle("dark-content")
  StatusBar.setTranslucent(true);
}

FontAwesome.init();

const App: () => React$Node = () => {
  return (
    <AuthProvider asyncStorage={AsyncStorage}>
      <SafeAreaProvider>
        <ThemeProvider>
          <Root>
            <AuthFlow>
              <LocaleResolver>
                <Provider store={store}>
                  <PersistGate loading={null} persistor={persistor}>
                    <ScreenOrientation orientation={PORTRAIT} />
                    <AppContainer />
                  </PersistGate>
                  <AdditionalAction />
                  <AttemptSynchronizer />
                </Provider>
              </LocaleResolver>
            </AuthFlow>
          </Root>
        </ThemeProvider>
      </SafeAreaProvider>
    </AuthProvider>
  );
};

export default App;
