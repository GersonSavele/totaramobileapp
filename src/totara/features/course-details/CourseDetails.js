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
import {FlatList, Text, View} from "react-native";
import PropTypes from "prop-types";

import {Button} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import {learningItemCard} from "../../components/index";
import styles from "./styles/CourseDetails"


export default class CourseDetails extends React.Component {
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

    const LearningItemCard = learningItemCard(null); // TODO make wrapped component to be optional

    return (
      <View style={styles.container}>
        <View style={styles.learningItem}>
          <LearningItemCard item={item} imageStyle={styles.itemImage} cardStyle={styles.itemCard}/>
        </View>
        <View style={styles.activitiesContainer}>
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
        <View style={styles.buttonContainer}>
          <Button block><Text>Continue your learning</Text></Button>
        </View>
      </View>
    );
  }
}

CourseDetails.propTypes = {
  navigation: PropTypes.object.isRequired
};