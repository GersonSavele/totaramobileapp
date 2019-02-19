import { Component } from 'react';
import React from 'react';
import {StyleSheet, Text, View, FlatList, Image} from "react-native";
import {hp, widthPercentageToDP as wp} from "react-native-responsive-screen";

export class Settings extends Component {
  static navigationOptions = {
    title: 'Settings',
  };

  renderItem = ({item}) => {

    return (
      <View style={styles.activity}>
        <Text style={styles.activityText}>{item.title}</Text>
      </View>
    )
  }

  data = [
    {
      key: '1',
      title: 'Foo'

    },
    {
      key: '2',
      title: 'Bar'
    },
    {
      key: '3',
      title: 'Stuff'

    },

  ]

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <FlatList
          data={this.data}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 50,
  },
  activity: {
    flex: 1,
    marginTop: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    margin: 0,
    backgroundColor: '#FFFFFF',
    width: wp('100%')
  },
  activityText: {
    fontSize: 20,
    padding: 10,
  },
  button: {
    alignItems: 'center',
    padding: 10
  },
});
