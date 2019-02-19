import { Component } from 'react';
import React from 'react';
import {StyleSheet, Text, View, FlatList, Image, TouchableOpacity} from "react-native";
import {hp, widthPercentageToDP as wp} from "react-native-responsive-screen";

export class Profile extends Component {
  static navigationOptions = {
    title: 'Profile',
  };

  renderItem = ({item}) => {

    return (
      <View style={styles.activity}>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Settings')}>
          <Text style={styles.activityText}>{item.title}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  data = [
    {
      key: '1',
      title: 'Name'

    },
    {
      key: '2',
      title: 'Settings'
    },
    {
      key: '3',
      title: 'Logout'

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
