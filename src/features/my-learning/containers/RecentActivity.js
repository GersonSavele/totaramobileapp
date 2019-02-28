import {Component} from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";
import Icon from "react-native-vector-icons/FontAwesome";
import React from "react";

export default class RecentActivity extends Component {
  style = StyleSheet.create({
    lastAccessed: {
      fontSize: 20,
      justifyContent: 'center',
      height: 65,
      width: wp('100%'),
      backgroundColor: '#CECECE',
      marginTop: 10,
    },
    topText: {
      padding: 5,
      borderBottomWidth: 1,
      borderBottomColor: '#AAAAAA',
      paddingLeft: 20,
      fontWeight: 'bold',

    },
    bottomText: {
      padding: 5,
      height: 40,
      flexDirection: 'row'
    }
  })

  render() {
    return (
      <View>
        <TouchableOpacity style={this.style.lastAccessed} onPress={() => this.props.onPress()}>
          <Text style={this.style.topText}>Continue your learning</Text>
          <View style={{flexDirection: 'row', paddingLeft: 20}}>
            <Icon name="film" size={24}/>
            <Text style={this.style.bottomText}>Setting up a hierarchy</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

