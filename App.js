import React from 'react'
import { Component } from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { COLOR, ThemeContext, getTheme } from 'react-native-material-ui';
import {createStackNavigator, createAppContainer, NavigationActions} from "react-navigation";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import nodejs from 'nodejs-mobile-react-native'

import { MyLearning, Course, Profile, Settings } from './src/features';

import config from './src/lib/config';
import {createMaterialBottomTabNavigator} from "react-navigation-material-bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome";

const client = new ApolloClient({
 uri: config.mobileApi + '/graphql'
});

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const uiTheme = {
    palette: {
        primaryColor: COLOR.green800,
    }
};

const myLearning = createStackNavigator(
  {
    MyLearning: MyLearning,
    Course: Course,
  },
  {
    initialRouteName: "MyLearning"
  });

const profile = createStackNavigator(
  {
    Profile: Profile,
    Settings: Settings,
  },
  {
    initialRouteName: "Profile"
  });

const mainNavigator = createMaterialBottomTabNavigator(
  {
    MyLearning: {
      screen: myLearning,
      navigationOptions: () => ({
        tabBarIcon: ({tintColor}) => (
          <Icon
            name="home"
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
          <Icon
            name="user"
            color={tintColor}
            size={24}
          />
        )
      })
    }
  }, {
    initialRouteName: 'MyLearning',
    labeled: false,
    barStyle: { backgroundColor: '#F7F7F7' }
  }
)

const AppContainer = createAppContainer(mainNavigator);

export default class App extends Component<{}> {
  state = {}

  navigator = undefined

  componentWillMount() {
    if (config.startNodeJsMobile) {
      nodejs.start('server.js');
      nodejs.channel.addListener(
        'message',
        (msg) => {
          alert('From node: ' + msg);
        },
        this
      );
    }
  }

  navigateTo(route) {
    this.navigator &&
      this.navigator.dispatch(
        NavigationActions.navigate({ routeName: route })
      )
  }


  render() {
    return (
      <ApolloProvider client={client}>
        <ThemeContext.Provider value={getTheme(uiTheme)}>
          <AppContainer
            ref={nav => {
              this.navigator = nav;
            }}/>
        </ThemeContext.Provider>
      </ApolloProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navigation: {
    paddingBottom: 20,
    width: wp('100%'),
    height: hp('10%')
  }
});
