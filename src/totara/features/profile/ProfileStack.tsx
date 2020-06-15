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

import { createStackNavigator } from "react-navigation-stack";
import Profile from "@totara/features/profile/Profile";
import Settings from "@totara/features/settings";
import { NAVIGATION } from "@totara/lib/constants";
import totaraNavigationOptions from "@totara/components/NavigationOptions";

const ProfileStack = createStackNavigator(
  {
    [NAVIGATION.NAVIGATION_PROFILE]: Profile,
    [NAVIGATION.NAVIGATION_SETTINGS]: Settings
  },
  {
    mode: "modal",
    initialRouteName: NAVIGATION.NAVIGATION_PROFILE,
    defaultNavigationOptions: totaraNavigationOptions({})
  }
);

export default ProfileStack;
