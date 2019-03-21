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
import {SectionList, Text, View} from "react-native";
import PropTypes from "prop-types";

import {Button} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import {learningItemCard} from "@totara/components";
import styles from "./styles/CourseDetails"


export default class CourseDetails extends React.Component {
  static navigationOptions = {
    title: "Course",
  };

  renderSection = ({section: {groupName}}) => {
    return (
      <View style={styles.sectionHeader}>
        <Text>{groupName}</Text>
      </View>
    );
  };

  renderFooter = () => {
    return (
      <View style={styles.sectionFooter}>
      </View>
    );
  };

  renderActivity = ({item}) => {
    return (
      <View style={styles.activity}>
          <View style={styles.iconcircle}>
              <Icon name={item.type} size={24} color={"white"}/>
          </View>
          <View style={{flex: 1}}>
              <Text style={styles.activityText}>{item.itemName}</Text>
              <Text style={styles.activitySummaryText}>Nemo enim ipsam voluptatem quia voluptas</Text>
          </View>

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
          <SectionList style={styles.activities}
                       sections={item.activityGroups}
                       renderSectionHeader={this.renderSection}
                       renderItem={this.renderActivity}
                       renderSectionFooter={this.renderFooter}
                       keyExtractor={(item, index) => item.id.toString() + index}/>
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