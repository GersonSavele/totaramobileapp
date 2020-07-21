/**
 * This file is part of Totara Enterprise.
 *
 * Copyright (C) 2020 onwards Totara Learning Solutions LTD
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

import React, { useContext, useEffect } from "react";
import { createAppContainer } from "react-navigation";
import AsyncStorage from "@react-native-community/async-storage";
import * as Sentry from "@sentry/react-native";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { store, persistor } from "./totara/store";
import { useDispatch } from "react-redux";

import { AuthProvider } from "@totara/core/AuthProvider";
import { AuthFlow } from "@totara/auth/AuthFlow";
import { AdditionalAction } from "@totara/auth/additional-actions";
import { ThemeProvider, ThemeContext } from "@totara/theme";
import { FeatureNavigator } from "@totara/features";
import { AttemptSynchronizer } from "@totara/activities/scorm/offline";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { config } from "@totara/lib";
import { NAVIGATION } from "@totara/lib/navigation";
import FontAwesome from "@totara/lib/fontAwesome";
import NotificationCenter from "@totara/lib/notificationCenter";
import ResourceManager from "@totara/lib/resourceManager";
import { createStackNavigator } from "react-navigation-stack";
import { scormStack } from "@totara/activities/scorm/ScormActivity";
import AboutStack from "@totara/features/about/AboutStack";
import { LocaleResolver } from "@totara/locale/LocaleResolver";

const { SCORM_STACK_ROOT, ABOUT } = NAVIGATION;

if (!__DEV__) {
  Sentry.init({
    dsn: config.sentryUri
  });
}

FontAwesome.init();

NotificationCenter.handleMessagesInBackground();

ResourceManager.resumeDownloads();

const App: () => React$Node = () => {
  return (
    <AuthProvider asyncStorage={AsyncStorage}>
      <SafeAreaProvider>
        <AuthFlow>
          <ThemeProvider>
            <LocaleResolver>
              <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                  <AppContainer />
                </PersistGate>
                <AdditionalAction />
                <AttemptSynchronizer />
              </Provider>
            </LocaleResolver>
          </ThemeProvider>
        </AuthFlow>
      </SafeAreaProvider>
    </AuthProvider>
  );
};

const rootStack = () =>
  createStackNavigator(
    {
      FeatureNavigator: {
        screen: FeatureNavigator()
      },
      [SCORM_STACK_ROOT]: {
        screen: scormStack
      },
      [ABOUT]: {
        screen: AboutStack
      }
    },
    {
      mode: "modal",
      headerMode: "none"
    }
  );

const AppContainer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    return NotificationCenter.init(dispatch);
  }, []);

  const [theme] = useContext(ThemeContext);
  const AppMainNavigation = createAppContainer(rootStack());

  return <AppMainNavigation screenProps={{ theme: theme }} />;
};

export default App;
