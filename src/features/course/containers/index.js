import { Component } from 'react';
import React from 'react';
import {Text, View} from "react-native";

export class Course extends Component {
  static navigationOptions = {
    title: 'Course',
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Details Screen</Text>
      </View>
    );
  }
}