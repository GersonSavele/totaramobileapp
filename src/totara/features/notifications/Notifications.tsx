/**
 * This file is part of Totara Mobile
 *
 * Copyright (C) 2020 onwards Totara Learning Solutions LTD
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
 * @author Rodrigo Mathias <rodrigo.mathias@totaralearning.com
 *
 */

import React from "react";
import {View, Text} from "react-native";
import {createStackNavigator} from "react-navigation-stack";
import totaraNavigationOptions from "@totara/components/NavigationOptions";

const Notifications = () => {
    return <View><Text>Notifications view implementation goes here</Text></View>
}

const NotificationsStack = createStackNavigator(
    {
        Notification: {
            screen: Notifications,
            navigationOptions: {title: "Notifications"}
        }
    },
    {
        initialRouteName: "Notification",
        defaultNavigationOptions: ({ screenProps } : any ) =>  totaraNavigationOptions({theme: screenProps.theme})
    }
)

export default NotificationsStack;