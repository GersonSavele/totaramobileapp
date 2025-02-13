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

import { useMutation, useQuery } from '@apollo/client';
import messaging from '@react-native-firebase/messaging';
import { createStackNavigator } from '@react-navigation/stack';
import ScormActivity from '@totara/features/activities/scorm/ScormActivity';
import { registerPushNotifications } from '@totara/lib/notificationService';
import ResourceManager from '@totara/lib/resourceManager';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { tokenSent, updateToken } from './actions/notification';
import CloseButton from './components/CloseButton';
import TotaraNavigationOptions from './components/NavigationOptions';
import About from './features/about/About';
import ScormFeedbackModal from './features/activities/scorm/components/ScormFeedbackModal';
import OfflineScormActivity from './features/activities/scorm/OfflineScormActivity';
import ScormAttempts from './features/activities/scorm/ScormAttempts';
import WebViewStack from './features/activities/webview/WebViewStack';
import { EnrolmentModal } from './features/enrolment/EnrolmentModal';
import FindLearningWebViewWrapper from './features/findLearning/FindLearningWebViewWrapper';
import { OverviewModal } from './features/findLearning/OverviewModal';
import { mutationForToken, notificationsQuery } from './features/notifications/api';
import { cardModalOptions, horizontalAnimation, navigateByRef } from './lib/navigation';
import { NAVIGATION } from './lib/navigation';
import { NAVIGATION_TEST_IDS } from './lib/testIds';
import { translate } from './locale';
import type { RootState } from './reducers';
import TabContainer from './TabContainer';
import type { ScormActivityParams } from './types/Scorm';

const { ABOUT, WEBVIEW_ACTIVITY } = NAVIGATION;

const Stack = createStackNavigator();
const detaultScreenOptions = TotaraNavigationOptions({ backTitle: translate('general.back') });
const MainContainer = () => {
  ResourceManager.resumeDownloads();

  const notificationState = useSelector((state: RootState) => state.notificationReducer);
  const { client } = useQuery(notificationsQuery);
  const [sendToken] = useMutation(mutationForToken);
  const dispatch = useDispatch();

  const handleNotificationReceived = remoteMessage => {
    if (remoteMessage) {
      fetchNotifications(client);
      if (remoteMessage?.data?.notification === "1") {
        navigateByRef("Notifications", {});
      }
    }
  };

  const fetchNotifications = client => {
    if (client) {
      client.query({ query: notificationsQuery, fetchPolicy: "network-only", errorPolicy: "ignore" });
    }
  };

  useEffect(() => {
    if (notificationState?.tokenSent) return;

    registerPushNotifications()
      .then(token => {
        console.debug('REGISTERING FCM TOKEN');
        sendToken({ variables: { token } })
          .then(success => {
            if (success) {
              console.debug('TOKEN REGISTERED');
              dispatch(updateToken({ token: token }));
              dispatch(tokenSent({ tokenSent: true }));
            } else {
              console.debug('TOKEN REGISTRATION FAIL');
            }
          })
          .catch(err => {
            console.debug(err);
          });
      })
      .catch(err => {
        console.debug('FCM TOKEN ERROR=========>', err);
      });
  }, []);

  useEffect(() => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.debug(`onNotificationOpenedApp ${remoteMessage}`);
      handleNotificationReceived(remoteMessage);
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        console.debug(`getInitialNotification ${remoteMessage}`);
        fetchNotifications(client);
        handleNotificationReceived(remoteMessage);
      });

    messaging().onTokenRefresh(token => {
      dispatch(updateToken({ token: token }));
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.debug('Message handled in the background', remoteMessage);
    });

    const unsubscribe = messaging().onMessage(message => {
      console.debug(`onMessage ${JSON.stringify(message)}`);
      fetchNotifications(client);
    });

    return unsubscribe;
  }, []);

  return (
    <Stack.Navigator screenOptions={{ presentation: 'modal', headerShown: false }}>
      <Stack.Screen name="TabContainer" component={TabContainer} />
      <Stack.Group
        screenOptions={({ route, navigation }) => {
          const { title = '' } = route.params as ScormActivityParams;
          return {
            presentation: 'modal',
            headerShown: true,
            title,
            headerLeft: () => <CloseButton onPress={() => navigation.goBack()} testID={NAVIGATION_TEST_IDS.BACK} />
          };
        }}>
        <Stack.Screen name={NAVIGATION.SCORM_ACTIVITY} component={ScormActivity} />
        <Stack.Screen name={NAVIGATION.SCORM_ATTEMPTS} component={ScormAttempts} />
        <Stack.Screen name={NAVIGATION.OFFLINE_SCORM_ACTIVITY} component={OfflineScormActivity} />
        <Stack.Screen name={NAVIGATION.SCORM_FEEDBACK} component={ScormFeedbackModal} />
      </Stack.Group>
      <Stack.Screen name={WEBVIEW_ACTIVITY} component={WebViewStack} />
      <Stack.Screen
        name={ABOUT}
        component={About}
        options={({ navigation }) => ({
          headerShown: true,
          headerLeft: () => <CloseButton onPress={() => navigation.goBack()} testID={NAVIGATION_TEST_IDS.BACK} />
        })}
      />
      <Stack.Screen name={NAVIGATION.FIND_LEARNING_OVERVIEW} component={OverviewModal} options={cardModalOptions} />
      <Stack.Screen name={NAVIGATION.ENROLMENT_MODAL} component={EnrolmentModal} options={cardModalOptions} />
      <Stack.Screen
        name={NAVIGATION.FIND_LEARNING_WEBVIEW}
        component={FindLearningWebViewWrapper}
        options={{
          ...horizontalAnimation,
          ...detaultScreenOptions,
          gestureDirection: 'horizontal'
        }}
      />
    </Stack.Navigator>
  );
};

export default MainContainer;
