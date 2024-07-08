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

import React, { ReactNode } from "react";
import { StatusBar, Platform, LogBox, Text, SafeAreaView, NativeModules } from "react-native";

import { config } from "@totara/lib";
import RootContainer from "@totara/RootContainer";
import { PLATFORM_ANDROID } from "@totara/lib/constants";
import { store, persistor } from "@totara/store";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import Loading from "@totara/components/Loading";
import { ThemeProvider } from "@totara/theme";
import { OrientationLocker, PORTRAIT } from "react-native-orientation-locker";
import { NativeBaseProvider } from "native-base";

if (Platform.OS === PLATFORM_ANDROID) {
  StatusBar.setBackgroundColor("rgba(0,0,0,0)");
  StatusBar.setBarStyle("dark-content");
  StatusBar.setTranslucent(true);
} else {
  StatusBar.setBarStyle("default");
}

if (config.disableConsoleYellowBox) {
  LogBox.ignoreAllLogs();
}
LogBox.ignoreLogs(["new NativeEventEmitter"]);


const App: () => ReactNode = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={<Loading />} persistor={persistor}>
          <OrientationLocker orientation={PORTRAIT} />
          <ThemeProvider>
            <NativeBaseProvider>
              <RootContainer />
            </NativeBaseProvider>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </SafeAreaView>
  );
};

export default App;
