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
import { NAVIGATION } from "../../lib/navigation";
import Profile from "./Profile";
import totaraNavigationOptions from "@totara/components/NavigationOptions";

// const ProfileStack = createCompatNavigatorFactory(createStackNavigator)(
//     {
//         [NAVIGATION.PROFILE]: {
//             screen: Profile
//         }
//     },
//     {
//         mode: "modal",
//         initialRouteName: NAVIGATION.PROFILE,
//         defaultNavigationOptions: totaraNavigationOptions({})
//     }
// );

const Stack = createStackNavigator();

const ProfileStack = () => (
  <Stack.Navigator initialRouteName={NAVIGATION.PROFILE} screenOptions={{ ...totaraNavigationOptions({}) }}>
    <Stack.Screen name={NAVIGATION.PROFILE} component={Profile} />
  </Stack.Navigator>
)

export default ProfileStack;
