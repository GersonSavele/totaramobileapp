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
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import PropTypes from "prop-types";


import {learningItemCard} from "@totara/components";
import {gutter} from "@totara/theme";
import ActivityList from "./ActivityList";

const LearningItemCard = learningItemCard(null); // TODO make wrapped component to be optional

export default class CourseDetails extends React.Component {
  static navigationOptions = {
    title: "Course",
  };

  state = {
    showActivities: true,
  };

  setShowAcitivities(show) {
    this.setState({
      showActivities: show
    })
  }

  render() {
    const {item} = this.props.navigation.state.params;

    return (
      <View style={styles.container}>
        <View style={styles.learningItem}>
          <LearningItemCard item={item} imageStyle={styles.itemImage} cardStyle={styles.itemCard}/>
        </View>
        <View style={styles.activitiesContainer}>
          <View style={styles.tabNav}>
            <TouchableOpacity style={(this.state.showActivities) ? styles.tabActive : styles.tabInActive} onPress={() => this.setShowAcitivities(true)}>
              <Text style={(this.state.showActivities) ? styles.tabActive : styles.tabInActive}>Activities</Text>
            </TouchableOpacity>
            <TouchableOpacity style={(!this.state.showActivities) ? styles.tabActive : styles.tabInActive} onPress={() => this.setShowAcitivities(false)}>
              <Text style={(!this.state.showActivities) ? styles.tabActive : styles.tabInActive}>Outline</Text>
            </TouchableOpacity>
          </View>
          { (this.state.showActivities) ? <ActivityList activityGroups={item.sections}/> : <Text>Outline</Text> }
        </View>
      </View>
    );
  }
}

CourseDetails.propTypes = {
  navigation: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  learningItem: {
    flex: 2,
  },
  activitiesContainer: {
    flex: 3,
    paddingLeft: 0,

  },
  button: {
    alignItems: "center",
    padding: 10
  },
  tabNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: gutter,
    paddingTop: 20,
    height: 56,
    paddingBottom: 10,
    width: 180
  },
  tabActive: {
    fontSize: 16,
    fontWeight: "bold",
    borderBottomWidth: 3,
    borderColor: "black",
    justifyContent: "center",
  },
  tabInActive: {
    fontSize: 15,
    color: "#CECECE",
  },
  itemImage: {
    flex: 6,
  },
  itemCard: {
    flex: 2,
    backgroundColor: "#EEEEEE",
    maxHeight: 72
  },
});
