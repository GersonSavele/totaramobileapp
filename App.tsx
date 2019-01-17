import React from 'react'
import { Component } from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import { Home, homeProps } from './src/features/home';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});


export default class App extends Component<{}> {
  render() {
    return (
      <Home coursesPrograms={homeProps}/>
    );
  }
}
