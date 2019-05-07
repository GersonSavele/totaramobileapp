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
import {withNavigation} from "react-navigation";
import * as Animatable from "react-native-animatable";

import {LearningItemCard} from "@totara/components";
import {gutter} from "@totara/theme";
import {tbPadding} from "@totara/theme";
import ActivityList from "./ActivityList";
import {getCourse} from "./api";
import {translate} from "@totara/locale";

// TODO: turn the graphql loading, error, HOC and navigation to be a single component
const CourseDetails = withNavigation(getCourse(({loading, course, error}) => {
  if (loading) return <Text>{translate("general.loading")}</Text>;

  if (error) {
    console.log("error", error); // TODO turn this into a logging system
    return <Text>{translate("general.error")}(</Text>;
  }

  if (course) {
    return(
      <CourseDetailsComponent course={course}/>
    )
  }
}));

export default CourseDetails;

class CourseDetailsComponent extends React.Component {

  state = {
    showActivities: true,
  };

  setShowAcitivities(show) {
    this.setState({
      showActivities: show
    })
  }

  handleLearningItemRef = (ref) => {
    this.learningItemRef = ref;
  };

  onScroll = (event) => {
    const flex = 2 - (event.nativeEvent.contentOffset.y/120);
    this.learningItemRef.transitionTo({ flex: flex});
 };

  render() {
    const item = this.props.course;

    return (
      <View style={styles.container}>
        <Animatable.View style={styles.learningItem} ref={this.handleLearningItemRef}>
          <LearningItemCard item={item} imageStyle={styles.itemImage} cardStyle={styles.itemCard}/>
        </Animatable.View>
        <View style={styles.activitiesContainer}>
          <View style={styles.tabNav}>
            <TouchableOpacity style={(this.state.showActivities) ? styles.tabActive : styles.tabInActive} onPress={() => this.setShowAcitivities(true)}>
              <Text style={(this.state.showActivities) ? styles.tabActive : styles.tabInActive}>{translate("course-details.activities")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={(!this.state.showActivities) ? styles.tabActive : styles.tabInActive} onPress={() => this.setShowAcitivities(false)}>
              <Text style={(!this.state.showActivities) ? styles.tabActive : styles.tabInActive}>{translate("course-details.outline")}</Text>
            </TouchableOpacity>
          </View>
          { (this.state.showActivities) ? <ActivityList activityGroups={item.sections} onScroll={this.onScroll}/> : <Text>{translate("course-details.outline")}</Text> }
        </View>
      </View>
    );
  }
}

CourseDetailsComponent.propTypes = {
  course: PropTypes.object.isRequired
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
    backgroundColor: "#FFFFFF",
  },
  tabNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: gutter,
    paddingTop: tbPadding,
    paddingBottom: tbPadding,
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
