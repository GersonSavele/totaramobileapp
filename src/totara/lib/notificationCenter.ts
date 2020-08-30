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

/* eslint-disable no-undef */

import messaging from "@react-native-firebase/messaging";
import { Log } from "@totara/lib/logger";

const handleMessagesInBackground = () => {
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    __DEV__ && Log.info("Message handled in the BACKGROUND: ", JSON.stringify(remoteMessage));
  });
};

const requestUserPermission = async () => {
  const authorizationStatus = await messaging().requestPermission();
  if (authorizationStatus) {
    console.log("Notifications Permission status:", authorizationStatus);
  }
};

const NotificationCenter = {
  requestUserPermission,
  handleMessagesInBackground
};

export default NotificationCenter;
