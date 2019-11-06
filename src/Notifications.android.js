/*
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

import { NotificationsAndroid } from "react-native-notifications";
import { Log } from "@totara/lib";

// TODO: this is just basic notification callback to check if notification to RN.

/**
 * initialize notification by binding these functions the the notification event listeners
 * @param onNotificationReceivedForeground
 * @param onNotificationOpened
 * @param onPushRegistered
 * @param onPushRegistrationFailed
 */
export const init = (
  onNotificationReceivedForeground,
  onNotificationOpened,
  onPushRegistered,
) => {
  Log.debug("Android notification registering listeners");

  NotificationsAndroid.setRegistrationTokenUpdateListener(onPushRegistered);
  NotificationsAndroid.setNotificationOpenedListener(onNotificationOpened);
  NotificationsAndroid.setNotificationReceivedListener(onNotificationReceivedForeground);

  // const notifications = await PendingNotifications.getInitialNotification();
  // console.log("initialNotifications", notifications);
  //
  // const hasPermissions = await NotificationsAndroid.isRegisteredForRemoteNotifications();
  // console.log("hasPermisions", hasPermissions);
};

export const cleanUp = () => {
  // nothing to cleanup for now
};