/**
 * This file is part of Totara Mobile
 *
 * Copyright (C) 2019 onwards Totara Learning Solutions LTD
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @author Jun Yamog <jun.yamog@totaralearning.com
 *
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
import { NAVIGATION, NAVIGATION_SCORM_STACK_ROOT } from "@totara/lib/constants";
import FontAwesome from "@totara/lib/fontAwesome";
import NotificationCenter from "@totara/lib/notificationCenter";
import CoreResourceManager from "@totara/core/ResourceManager/ResourceManager";
import ResourceManager from "@totara/lib/resourceManager";
import { createStackNavigator } from "react-navigation-stack";
import { scormStack } from "@totara/activities/scorm/ScormActivity";
import AboutStack from "@totara/features/about/AboutStack";

if (!__DEV__) {
  Sentry.init({
    dsn: config.sentryUri
  });
}

FontAwesome.init();

NotificationCenter.handleMessagesInBackground();

ResourceManager.resumeDownloads();

const App: () => React$Node = () => {
  useEffect(() => {
    new CoreResourceManager().init();
  }, []);

  return (
    <AuthProvider asyncStorage={AsyncStorage}>
      <ThemeProvider>
        <SafeAreaProvider>
          <AuthFlow>
            <Provider store={store}>
              <PersistGate loading={null} persistor={persistor}>
                <AppContainer />
              </PersistGate>
            </Provider>
            <AdditionalAction />
            <AttemptSynchronizer />
          </AuthFlow>
        </SafeAreaProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

const rootStack = () =>
  createStackNavigator(
    {
      FeatureNavigator: {
        screen: FeatureNavigator()
      },
      [NAVIGATION_SCORM_STACK_ROOT]: {
        screen: scormStack
      },
      [NAVIGATION.NAVIGATION_ABOUT]: {
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
