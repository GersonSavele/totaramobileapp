import React from 'react'
import { Component } from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import { Home } from './src/features/home/index';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { COLOR, ThemeContext, getTheme } from 'react-native-material-ui';

const client = new ApolloClient({
  uri: 'http://10.0.8.178:4000/graphql'
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
    },
    toolbar: {
        container: {
            height: 50,
        },
    },
};

export default class App extends Component<{}> {
  render() {
    return (
      <ApolloProvider client={client}>
        <ThemeContext.Provider value={getTheme(uiTheme)}>
          <Home/>
        </ThemeContext.Provider>
      </ApolloProvider>
    );
  }
}
