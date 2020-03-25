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
import { Image, ImageSourcePropType } from "react-native";
import { createStackNavigator, NavigationRouteConfigMap, NavigationScreenProps } from "react-navigation";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import { faCloudDownloadAlt } from "@fortawesome/free-solid-svg-icons"; //TODO: SHOULD IMPORT FROM A GLOBAL EXPORT?
import { IconDefinition } from "@fortawesome/fontawesome-common-types";
import { ThemeContext, normalize } from "@totara/theme";
import { Theme } from "@totara/types";
import { TouchableIcon } from "@totara/components";
import { config } from "@totara/lib";

// @ts-ignore //TODO: PLEASE REMOVE TS-IGNORE WHEN FEATURE IS MIGRATED TO TYPESCRIPT
import MyLearning from "./my-learning";
// @ts-ignore //TODO: PLEASE REMOVE TS-IGNORE WHEN FEATURE IS MIGRATED TO TYPESCRIPT
import { CourseDetails } from "./AccessToLearning/course-details";
// @ts-ignore //TODO: PLEASE REMOVE TS-IGNORE WHEN FEATURE IS MIGRATED TO TYPESCRIPT
import ProgramDetails from "./AccessToLearning/program-details";
// @ts-ignore //TODO: PLEASE REMOVE TS-IGNORE WHEN FEATURE IS MIGRATED TO TYPESCRIPT
import CertificationDetails from "./AccessToLearning/certification-details";
// @ts-ignore //TODO: PLEASE REMOVE TS-IGNORE WHEN FEATURE IS MIGRATED TO TYPESCRIPT
import Settings from "./settings";
// @ts-ignore //TODO: PLEASE REMOVE TS-IGNORE WHEN FEATURE IS MIGRATED TO TYPESCRIPT
import PlaceHolder from "./place-holder";

import Profile from "./profile";
import Downloads from "./downloads";

const FeatureNavigator = () => {
    const [theme] = useContext(ThemeContext);
    return(
        createMaterialBottomTabNavigator(
            {
                MyLearningTab,
                ...config.features.downloads && {
                    DownloadsTab
                },
                ...config.features.notifications && {
                    NotificationsTab
                },
                ProfileTab
            },
            {
                initialRouteName: "MyLearningTab",
                labeled: false,
                barStyle: { backgroundColor: theme.colorNeutral1, shadowRadius: 5 },
                activeColor: theme.tabBarActiveTintColor,
                inactiveColor: theme.tabBarInactiveTintColor
            }
        )
    )
};

const stackNavigatorBuilder = (routeConfigMap : NavigationRouteConfigMap, initialRouteName: string) => {
    return createStackNavigator(
        routeConfigMap,
        {
            initialRouteName: initialRouteName,
            defaultNavigationOptions: ({ screenProps }) => navigationOptions({theme: screenProps.theme})
        }
    )
};

//TABS
const MyLearningTab = {
    screen: stackNavigatorBuilder(
        {
            MyLearning: {
                screen: MyLearning,
                navigationOptions: ({ screenProps, navigation }: NavigationScreenProps ) =>
                    navigationOptions({ theme: screenProps!.theme, title : navigation.getParam("title"), opacity : navigation.getParam("opacity")/*rightIcon: faCloudDownloadAlt*/}) //TODO: MOB-373 hiding it for beta release
            },
            CourseDetails: {
                screen: CourseDetails,
                navigationOptions: ({ screenProps,navigation } : NavigationScreenProps) =>
                    navigationOptions({theme: screenProps!.theme, title : navigation.getParam("title"), opacity : navigation.getParam("opacity")})
            },
            ProgramDetails: {
                screen: ProgramDetails,
                navigationOptions: ({ screenProps, navigation } : NavigationScreenProps) =>
                    navigationOptions({theme: screenProps!.theme, rightIcon: faCloudDownloadAlt, title : navigation.getParam("title"), opacity : navigation.getParam("opacity")})
            },
            CertificationDetails: {
                screen: CertificationDetails,
                navigationOptions: ({ screenProps, navigation } : NavigationScreenProps) =>
                    navigationOptions({theme: screenProps!.theme, rightIcon: faCloudDownloadAlt, title : navigation.getParam("title"), opacity : navigation.getParam("opacity")})
            }
        }, "MyLearning"),
    navigationOptions: {
        tabBarIcon: (tabIconProps: { focused: boolean, tintColor: string }) => tabBarIconBuilder(tabIconProps.focused, tabIconProps.tintColor, tabBarIconImages.current_learning)
    },
};

const DownloadsTab = {
    screen: stackNavigatorBuilder(
        {
            Downloads: {
                screen: Downloads,
                navigationOptions: ({ screenProps,navigation } : NavigationScreenProps) =>
                    navigationOptions({theme: screenProps!.theme, title : navigation.getParam("title") })
            }
        },"Downloads"
    ),
    navigationOptions: {
        tabBarIcon: (tabIconProps: { focused: boolean, tintColor : string}) => tabBarIconBuilder(tabIconProps.focused, tabIconProps.tintColor, tabBarIconImages.downloads)
    }
};

const NotificationsTab = {
    screen: stackNavigatorBuilder(
        {
            Notification: PlaceHolder
        },"Notification"
    ),
    navigationOptions:{
        tabBarIcon: (tabIconProps: { focused: boolean, tintColor: string }) => tabBarIconBuilder(tabIconProps.focused, tabIconProps.tintColor, tabBarIconImages.current_learning)
    }
};

const ProfileTab = {
    screen: stackNavigatorBuilder(
        {
            Profile: Profile,
            Settings: Settings
        },"Profile"
    ),
    navigationOptions: {
        tabBarIcon:  (tabIconProps: { focused: boolean, tintColor: string  }) => tabBarIconBuilder(tabIconProps.focused, tabIconProps.tintColor, tabBarIconImages.profile)
    }
};

type navigationOptionsProps = {
    theme: Theme,
    title? : string,
    backTitle? : string,
    rightIcon? : IconDefinition,
    opacity? : number
}

const navigationOptions = (props: navigationOptionsProps) => ({
    headerStyle: {
        borderBottomWidth: 0,
        backgroundColor: props.theme.colorSecondary1,
        shadowOpacity: 0,
        elevation: 0
    },
    headerTitleStyle: {
        color: props.theme.navigationHeaderTintColor,
        fontSize: normalize(20),
        opacity: props.opacity
    },
    title: props.title,
    headerBackTitle: null,
    headerTintColor: props.theme.navigationHeaderTintColor,
    headerRight: props.rightIcon ? <TouchableIcon icon={props.rightIcon} disabled={false} size={24} color={props.theme.navigationHeaderTintColor}/> : null,
});


const tabBarIconBuilder = (focused: boolean, color: string, imageSet: iconImageProps) => {
    return <Image source={focused ? imageSet.solid : imageSet.regular} style={{tintColor: color, width: 24, height: 24 }} resizeMode='contain' />
};

type iconImageProps = {
    solid: ImageSourcePropType;
    regular: ImageSourcePropType;
}

const tabBarIconImages: {
    current_learning: iconImageProps;
    downloads: iconImageProps;
    notifications: iconImageProps;
    profile: iconImageProps;
} = {
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
