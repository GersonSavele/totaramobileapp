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
 */

import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import PropTypes from "prop-types";
import * as Animatable from "react-native-animatable";
import lodash from "lodash";

import { ActivityLauncher, LearningItemCard, GeneralErrorModal } from "@totara/components";
import { normalize } from "@totara/theme";
import { translate } from "@totara/locale";
import { ActivitySheetConsumer } from "@totara/activities";

import CourseSetList from "./CourseSetList";
import { getProgram } from "./api";
import { Log } from "@totara/lib";

const ProgramDetails = getProgram(({loading, program, error}) => {
  if (loading) return <Text>{translate("general.loading")}</Text>;

  if (error) {
    Log.error("Error getting program details", error);
    return <GeneralErrorModal/>;
  }

  if (program) {
    return(
      <ProgramDetailsComponent program={program}/>
    )
  }
});

export default ProgramDetails;

class ProgramDetailsComponent extends React.Component {

  constructor(props) {
    super(props);
    this.learningItemRef = React.createRef();
  }
  
  state = {
    showActivities: true,
  };

  setShowAcitivities(show) {
    this.setState({
      showActivities: show
    })
  }

  animate = lodash.throttle((flex) => {
    this.learningItemRef.current.transitionTo({flex: flex})
  }, 160);

  onScroll = (event) => {
    const flex = 2 - (event.nativeEvent.contentOffset.y/120);
    this.animate(flex)
  };

  extendProgram = () => {};
  activity = { // TODO mock activity, put into graphql
    id: 1,
    itemName: 'Setting up a hierarchy',
    type: 'video',
    progressPercentage: 45,
    summary: "In this brief tutorial, you’ll explore what hierarchies are, how they are structured and the benefits of\n" +
      "using them. You’ll also find out about job assignments in Totara Learn.",
    imgSrc: "panel1.png"
  };

  render() {
    const item = this.props.program;

    return (
      <View style={styles.container}>
        <Animatable.View style={styles.learningItem} ref={this.learningItemRef}>
          <LearningItemCard item={item} imageStyle={styles.itemImage} cardStyle={styles.itemCard} onExtension={this.extendProgram}>
            <View style={styles.activeActivityContainer}>
              <View style={styles.activeActivity}>
                <ActivitySheetConsumer>
                  {({setCurrentActivity}) =>
                    <ActivityLauncher item={this.activity} onPress={(activity) => setCurrentActivity(activity)}/>
                  }
                </ActivitySheetConsumer>
              </View>
            </View>
          </LearningItemCard>
        </Animatable.View>
        <View style={styles.activitiesContainer}>
          <View style={styles.tabNav}>
            <TouchableOpacity style={(this.state.showActivities) ? styles.tabActive : styles.tabInActive} onPress={() => this.setShowAcitivities(true)}>
              <Text style={(this.state.showActivities) ? styles.tabActive : styles.tabInActive}>{translate("program-details.courses")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={(!this.state.showActivities) ? styles.tabActive : styles.tabInActive} onPress={() => this.setShowAcitivities(false)}>
              <Text style={(!this.state.showActivities) ? styles.tabActive : styles.tabInActive}>{translate("program-details.details")}</Text>
            </TouchableOpacity>
          </View>
          { (this.state.showActivities) ? <CourseSetList courseSet={item.courseSet} onScroll={this.onScroll}/> : <Text>{translate("program-details.outline")}</Text> }
        </View>
      </View>
    );
  }
}

ProgramDetailsComponent.propTypes = {
  program: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  learningItem: {
    flex: 2,
  },
  activitiesContainer: {
    flex: 3,
    backgroundColor: "#FFFFFF",
  },
  activeActivityContainer: {
    backgroundColor: "#F5F5F5",
  },
  activeActivity: {
    borderRadius: normalize(10),
    borderWidth: 1,
    borderColor: "#F0F0F0",
    backgroundColor: "#FFFFFF",
    shadowRadius: normalize(14),
    overflow: "hidden",
  },
  tabNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 16,
    paddingTop: 24,
    paddingBottom: 24,
    width: 150,
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
    flex: 3.5,
  },
  itemCard: {
    flex: 2,
    justifyContent: "space-between",
    backgroundColor: "#F5F5F5",
  },
});
