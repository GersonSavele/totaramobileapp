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

import React from "react";
import {View} from "react-native";
import ApolloClient from "apollo-boost";
import {ApolloProvider} from "react-apollo";
import {createStackNavigator, createAppContainer, NavigationActions} from "react-navigation";
import nodejs from "nodejs-mobile-react-native";
import {StyleProvider} from "native-base";
import {createMaterialBottomTabNavigator} from "react-navigation-material-bottom-tabs";
import { library } from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome"
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
  faExclamationTriangle} from "@fortawesome/free-solid-svg-icons"

import {MyLearning, Course, Profile, Settings, PlaceHolder} from "@totara/features";
import {config} from "@totara/lib";
import {theme, getTheme} from "@totara/theme";

const client = new ApolloClient({
  uri: config.mobileApi + "/graphql"
});

export default class App extends React.Component<{}> {
  state = {};

  navigator = undefined;

  componentDidMount() {
    if (config.startNodeJsMobile) {
      nodejs.start("server.js");
      nodejs.channel.addListener(
        "message",
        (msg) => {
          alert("From node: " + msg);
        },
        this
      );
    }
  }

  navigateTo(route) {
    this.navigator &&
    this.navigator.dispatch(
      NavigationActions.navigate({routeName: route})
    );
  }


  render() {
    return (
      <ApolloProvider client={client}>
        <StyleProvider style={getTheme(theme)}>
          <AppContainer
            ref={nav => {
              this.navigator = nav;
            }}/>
        </StyleProvider>
      </ApolloProvider>
    );
  }
}

const navigationOptions = {
  headerStyle: {
    borderBottomWidth: 0
  },
  headerBackTitle: null
};

const myLearning = createStackNavigator(
  {
    MyLearning: MyLearning,
    Course: {
      screen: Course,
      navigationOptions: {
        headerRight: <View style={{paddingRight: 10}}><FontAwesomeIcon icon={faCloudDownloadAlt} size={24}/></View>
      }
    },
  },
  {
    initialRouteName: "MyLearning",
    defaultNavigationOptions: navigationOptions
  });

const profile = createStackNavigator(
  {
    Profile: Profile,
    Settings: Settings,
  },
  {
    initialRouteName: "Profile",
    defaultNavigationOptions: navigationOptions
  });

const notification = createStackNavigator(
  {
    Notification: PlaceHolder,
  },
  {
    initialRouteName: "Notification",
    defaultNavigationOptions: navigationOptions
  });

const downloads = createStackNavigator(
  {
    Downloads: PlaceHolder,
  },
  {
    initialRouteName: "Downloads",
    defaultNavigationOptions: navigationOptions
  });


const mainNavigator = createMaterialBottomTabNavigator(
  {
    MyLearning: {
      screen: myLearning,
      navigationOptions: () => ({
        tabBarIcon: ({tintColor}) => (
          <FontAwesomeIcon
            icon={faHome}
            color={tintColor}
            size={24}
          />
        )
      }),
      tabBarOnPress: ({navigation}) => {
        navigation;
      }
    },
    Downloads: {
      screen: downloads,
      navigationOptions: () => ({
        tabBarIcon: ({tintColor}) => (
          <FontAwesomeIcon
            icon={faCloudDownloadAlt}
            color={tintColor}
            size={24}
          />
        )
      })
    },
    Notification: {
      screen: notification,
      navigationOptions: () => ({
        tabBarIcon: ({tintColor}) => (
          <FontAwesomeIcon
            icon={faBell}
            color={tintColor}
            size={24}
          />
        )
      })
    },
    Profile: {
      screen: profile,
      navigationOptions: () => ({
        tabBarIcon: ({tintColor}) => (
          <FontAwesomeIcon
            icon={faUser}
            color={tintColor}
            size={24}
          />
        )
      })
    }
  }, {
    initialRouteName: "MyLearning",
    labeled: false,
    barStyle: {backgroundColor: "#F7F7F7"},
  }
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
    faExclamationTriangle
  );
};
initFontAwesome();


const AppContainer = createAppContainer(mainNavigator);