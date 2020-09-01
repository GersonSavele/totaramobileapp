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

import React, { useContext, useEffect } from "react";
import { createAppContainer } from "react-navigation";
import AsyncStorage from "@react-native-community/async-storage";
import * as Sentry from "@sentry/react-native";
import { PersistGate } from "redux-persist/integration/react";
import { Provider, useSelector } from "react-redux";
import { store, persistor } from "./totara/store";

import { AuthProvider } from "@totara/core/AuthProvider";
import { AuthFlow } from "@totara/auth/AuthFlow";
import { AdditionalAction } from "@totara/auth/additional-actions";
import { ThemeProvider, ThemeContext } from "@totara/theme";
import { FeatureNavigator } from "@totara/features";
import AttemptSynchronizer from "@totara/activities/scorm/AttemptSynchronizer";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { config } from "@totara/lib";
import { NAVIGATION } from "@totara/lib/navigation";
import FontAwesome from "@totara/lib/fontAwesome";
import NotificationCenter from "@totara/lib/notificationCenter";
import ResourceManager from "@totara/lib/resourceManager";
import { createStackNavigator } from "react-navigation-stack";
import { scormStack } from "@totara/features/activities/scorm/ScormActivity";
import AboutStack from "@totara/features/about/AboutStack";
import { LocaleResolver } from "@totara/locale/LocaleResolver";
import { useMutation } from "@apollo/react-hooks";

import { gql } from "apollo-boost";
import messaging from "@react-native-firebase/messaging";
import { tokenSent, updateToken } from "./totara/actions/notification";

const { SCORM_STACK_ROOT, ABOUT } = NAVIGATION;

// this check will make sure we only use sentry for production flavors
if (!__DEV__ && config.sentryUri) {
  Sentry.init({
    dsn: config.sentryUri,
    environment: "production"
  });
}

FontAwesome.init();

const App: () => React$Node = () => {
  return (
    <AuthProvider asyncStorage={AsyncStorage}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthFlow>
            <LocaleResolver>
              <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                  <AppContainer />
                </PersistGate>
                <AdditionalAction />
                <AttemptSynchronizer />
              </Provider>
            </LocaleResolver>
          </AuthFlow>
        </ThemeProvider>
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

const mutationForToken = gql`
  mutation totara_mobile_set_fcmtoken($token: String) {
    set_fcmtoken: totara_mobile_set_fcmtoken(token: $token)
  }
`;

const AppContainer = () => {
  NotificationCenter.requestUserPermission();
  NotificationCenter.handleMessagesInBackground();
  ResourceManager.resumeDownloads();

  const notificationState = useSelector((state: RootState) => state.notificationReducer);
  const [sendToken] = useMutation(mutationForToken);

  useEffect(() => {
    messaging()
      .getToken()
      .then((token) => {
        console.debug("TOKEN=========>", token);
        updateToken({ token: token });
      });

    messaging().onNotificationOpenedApp((remoteMessage) => {
      //THIS HANDLING WILL BE IMPLEMENTED IN MOB-700
      console.debug("notification ===>", remoteMessage.notification);
      console.debug("notification data ===>", remoteMessage.data);
    });

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          //THIS HANDLING WILL BE IMPLEMENTED IN MOB-700
          console.debug("notification ===>", remoteMessage.notification);
          console.debug("notification data ===>", remoteMessage.data);
        }
      });

    messaging().onMessage(async (remoteMessage) => {
      //THIS HANDLING WILL BE IMPLEMENTED IN MOB-700
      console.debug(remoteMessage);
    });

    return () => {
      messaging().onTokenRefresh((token) => {
        updateToken({ token: token });
      });
    }
  }, []);

  useEffect(() => {
    const send = !notificationState.tokenSent;
    if (send) {
      sendToken({ variables: { token: notificationState.token } })
        .then((success) => {
          console.debug(success);
          tokenSent({ tokenSent: true });
        })
        .catch((err) => {
          console.debug(err);
        });
    }
  }, [notificationState?.tokenSent]);

  const [theme] = useContext(ThemeContext);
  const AppMainNavigation = createAppContainer(rootStack());

  return <AppMainNavigation screenProps={{ theme: theme }} />;
};

export default App;
