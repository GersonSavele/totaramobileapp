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
import { createStackNavigator, createAppContainer } from "react-navigation";
import nodejs from "nodejs-mobile-react-native";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import AsyncStorage from "@react-native-community/async-storage";
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
  faEnvelope
} from "@fortawesome/free-solid-svg-icons";

import { MyLearning, CourseDetails, ProgramDetails, Profile, Settings, PlaceHolder } from "@totara/features";
import { config } from "@totara/lib";
import { ActivitySheetProvider } from "@totara/activities";
import { AuthProvider } from "@totara/auth";
import { AdditionalAction } from "@totara/auth/additional-actions";
import { TouchableIcon } from "@totara/components";
import { ThemeProvider, ThemeContext } from "@totara/theme";

class App extends React.Component<{}> {

  componentDidMount() {
    if (config.startNodeJsMobile) {
      nodejs.start("server.js");
      nodejs.channel.addListener(
        "message",
        msg => {
          alert("From node: " + msg);
        },
        this
      );
    }
  }

  render() {
    return (
      <ThemeProvider>
        <AuthProvider asyncStorage={AsyncStorage}>
          <ActivitySheetProvider>
            <AppContainer />
          </ActivitySheetProvider>
          <AdditionalAction />
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
        navigationOptions(screenProps.theme, null, null, faBell)
    },
    CourseDetails: {
      screen: CourseDetails,
      navigationOptions: ({ screenProps }) =>
        navigationOptions(screenProps.theme, null, null, faCloudDownloadAlt)
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

const tabIcon = (color, icon) => ( <FontAwesomeIcon icon={icon} color={color} size={24} /> );

const tabNavigation = (theme) => (
  createMaterialBottomTabNavigator(
    {
      MyLearning: {
        screen: myLearning,
        navigationOptions: () => ({
          tabBarIcon: ({ tintColor }) => tabIcon(tintColor, faHome)
        }),
        tabBarOnPress: ({ navigation }) => {
          navigation;
        }
      },
      Downloads: {
        screen: downloads,
        navigationOptions: () => ({
          tabBarIcon: ({ tintColor }) =>
            tabIcon(tintColor, faCloudDownloadAlt)
        })
      },
      Notification: {
        screen: notification,
        navigationOptions: () => ({
          tabBarIcon: ({ tintColor }) => tabIcon(tintColor, faEnvelope)
        })
      },
      Profile: {
        screen: profile,
        navigationOptions: () => ({
          tabBarIcon: ({ tintColor }) => tabIcon(tintColor, faUser)
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
    faUnlockAlt
  );
};
initFontAwesome();

export default App;