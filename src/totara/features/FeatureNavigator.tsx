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
 * @author Rodrigo Mathias <rodrigo.mathias@totaralearning.com
 *
 */

import React, {useContext} from "react";
import { Image } from "react-native";
import { createStackNavigator } from "react-navigation";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import { faCloudDownloadAlt } from "@fortawesome/free-solid-svg-icons"; //TODO: SHOULD IMPORT FROM A GLOBAL EXPORT?

import { TouchableIcon } from "@totara/components";
import { ThemeContext } from "@totara/theme";

const CourseDetails = require("./course-details").default;
const MyLearning = require("./my-learning").default;
const ProgramDetails = require("./program-details").default;
const Settings = require("./settings").default;
const Profile = require("./profile").default;
const PlaceHolder = require("./place-holder").default;

const FeatureNavigator = () => {
    const [theme] = useContext(ThemeContext);
    return(
        createMaterialBottomTabNavigator(
            {
                MyLearning : {
                    screen: myLearningNavigation,
                    navigationOptions: {
                        tabBarIcon: (tabIconProps: { focused: boolean, tintColor: any }) => tabBarIconBuilder(tabIconProps.focused, tabIconProps.tintColor, tabBarIconImages.current_learning)
                    },
                },
                Downloads: {
                    screen: downloadsNavigation,
                    navigationOptions: {
                       tabBarIcon: (tabIconProps: { focused: boolean, tintColor: any }) => tabBarIconBuilder(tabIconProps.focused, tabIconProps.tintColor, tabBarIconImages.downloads)
                    }
                  },
                Notification: {
                    screen: notificationNavigation,
                    navigationOptions:{
                       tabBarIcon: (tabIconProps: { focused: boolean, tintColor: any }) => tabBarIconBuilder(tabIconProps.focused, tabIconProps.tintColor, tabBarIconImages.current_learning)
                    }
                },
                Profile: {
                    screen: profileNavigation,
                    navigationOptions: {
                        tabBarIcon:  (tabIconProps: { focused: boolean, tintColor: any  }) => tabBarIconBuilder(tabIconProps.focused, tabIconProps.tintColor, tabBarIconImages.profile)
                    }
                }
            },
            {
                initialRouteName: "MyLearning",
                labeled: false,
                barStyle: { backgroundColor: theme.colorNeutral1, shadowRadius: 0 },
                activeTintColor: theme.tabBarActiveTintColor,
                inactiveTintColor: theme.tabBarInactiveTintColor
            }
        )
    )
};

const myLearningNavigation = createStackNavigator(
    {
        MyLearning: {
            screen: MyLearning,
            navigationOptions: ({ screenProps } : any) =>
                navigationOptions(screenProps.theme, null, null, /**faBell**/) //TODO: MOB-373 hiding it for beta release
        },
        CourseDetails: {
            screen: CourseDetails,
            navigationOptions: ({ screenProps } : any) =>
                navigationOptions(screenProps.theme, null, null)
        },
        ProgramDetails: {
            screen: ProgramDetails,
            navigationOptions: ({ screenProps } : any) =>
                navigationOptions(screenProps.theme, null, null, faCloudDownloadAlt)
        }
    },
    {
        initialRouteName: "MyLearning",
        defaultNavigationOptions: ({ screenProps }) => navigationOptions(screenProps.theme, null, null, null)
    }
);

const profileNavigation = createStackNavigator(
    {
        Profile: Profile,
        Settings: Settings
    },
    {
        initialRouteName: "Profile",
        defaultNavigationOptions: ({ screenProps }) => navigationOptions(screenProps.theme, null, null, null)
    }
);

const notificationNavigation = createStackNavigator(
    {
        Notification: PlaceHolder
    },
    {
        initialRouteName: "Notification",
        defaultNavigationOptions: ({ screenProps }) => navigationOptions(screenProps.theme, null, null, null)
    }
);

const downloadsNavigation = createStackNavigator(
    {
        Downloads: PlaceHolder
    },
    {
        initialRouteName: "Downloads",
        defaultNavigationOptions: ({ screenProps }) => navigationOptions(screenProps.theme, null, null, null)
    }
);

const navigationOptions = (theme: any, title?: any, backTitle?: any, rightIcon?: any) => ({
    headerStyle: {
        borderBottomWidth: 0,
        backgroundColor: theme.colorSecondary1,
        shadowOpacity: 0,
        elevation: 0
    },
    title: title,
    headerBackTitle: null,
    headerTintColor: theme.navigationHeaderTintColor,
    headerRight: rightIcon ? <TouchableIcon icon={rightIcon} disabled={false} size={24} color={theme.navigationHeaderTintColor}/> : null,
});

const tabBarIconBuilder = (focused: boolean, color: any, imageSet: any) => {
    return <Image source={focused ? imageSet.solid : imageSet.regular} style={{tintColor: color, width: 24, height: 24 }} resizeMode='contain' />
};

const tabBarIconImages = {
    current_learning : {
        solid: require("@resources/images/tabbar/current_learning_solid.png"),
        regular: require("@resources/images/tabbar/current_learning_regular.png"),
    },
    downloads: {
        solid: require("@resources/images/tabbar/downloads_solid.png"),
        regular: require("@resources/images/tabbar/downloads_regular.png")
    },
    notifications: {
        solid: require("@resources/images/tabbar/notifications_solid.png"),
        regular: require("@resources/images/tabbar/notifications_regular.png"),
    },
    profile: {
        solid: require("@resources/images/tabbar/profile_solid.png"),
        regular: require("@resources/images/tabbar/profile_regular.png")
    }
};

export default FeatureNavigator;