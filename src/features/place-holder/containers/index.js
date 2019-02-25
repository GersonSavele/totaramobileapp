import { Component } from 'react';
import React from 'react';
import { View } from "react-native";
import {hp, widthPercentageToDP as wp} from "react-native-responsive-screen";

export default class PlaceHolder extends Component {
  static navigationOptions = {
    title: 'Place Holder',
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      </View>
    );
  }
}
