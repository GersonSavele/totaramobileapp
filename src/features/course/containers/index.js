import { Component } from 'react';
import React from 'react';
import {StyleSheet, Text, View, FlatList, Image, TouchableOpacity, List} from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";

import config from '../../../lib/config';
import moment from "moment";
import {Button} from "react-native-material-ui";
import Icon from "react-native-vector-icons/FontAwesome";
import DueDateState from "../../../components/DueDateState";

export default class Course extends Component {
  static navigationOptions = {
    title: 'Course',
  };

  renderActivity = ({item}) => {

    return (
      <View style={styles.activity}>
        <Icon name={item.type} size={24}/>
        <Text style={styles.activityText}>{item.itemName}</Text>
      </View>
    )
  }

  render() {
    const { item } = this.props.navigation.state.params

    const LearningItem = () => renderLearningItem(() => {})({ item })

    return (
      <View style={styles.container}>
        <View style={{height: hp('26%'), width: wp('100%')}}>
          <LearningItem/>
        </View>
        <View style={{height: hp('50%'), width: wp('100%')}}>
          <View style={styles.tabNav}>
            <Text style={styles.tabActive}>Activities</Text>
            <Text style={styles.tabInActive}>Outline</Text>
          </View>
          <FlatList style={styles.activities}
            data={item.activities}
            renderItem={this.renderActivity}
            keyExtractor={ (item, index) => item.id.toString() }
          />
        </View>
        <View style={{width: wp('80%'), padding: 5}}>
          <Button raised primary text={'Continue your learning'} upperCase={false}/>
        </View>
      </View>
    );
  }
}

const renderLearningItem = (courseNavigate) => ( {item, index} ) => {
  const imgSrc = config.mobileStatic + '/public/' + item.id + '.JPG'

  return (
    <TouchableOpacity key={item.id} onPress={courseNavigate} activeOpacity={1.0}>
      <Image source={{uri: imgSrc}} style={{width: '100%', height: '50%'}}/>
      <DueDateState dueDateState={item.dueDateState} dueDate={item.dueDate}/>
      <View style={styles.itemCard}>
        <Text style={styles.itemFullName}>{item.fullname}</Text>
        <View style={styles.itemInfo}>
          <Text style={styles.itemType}>{item.type}</Text>
          <Text> | {item.progressPercentage}%</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 50,
  },
  activity: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    margin: 0,
    backgroundColor: '#FFFFFF',
  },
  activityText: {
    fontSize: 15,
    padding: 10,
  },
  activities: {
    padding: 10
  },
  button: {
    alignItems: 'center',
    padding: 10
  },
  tabNav: {
    flexDirection: "row",
    padding: 10,
    paddingTop: 30,
  },
  tabActive: {
    paddingRight: 20,
    fontSize: 15,
    fontWeight: 'bold',
    borderBottomWidth: 2
  },
  tabInActive: {
    fontSize: 15,
    color: '#CECECE'
  },
  itemCard: {
    padding: 20,
    backgroundColor: '#EEEEEE',
  },
  itemType: {
    fontSize: 10,
    fontWeight: 'bold',
    padding: 2,
    color: '#86C9C8'
  },
  itemFullName: {
    fontSize: 25,
  },
  itemInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 10
  },
  itemSummary: {
    paddingTop: 10,
    paddingBottom: 10
  },

});
