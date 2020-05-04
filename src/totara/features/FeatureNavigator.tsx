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
import {Image, ImageSourcePropType} from "react-native";
import {createStackNavigator} from 'react-navigation-stack';
import {createMaterialBottomTabNavigator} from "react-navigation-material-bottom-tabs";
import {ThemeContext} from "@totara/theme";
import {config} from "@totara/lib";
import totaraNavigationOptions from "@totara/components/NavigationOptions";

// @ts-ignore //TODO: PLEASE REMOVE TS-IGNORE WHEN FEATURE IS MIGRATED TO TYPESCRIPT
import MyLearning from "./my-learning";
// @ts-ignore //TODO: PLEASE REMOVE TS-IGNORE WHEN FEATURE IS MIGRATED TO TYPESCRIPT
import  CourseDetails  from "./currentLearning/courseDetails";
// @ts-ignore //TODO: PLEASE REMOVE TS-IGNORE WHEN FEATURE IS MIGRATED TO TYPESCRIPT
import ProgramDetails from "./currentLearning/programDetails";
// @ts-ignore //TODO: PLEASE REMOVE TS-IGNORE WHEN FEATURE IS MIGRATED TO TYPESCRIPT
import CertificationDetails from "./currentLearning/certificationDetails";
// @ts-ignore //TODO: PLEASE REMOVE TS-IGNORE WHEN FEATURE IS MIGRATED TO TYPESCRIPT
import Settings from "./settings";
// @ts-ignore //TODO: PLEASE REMOVE TS-IGNORE WHEN FEATURE IS MIGRATED TO TYPESCRIPT
// import PlaceHolder from "./place-holder";

import Profile from "./profile";
import NotificationsStack from "./notifications";
import DownloadsStack from "./downloads";
import { NotificationBell, TouchableIcon } from "@totara/components";
import { faCloudDownloadAlt } from "@fortawesome/free-solid-svg-icons";
import { header } from "@totara/theme/constants";

const FeatureNavigator = () => {
  const [theme] = useContext(ThemeContext);

  return (
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
        barStyle: {backgroundColor: theme.colorNeutral1, shadowRadius: 5,},
        activeColor: theme.tabBarActiveTintColor,
        inactiveColor: theme.tabBarInactiveTintColor,
      }
    )
  )
};

//TABS
const MyLearningTab = {
  screen: createStackNavigator(
    {
      MyLearning: {
        screen: MyLearning,
        navigationOptions: ({screenProps, navigation}) =>
          totaraNavigationOptions({
            theme: screenProps!.theme,
            title: navigation.getParam("title"),
            opacity: navigation.getParam("opacity")/*rightIcon: faCloudDownloadAlt*/
          }) //TODO: MOB-373 hiding it for beta release
      },
      CourseDetails: {
        screen: CourseDetails,
        navigationOptions: ({screenProps, navigation}) =>
          totaraNavigationOptions({
            theme: screenProps!.theme,
            title: navigation.getParam("title"),
            opacity: navigation.getParam("opacity")
          })
      },
      ProgramDetails: {
        screen: ProgramDetails,
        navigationOptions: ({screenProps, navigation}) =>
          totaraNavigationOptions({
            theme: screenProps!.theme,
            rightAction: <TouchableIcon icon={faCloudDownloadAlt} disabled={false} size={header.icon.size} color={screenProps!.theme.navigationHeaderTintColor}/>,
            title: navigation.getParam("title"),
            opacity: navigation.getParam("opacity")
          })
      },
      CertificationDetails: {
        screen: CertificationDetails,
        navigationOptions: ({screenProps, navigation}) =>
          totaraNavigationOptions({
            theme: screenProps!.theme,
            rightAction: <TouchableIcon icon={faCloudDownloadAlt} disabled={false} size={header.icon.size} color={screenProps!.theme.navigationHeaderTintColor}/>,
            title: navigation.getParam("title"),
            opacity: navigation.getParam("opacity")
          })
      }
    },
    {
      initialRouteName: "MyLearning",
      defaultNavigationOptions: ({screenProps}) => totaraNavigationOptions({theme: screenProps.theme})
    }
  ),
  navigationOptions: {
    tabBarIcon: (tabIconProps: { focused: boolean, tintColor: string }) => tabBarIconBuilder(tabIconProps.focused, tabIconProps.tintColor, tabBarIconImages.current_learning)
  },
};

const DownloadsTab = {
  screen: DownloadsStack,
  navigationOptions: {
    tabBarIcon: (tabIconProps: { focused: boolean, tintColor: string }) => tabBarIconBuilder(tabIconProps.focused, tabIconProps.tintColor, tabBarIconImages.downloads)
  }
};

const NotificationsTab = {
  screen: NotificationsStack,
    navigationOptions: {
    tabBarIcon: (tabIconProps: { focused: boolean, tintColor: string }) => NotificationBell({
      active: tabIconProps.focused,
      tintColor: tabIconProps.tintColor,
      counting: 5
    })
  }
};

const ProfileTab = {
  screen: createStackNavigator(
    {
      Profile: Profile,
      Settings: Settings
    },
    {
      initialRouteName: "Profile",
      defaultNavigationOptions: ({screenProps}) => totaraNavigationOptions({theme: screenProps.theme})
    }
  ),
  navigationOptions: {
    tabBarIcon: (tabIconProps: { focused: boolean, tintColor: string }) => tabBarIconBuilder(tabIconProps.focused, tabIconProps.tintColor, tabBarIconImages.profile)
  }
};

const tabBarIconBuilder = (focused: boolean, color: string, imageSet: iconImageProps) => {
  return <Image source={focused ? imageSet.solid : imageSet.regular} style={{tintColor: color, width: 24, height: 24}}
                resizeMode='contain'/>
};

type iconImageProps = {
  solid: ImageSourcePropType;
  regular: ImageSourcePropType;
}

const tabBarIconImages: {
  current_learning: iconImageProps;
  downloads: iconImageProps;
  profile: iconImageProps;
} = {
  current_learning: {
    solid: require("@resources/images/tabbar/current_learning_solid.png"),
    regular: require("@resources/images/tabbar/current_learning_regular.png"),
  },
  downloads: {
    solid: require("@resources/images/tabbar/downloads_solid.png"),
    regular: require("@resources/images/tabbar/downloads_regular.png")
  },
  profile: {
    solid: require("@resources/images/tabbar/profile_solid.png"),
    regular: require("@resources/images/tabbar/profile_regular.png")
  }
};

export default FeatureNavigator;
