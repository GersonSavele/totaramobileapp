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
 */

import NotificationsIOS from "react-native-notifications";
import { isEmulator } from "react-native-device-info";
import { Log } from "@totara/lib";

// TODO: this is just basic notification callback to check if notification to RN.

/**
 * initialize notification by binding these functions the the notification event listeners
 * @param onNotificationReceivedForeground
 * @param onNotificationOpened
 * @param onPushRegistered
 * @param onPushRegistrationFailed
 */
export const init = async (
  onNotificationReceivedForeground,
  onNotificationOpened,
  onPushRegistered,
  onPushRegistrationFailed
) => {

  if (! await isEmulator()) {
    Log.debug("iOS notification registering listeners");

    NotificationsIOS.addEventListener('notificationReceivedForeground', onNotificationReceivedForegroundIOS(onNotificationReceivedForeground));
    NotificationsIOS.addEventListener('notificationOpened', onNotificationOpenedIOS(onNotificationOpened));
    NotificationsIOS.addEventListener('remoteNotificationsRegistered', onPushRegistered);
    NotificationsIOS.addEventListener('remoteNotificationsRegistrationFailed', onPushRegistrationFailed);

    NotificationsIOS.requestPermissions();
  } else {
    Log.debug("notification not supported on iOS simulator");
  }
};

export const cleanUp = async () => {
  if (! await isEmulator()) {
    Log.debug("iOS notification removing listeners");

    NotificationsIOS.removeEventListener('remoteNotificationsRegistered');
    NotificationsIOS.removeEventListener('remoteNotificationsRegistrationFailed');
    NotificationsIOS.removeEventListener('notificationReceivedForeground');
    NotificationsIOS.removeEventListener('notificationOpened');
  } else {
    Log.debug("notification not supported on iOS simulator");
  }
};

const onNotificationOpenedIOS = (onNotificationOpened) => (notification, completion, action) => {
  Log.info("Notification opened by device user", notification);

  const payload = {
    title: notification._data.title,
    body: notification._data.body
  };
  onNotificationOpened(payload);
  Log.info(`Notification opened with an action identifier: ${action.identifier} and response text: ${action.text}`, notification);
  completion();
};

const onNotificationReceivedForegroundIOS = (onNotificationReceivedForeground) => (notification, completion) => {
  Log.info("Notification Received - Foreground", notification);

  const payload = {
    title: notification._data.title,
    body: notification._data.body
  };
  onNotificationReceivedForeground(payload);
  completion({alert: true, sound: false, badge: false});
};
