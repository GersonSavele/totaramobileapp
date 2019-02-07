import React from 'react'
import { Component } from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import { Home } from './src/features/home';
import { Course } from './src/features/course';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { COLOR, ThemeContext, getTheme, BottomNavigation } from 'react-native-material-ui';
import { createStackNavigator, createAppContainer } from "react-navigation";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


const client = new ApolloClient({
//  uri: 'http://10.0.8.178:4000/graphql'
  uri: 'http://10.0.1.51:4000/graphql'
});

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const uiTheme = {
    palette: {
        primaryColor: COLOR.greenA700,
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


  render() {
    return (
      <ApolloProvider client={client}>
        <ThemeContext.Provider value={getTheme(uiTheme)}>
          <AppContainer/>
          <BottomNavigation active={this.state.active} hidden={false} style={{ container: styles.navigation }}>
            <BottomNavigation.Action
              key="today"
              icon="today"
              label="Today"
              onPress={() => this.setState({ active: 'today' })}
            />
            <BottomNavigation.Action
              key="people"
              icon="people"
              label="People"
              onPress={() => this.setState({ active: 'people' })}
            />
            <BottomNavigation.Action
              key="bookmark-border"
              icon="bookmark-border"
              label="Bookmark"
              onPress={() => this.setState({ active: 'bookmark-border' })}
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
