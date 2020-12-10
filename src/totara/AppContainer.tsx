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

import React, { useEffect } from "react";
import messaging from "@react-native-firebase/messaging";
import { useMutation, useQuery } from "@apollo/react-hooks";
import NotificationCenter from "@totara/lib/notificationCenter";
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
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { TotaraTheme } from "./theme/Theme";

const { SCORM_STACK_ROOT, ABOUT } = NAVIGATION;

const RootStack = createCompatNavigatorFactory(createStackNavigator)(
  {
    FeatureNavigator: {
      screen: TabContainer
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
  ResourceManager.resumeDownloads();

  const notificationState = useSelector((state: RootState) => state.notificationReducer);
  const { client } = useQuery(notificationsQuery);
  const [sendToken] = useMutation(mutationForToken);

  const handleNotificationReceived = (remoteMessage) => {
    if (remoteMessage) {
      if (remoteMessage?.data?.notification === "1") {
        navigate("NotificationsTab");
      }
    }
  };

  const fetchNotifications = (client) => {
    if (client) {
      client.query({ query: notificationsQuery, fetchPolicy: "network-only", errorPolicy: "ignore" });
    }
  };

  useEffect(() => {
    NotificationCenter.registerPushNotifications()
      .then((token) => {
        console.debug("TOKEN=========>", token);
        updateToken({ token: token });
      })
      .catch((err) => {
        console.debug("TOKEN ERROR=========>", err);
      });

    messaging().onNotificationOpenedApp((remoteMessage) => {
      handleNotificationReceived(remoteMessage);
    });

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        fetchNotifications(client);
        handleNotificationReceived(remoteMessage);
      });

    messaging().onMessage(() => {
      fetchNotifications(client);
    });

    return () => {
      messaging().onTokenRefresh((token) => {
        updateToken({ token: token });
      });
    };
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

  const navigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: TotaraTheme.viewContainer.backgroundColor!
    }
  };

  return (
    <NavigationContainer ref={navigationRef} theme={navigationTheme}>
      <RootStack />
    </NavigationContainer>
  );
};

export default AppContainer;
