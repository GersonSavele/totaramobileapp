/**
 * This file is part of Totara Enterprise.
 *
 * Copyright (C) 2021 onwards Totara Learning Solutions LTD
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

import React, { useEffect } from "react";
import messaging from "@react-native-firebase/messaging";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { registerPushNotifications } from "@totara/lib/notificationService";
import ResourceManager from "@totara/lib/resourceManager";
import { createStackNavigator } from "@react-navigation/stack";
import { scormStack } from "@totara/features/activities/scorm/ScormActivity";
import AboutStack from "@totara/features/about/AboutStack";
import { tokenSent, updateToken } from "./actions/notification";
import { navigate, navigationRef } from "./lib/navigationService";
import { NAVIGATION } from "./lib/navigation";
import { useSelector } from "react-redux";
import { mutationForToken, notificationsQuery } from "./features/notifications/api";
import { RootState } from "./reducers";
import { createCompatNavigatorFactory } from "@react-navigation/compat";
import TabContainer from "./TabContainer";
import { NavigationContainer } from "@react-navigation/native";
import WebViewStack from "./features/activities/webview/WebViewStack";

const { SCORM_STACK_ROOT, ABOUT, WEBVIEW_ACTIVITY } = NAVIGATION;

const RootStack = createCompatNavigatorFactory(createStackNavigator)(
  {
    FeatureNavigator: {
      screen: TabContainer
    },
    [SCORM_STACK_ROOT]: {
      screen: scormStack
    },
    [WEBVIEW_ACTIVITY]: {
      screen: WebViewStack
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

const RootContainer = () => {
  ResourceManager.resumeDownloads();

  const notificationState = useSelector((state: RootState) => state.notificationReducer);
  const { client } = useQuery(notificationsQuery);
  const [sendToken] = useMutation(mutationForToken);

  const handleNotificationReceived = (remoteMessage) => {
    if (remoteMessage) {
      fetchNotifications(client);
      if (remoteMessage?.data?.notification === "1") {
        navigate("Notifications", {});
      }
    }
  };

  const fetchNotifications = (client) => {
    if (client) {
      client.query({ query: notificationsQuery, fetchPolicy: "network-only", errorPolicy: "ignore" });
    }
  };

  useEffect(() => {
    if (notificationState?.tokenSent) return;

    registerPushNotifications()
      .then((token) => {
        console.debug("FCM TOKEN RECEIVED =========>", token);
        console.debug("REGISTERING FCM TOKEN");
        sendToken({ variables: { token } })
          .then((success) => {
            if (success) {
              console.debug("TOKEN REGISTERED");
              updateToken({ token: token });
              tokenSent({ tokenSent: true });
            } else {
              console.debug("TOKEN REGISTRATION FAIL");
            }
          })
          .catch((err) => {
            console.debug(err);
          });
      })
      .catch((err) => {
        console.debug("FCM TOKEN ERROR=========>", err);
      });
  }, []);

  useEffect(() => {
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.debug(`onNotificationOpenedApp ${remoteMessage}`);
      handleNotificationReceived(remoteMessage);
    });

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        console.debug(`getInitialNotification ${remoteMessage}`);
        fetchNotifications(client);
        handleNotificationReceived(remoteMessage);
      });

    messaging().onTokenRefresh((token) => {
      updateToken({ token: token });
    });

    const unsubscribe = messaging().onMessage((message) => {
      console.debug(`onMessage ${JSON.stringify(message)}`);
      fetchNotifications(client);
    });

    return unsubscribe;
  }, []);

  return (
    <NavigationContainer ref={navigationRef} >
      <RootStack />
    </NavigationContainer>
  );
};

export default RootContainer;
