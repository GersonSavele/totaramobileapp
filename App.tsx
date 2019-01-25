import React from 'react'
import { Component } from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import { Home } from './src/features/home';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

const client = new ApolloClient({
  uri: 'http://10.0.8.178:4000/graphql'
});

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});


export default class App extends Component<{}> {
  render() {
    return (
      <ApolloProvider client={client}>
        <Home/>
      </ApolloProvider>
    );
  }
}
