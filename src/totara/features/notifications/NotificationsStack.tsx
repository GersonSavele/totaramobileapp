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

import { createStackNavigator } from "@react-navigation/stack";
import { createCompatNavigatorFactory } from "@react-navigation/compat";
import { translate } from "../../locale";
import NotificationDetails from "./NotificationDetail";
import TotaraNavigationOptions from "../../components/NavigationOptions";
import Notifications from "./Notifications";

const NotificationsStack = createCompatNavigatorFactory(createStackNavigator)(
  {
    Notification: {
      screen: Notifications
    },
    NotificationDetail: {
      screen: NotificationDetails
    }
  },
  {
    initialRouteName: "Notification",
    defaultNavigationOptions: TotaraNavigationOptions({ backTitle: translate("general.back") })
  }
);

export default NotificationsStack;
