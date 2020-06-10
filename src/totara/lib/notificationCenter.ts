/* eslint-disable no-undef */
/**
 *
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
 *
 */

import messaging from "@react-native-firebase/messaging";
import { Log } from "@totara/lib/logger";
import { NotificationMessage } from "@totara/types";
import moment from "moment";

const receivedMessageHandler = (notificationDispatch: any, message: any) => {
  const messageData = message.data;
  const randomId =
    new Date().getTime().toString(16) +
    Math.floor(1e7 * Math.random()).toString(16);

  const notificationMessage: NotificationMessage = {
    id: randomId,
    title: messageData.title,
    body: messageData.body,
    read: false,
    action: messageData.action,
    received: moment.utc().valueOf()
  };

  notificationDispatch({
    type: "ADD_NOTIFICATION",
    payload: notificationMessage
  });
};

const handleMessagesInBackground = () => {
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    __DEV__ &&
      Log.info(
        "Message handled in the BACKGROUND: ",
        JSON.stringify(remoteMessage)
      );
  });
};

const init = (notificationDispatch) => {
  messaging()
    .getToken()
    .then((token) => {
      __DEV__ && Log.info("FIREBASE TOKEN: ", token);
      //TODO: sent to backend to link to the user
    });

  return messaging().onMessage(async (remoteMessage) => {
    __DEV__ &&
      Log.info(
        `Message handled in the FOREGROUND: ${JSON.stringify(remoteMessage)}`
      );
    receivedMessageHandler(notificationDispatch, remoteMessage);
  });
};

const NotificationCenter = {
  init,
  handleMessagesInBackground
};

export default NotificationCenter;
