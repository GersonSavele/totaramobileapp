import { Component } from 'react';
import React from 'react';
import {StyleSheet, Text, View, FlatList, Image} from "react-native";
import {hp, widthPercentageToDP as wp} from "react-native-responsive-screen";

import config from '../../../lib/config';

export default class Course extends Component {
  static navigationOptions = {
    title: 'Course',
  };

  renderItem = ({item}) => {
    let imgSrc = config.mobileStatic + '/public/panel' + item.key + '.png'

    return (
      <View style={styles.activity}>
        <Text style={styles.activityText}>{item.title}</Text>
        <Image source={{uri: imgSrc}} style={{width: wp('100%'), height: 240}}/>
      </View>
    )
  }

  courseActivities = [
    {
      key: '1',
      title: 'Setting up a hierarchy'

    },
    {
      key: '2',
      title: 'Adding job assignments'
    },
    {
      key: '3',
      title: 'Importing hierarchies via HR import'

    },

  ]

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <FlatList
          data={this.courseActivities}
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
