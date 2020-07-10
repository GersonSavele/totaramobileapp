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
import { NAVIGATION } from "@totara/lib/navigation";
import Profile from "@totara/features/profile/Profile";
import { TotaraNavigationOptions } from "@totara/components";
import { NavigationRouteConfig } from "react-navigation";

const ProfileStack = createStackNavigator(
  {
    [NAVIGATION.PROFILE]: Profile as NavigationRouteConfig<any, any>
  },
  {
    mode: "modal",
    initialRouteName: NAVIGATION.PROFILE,
    defaultNavigationOptions: TotaraNavigationOptions({})
  }
);

export default ProfileStack;
