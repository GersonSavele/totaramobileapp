/**
 * This file is part of Totara Mobile
 *
 * Copyright (C) 2019 onwards Totara Learning Solutions LTD
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @author Jun Yamog <jun.yamog@totaralearning.com
 *
 */

import React from "react";
import {FlatList, Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import PropTypes from 'prop-types';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";

import config from "../../../lib/config";
import {Button} from "react-native-material-ui";
import Icon from "react-native-vector-icons/FontAwesome";
import DueDateState from "../../../components/DueDateState";

export default class Course extends React.Component {
  static navigationOptions = {
    title: "Course",
  };

  renderActivity = ({item}) => {

    return (
      <View style={styles.activity}>
        <Icon name={item.type} size={24}/>
        <Text style={styles.activityText}>{item.itemName}</Text>
      </View>
    );
  };

  render() {
    const {item} = this.props.navigation.state.params;

    const LearningItem = () => renderLearningItem(() => {
    })({item});

    return (
      <View style={styles.container}>
        <View style={{height: hp("26%"), width: wp("100%")}}>
          <LearningItem/>
        </View>
        <View style={{height: hp("50%"), width: wp("100%")}}>
          <View style={styles.tabNav}>
            <Text style={styles.tabActive}>Activities</Text>
            <Text style={styles.tabInActive}>Outline</Text>
          </View>
          <FlatList style={styles.activities}
                    data={item.activities}
                    renderItem={this.renderActivity}
                    keyExtractor={(item) => item.id.toString()}
          />
        </View>
        <View style={{width: wp("80%"), padding: 5}}>
          <Button raised primary text={"Continue your learning"} upperCase={false}/>
        </View>
      </View>
    );
  }
}

Course.propTypes = {
  navigation: PropTypes.object.isRequired
};

const renderLearningItem = (courseNavigate) => {

  const LearningItem = ({item}) => {
    const imgSrc = `${config.mobileStatic}/public/${item.id}.JPG`;

    return <TouchableOpacity key={item.id} onPress={courseNavigate} activeOpacity={1.0}>
      <Image source={{uri: imgSrc}} style={{width: "100%", height: "50%"}}/>
      <DueDateState dueDateState={item.dueDateState} dueDate={item.dueDate}/>
      <View style={styles.itemCard}>
        <Text style={styles.itemFullName}>{item.fullname}</Text>
        <View style={styles.itemInfo}>
          <Text style={styles.itemType}>{item.type}</Text>
          <Text> | {item.progressPercentage}%</Text>
        </View>
      </View>
    </TouchableOpacity>;
  };

  LearningItem.propTypes = {
    item: PropTypes.object.isRequired
  };

  return LearningItem;
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  header: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 50,
  },
  activity: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    textAlign: "center",
    fontWeight: "bold",
    margin: 0,
    backgroundColor: "#FFFFFF",
  },
  activityText: {
    fontSize: 15,
    padding: 10,
  },
  activities: {
    padding: 10
  },
  button: {
    alignItems: "center",
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
    fontWeight: "bold",
    borderBottomWidth: 2
  },
  tabInActive: {
    fontSize: 15,
    color: "#CECECE"
  },
  itemCard: {
    padding: 20,
    backgroundColor: "#EEEEEE",
  },
  itemType: {
    fontSize: 10,
    fontWeight: "bold",
    padding: 2,
    color: "#86C9C8"
  },
  itemFullName: {
    fontSize: 25,
  },
  itemInfo: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingTop: 10
  },
  itemSummary: {
    paddingTop: 10,
    paddingBottom: 10
  },

});
