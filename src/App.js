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

import ActivitySheetWrapper from "@totara/activities/ActivitySheetWrapper";
import { AuthProvider } from "@totara/core/AuthProvider";
import { AuthFlow } from "@totara/auth/AuthFlow";
import { AdditionalAction } from "@totara/auth/additional-actions";
import { AppModal } from "@totara/components";
import { ThemeProvider, ThemeContext } from "@totara/theme";
import { FeatureNavigator } from "@totara/features";
import ResourceManager from "@totara/core/ResourceManager/ResourceManager";
import { AttemptSynchronizer } from "@totara/activities/scorm/offline";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { config } from "@totara/lib";
import FontAwesome from "@totara/lib/fontAwesome";
import NotificationCenter from "@totara/lib/notificationCenter";

Sentry.init({
  dsn: config.sentryUri,
});

NotificationCenter.handleMessagesInBackground();

FontAwesome.init();

const App: () => React$Node = () => {
  useEffect(() => {
    new ResourceManager().init();
  }, []);

  return (
    <AuthProvider asyncStorage={AsyncStorage}>
      <ThemeProvider>
        <SafeAreaProvider>
          <AuthFlow>
            <ActivitySheetWrapper>
              <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                  <AppContainer />
                </PersistGate>
              </Provider>
            </ActivitySheetWrapper>
            <AdditionalAction />
            <AppModal />
            <AttemptSynchronizer />
          </AuthFlow>
        </SafeAreaProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

const AppContainer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    return NotificationCenter.init(dispatch);
  }, []);

  const [theme] = useContext(ThemeContext);
  const AppMainNavigation = createAppContainer(FeatureNavigator());

  return <AppMainNavigation screenProps={{ theme: theme }} />;
};

export default App;
