import React from 'react'
import { Component } from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { COLOR, ThemeContext, getTheme, BottomNavigation } from 'react-native-material-ui';
import { createStackNavigator, createAppContainer } from "react-navigation";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import nodejs from 'nodejs-mobile-react-native'

import { Home } from './src/features/home';
import { Course } from './src/features/course';
import config from './src/lib/config';

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

const AppNavigator = createStackNavigator(
  {
    Home: Home,
    Course: Course,
  },
  {
    initialRouteName: "Home"
  });

const AppContainer = createAppContainer(AppNavigator);

export default class App extends Component<{}> {
  state = {}

  componentWillMount()
  {
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


  render() {
    return (
      <ApolloProvider client={client}>
        <ThemeContext.Provider value={getTheme(uiTheme)}>
          <AppContainer/>
          <BottomNavigation active={this.state.active} hidden={false} style={{ container: styles.navigation }}>
            <BottomNavigation.Action
              key="home"
              icon="home"
              label="Home"
              onPress={() => this.setState({ active: 'home' })}
            />
            <BottomNavigation.Action
              key="downloads"
              icon="class"
              label="Activities"
              onPress={() => this.setState({ active: 'downloads' })}
            />
            <BottomNavigation.Action
              key="profile"
              icon="account-circle"
              label="Profile"
              onPress={() => this.setState({ active: 'profile' })}
            />
            <BottomNavigation.Action
              key="settings"
              icon="settings"
              label="Settings"
              onPress={() => this.setState({ active: 'settings' })}
            />
          </BottomNavigation>

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
