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

import messaging from "@react-native-firebase/messaging";

const registerPushNotifications = async () => {
  try {
    await messaging().requestPermission()
  } catch (error) {
    console.debug("Notifications Permission status:", error);
    return
  }
  return await messaging().getToken();
};

const NotificationCenter = {
  registerPushNotifications
};

export default NotificationCenter;
