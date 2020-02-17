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
 * @author Jun Yamog <jun.yamog@totaralearning.com
 *
 */

import React, { useContext } from "react";
import { Image } from "react-native";
import { createStackNavigator, createAppContainer } from "react-navigation";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import { library } from '@fortawesome/fontawesome-svg-core';
import AsyncStorage from "@react-native-community/async-storage";
import messaging from "@react-native-firebase/messaging";

import {
  faHome,
  faCloudDownloadAlt,
  faBell,
  faUser,
  faVideo,
  faTimes,
  faChevronRight,
  faFilm,
  faListUl,
  faTasks,
  faComments,
  faExternalLinkAlt,
  faCheck,
  faChevronUp,
  faExclamationTriangle,
  faLock,
  faBoxOpen,
  faExclamationCircle,
  faArrowRight,
  faArrowLeft,
  faBullhorn,
  faBookOpen,
  faPenSquare,
  faBook,
  faPen,
  faChevronLeft,
  faUnlockAlt,
  faCaretUp,
  faCaretDown
} from "@fortawesome/free-solid-svg-icons";

import { MyLearning, CourseDetails, ProgramDetails, Profile, Settings, PlaceHolder } from "@totara/features";
import { Log } from "@totara/lib";
import { ActivitySheetProvider } from "@totara/activities";
import { AuthProvider } from "@totara/core/AuthProvider";
import { AuthFlow } from "@totara/auth/AuthFlow";
import { AdditionalAction } from "@totara/auth/additional-actions";
import { TouchableIcon, AppModal } from "@totara/components";
import { ThemeProvider, ThemeContext } from "@totara/theme";

import * as notifications from "./Notifications";


class App extends React.Component<{}> {

  constructor() {
    super();
  }

  // TODO: this is just basic notification callback to check if notification to RN.
  async onPushRegistered(deviceToken) {
    // TODO: Send the token to my server so it could send back push notifications...
    Log.info("Device Token Received", deviceToken);
    let fcmToken = await messaging().getToken();
    Log.info("fcmtoken", fcmToken);
  }

  // TODO: this is just basic notification callback to check if notification to RN.
  onPushRegistrationFailed(error) {
    Log.error(error);
  }

  // TODO: this is just basic notification callback to check if notification to RN.
  onNotificationReceivedForeground(notification) {
    Log.info("Notification Received - Foreground", notification);
  }

  // TODO: this is just basic notification callback to check if notification to RN.
  onNotificationReceived(notification) {
    Log.info("Notification Received", notification);
  }

  // TODO: this is just basic notification callback to check if notification to RN.
  onNotificationOpened(notification) {
    Log.info("Notification opened by device user", notification);
  }

  async componentWillUnmount() {
    // prevent memory leaks!
    await notifications.cleanUp();
  }

  async componentDidMount() {
    await notifications.init(
      this.onNotificationReceivedForeground,
      this.onNotificationOpened,
      this.onPushRegistered,
      this.onPushRegistrationFailed
    );
  }

  render() {
    return (
      <ThemeProvider>
        <AuthProvider asyncStorage={AsyncStorage}>
          <AuthFlow>
            <ActivitySheetProvider>
              <AppContainer />
            </ActivitySheetProvider>
            <AdditionalAction />
            <AppModal />
          </AuthFlow>
        </AuthProvider>
      </ThemeProvider>
    );
  }
}
const AppContainer = () => {
  const [theme] = useContext(ThemeContext);
  const AppMainNavigation = createAppContainer(tabNavigation(theme));

return (
   <AppMainNavigation screenProps={{ theme: theme }}/>
);
};
const navigationOptions = (theme, title, backTitle, rightIcon) => ({
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

const myLearning = createStackNavigator(
  {
    MyLearning: {
      screen: MyLearning,
      navigationOptions: ({ screenProps }) =>
        navigationOptions(screenProps.theme, null, null, /**faBell**/) //TODO: MOB-373 hiding it for beta release
    },
    CourseDetails: {
      screen: CourseDetails,
      navigationOptions: ({ screenProps }) =>
        navigationOptions(screenProps.theme, null, null)
    },
    ProgramDetails: {
      screen: ProgramDetails,
      navigationOptions: ({ screenProps }) =>
        navigationOptions(screenProps.theme, null, null, faCloudDownloadAlt)
    }
  },
  {
    initialRouteName: "MyLearning",
    defaultNavigationOptions: ({ screenProps }) =>
      navigationOptions(screenProps.theme, null, null, null)
  }
);

const profile = createStackNavigator(
  {
    Profile: Profile,
    Settings: Settings
  },
  {
    initialRouteName: "Profile",
    defaultNavigationOptions: ({ screenProps }) => navigationOptions(screenProps.theme, null, null, null)
  }
);

const notification = createStackNavigator(
  {
    Notification: PlaceHolder
  },
  {
    initialRouteName: "Notification",
    defaultNavigationOptions: ({ screenProps }) => navigationOptions(screenProps.theme, null, null, null)
  }
);

const downloads = createStackNavigator(
  {
    Downloads: PlaceHolder
  },
  {
    initialRouteName: "Downloads",
    defaultNavigationOptions: ({ screenProps }) => navigationOptions(screenProps.theme, null, null, null)
  }
);

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

const tabBarIcon = (focused, color, imageSet) => {
  return <Image source={focused ? imageSet.solid : imageSet.regular} style={{tintColor: color, width: 24, height: 24 }} resizeMode='contain' />
};

const tabNavigation = (theme) => (
  createMaterialBottomTabNavigator(
    {
      MyLearning: {
        screen: myLearning,
        navigationOptions: () => ({
          tabBarIcon: ({  focused, tintColor }) => tabBarIcon(focused, tintColor, tabBarIconImages.current_learning)
        }),
      },
      /** TODO: MOB-373 hiding it for beta release
       *
       *
       * Downloads: {
        screen: downloads,
        navigationOptions: () => ({
          tabBarIcon: ({ focused, tintColor }) => tabBarIcon(focused, tintColor, tabBarIconImages.downloads)
        })
      },
      Notification: {
        screen: notification,
        navigationOptions: () => ({
          tabBarIcon: ({ focused, tintColor }) => tabBarIcon(focused, tintColor, tabBarIconImages.notifications)
        })
      },**/
      Profile: {
        screen: profile,
        navigationOptions: () => ({
          tabBarIcon: ({ focused, tintColor }) => tabBarIcon(focused, tintColor, tabBarIconImages.profile)
        })
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
);

// init is needeed for FA to bundle the only needed icons
// https://github.com/FortAwesome/react-native-fontawesome#build-a-library-to-reference-icons-throughout-your-app-more-conveniently
// TODO this will be an issue extending this app, probably best to put this somewhere else
const initFontAwesome = () => {
  library.add(
    faHome,
    faCloudDownloadAlt,
    faBell,
    faUser,
    faVideo,
    faTimes,
    faChevronRight,
    faFilm,
    faListUl,
    faTasks,
    faComments,
    faExternalLinkAlt,
    faCheck,
    faExclamationTriangle,
    faChevronUp,
    faLock,
    faBoxOpen,
    faExclamationCircle,
    faArrowLeft,
    faArrowRight,
    faBullhorn,
    faBookOpen,
    faPenSquare,
    faBook,
    faPen,
    faChevronLeft,
    faUnlockAlt,
    faCaretUp,
    faCaretDown
  );
};
initFontAwesome();

export default App;