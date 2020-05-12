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
import { gql } from "apollo-boost";
import ApolloClient from "apollo-client";
import { NotificationMessage } from "@totara/types";
import moment from "moment";

const QUERY_NOTIFICATIONS = gql`
  {
    notifications @client {
      id
      title
      payload
      read
      received
    }
  }
`;

const receivedMessageHandler = (client: ApolloClient<object>, message: any) => {
  const messageData = message.data;

  const notificationMessage: NotificationMessage = {
    id: Math.random(),
    title: messageData.title,
    payload: messageData.payload,
    read: false,
    received: moment.utc().valueOf(),
    __typename: "totata_notification_message",
  };

  const storedData = client.query({ query: QUERY_NOTIFICATIONS });
  Log.info(JSON.stringify(storedData));

  client.writeQuery({
    query: QUERY_NOTIFICATIONS,
    data: { notifications: [...storedData.notifications, notificationMessage] },
  });

  //
};

const handleMessagesInBackground = () => {
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    Log.info(
      "Message handled in the BACKGROUND: ",
      JSON.stringify(remoteMessage)
    );
  });
};

const init = (client: ApolloClient<object>) => {
  messaging()
    .getToken()
    .then((token) => {
      Log.info("FIREBASE TOKEN: ", token);
      //TODO: sent to backend to link to the user
    });

  return messaging().onMessage(async (remoteMessage) => {
    Log.info(
      `Message handled in the FOREGROUND: ${JSON.stringify(remoteMessage)}`
    );
    receivedMessageHandler(client, remoteMessage);
  });
};

const NotificationCenter = {
  init,
  handleMessagesInBackground,
};

export default NotificationCenter;
