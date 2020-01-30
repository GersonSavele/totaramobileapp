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
 * @author Jun Yamog <jun.yamog@totaralearning.com>
 */

import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Dimensions
} from "react-native";
import { withNavigation } from "react-navigation";
import { GeneralErrorModal, LearningItemCard } from "@totara/components";
import { Log } from "@totara/lib";
import { gutter } from "@totara/theme";
import { tbPadding } from "@totara/theme";
import { translate } from "@totara/locale";
import { getCourse, CourseResponse } from "./api";
import { Course } from "@totara/types";
import ActivityAccordionList from "./ActivityAccordionList";

type courseProps = {
  course: Course;
};

// TODO: turn the graphql loading, error, HOC and navigation to be a single component
const CourseDetails = withNavigation(
  getCourse(({ loading, course, error }: CourseResponse) => {
    if (loading) return <Text>{translate("general.loading")}</Text>;
    if (error) {
      Log.error("Error getting course details", error);
      return <GeneralErrorModal siteUrl="" />;
    }
    if (course) {
      return <CourseDetailsComponent course={course} />;
    }
  })
);

const CourseDetailsComponent = ({ course }: courseProps) => {
  const [showActivities, setShowActivities] = useState(false);
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <LearningItemCard
            item={course}
            imageStyle={styles.itemImage}
            cardStyle={styles.itemCard}
          >
            <View style = {{width: 48, marginTop: 8,
  height: 16,
  borderRadius: 8,
  borderStyle: "solid",
  borderWidth: 1,
  borderColor: "#7d7d7d"}}><Text style = {{ width: 46,
   height: 14,
  fontSize: 10,
  fontWeight: "500",
  fontStyle: "normal",
  lineHeight: 12,
  letterSpacing: 0,
  textAlign: "center",
  color: "#888888"}}>Course</Text></View>
        </LearningItemCard>
        </View>
        <View style={styles.tabBarContainer}>
          <View style={styles.viewSeparator}></View>
          <View style={styles.tabNav}>
          {/* <TouchableOpacity style= {{borderBottomWidth: 3,borderColor: "#4a4a4a"}} onPress={() => setShowActivities(false)}> */}
            <TouchableOpacity onPress={() => setShowActivities(false)}>
              <Text style={!showActivities ? styles.textActive : styles.textInActive}>
                {translate("course-details.overview")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowActivities(true)}>
              <Text style={showActivities ? styles.textActive : styles.textInActive}>
                {translate("course-details.activities")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.activitiesContainer}>
          {/* <View style={styles.toggleViewContainer}>
            <Text style={styles.toggleText}>Expand/ Collapse all topics</Text>
            <Switch
              style={styles.toggleView}
              value={true} // set the value into the tracked state
              onValueChange={() => console.log()} // give the function that would handle value change for this component
              //   disabled={false}
              trackColor={{ true: "#c7c7c7", false: "#FFF" }}
            />
          </View> */}
          {showActivities ? <ActivityAccordionList sections ={course.sections} /> : <View></View>}
          
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    maxHeight: 250,
    minHeight: 200
  },
  itemImage: {
    flex: 3
  },
  itemCard: {
    flex: 0.6,
    maxHeight: 80,
    minHeight: 60
  },
  tabBarContainer: {
    flex: 0.25,
    backgroundColor: "#f5f5f5",
    maxHeight: 50,
    minHeight: 44
  },
  viewSeparator: {
    height: 0.5,
    backgroundColor: "#e6e6e6",
    marginLeft: 20,
    marginRight: 20
  },
  tabNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: gutter,
    paddingTop: tbPadding,
    paddingBottom: tbPadding,
    marginLeft:gutter,
    width: Dimensions.get("window").width*0.6
  },
  activitiesContainer: {
    flex: 3,
    padding: 0,
    backgroundColor: "#FFFFFF"
  },
  toggleViewContainer: {
    flex: 0.25,
    backgroundColor: "#FFFFFF",
    maxHeight: 50,
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: Dimensions.get("window").width
  },
  toggleText: {
    fontWeight: "500",
    marginLeft: 16,
    color: "#3d444b",
    justifyContent: "center"
  },
  toggleView: {
    marginRight: 16,
    borderColor: "#c7c7c7"
  },
  textActive: {
    fontWeight: "500",
    color: "#3d444b",
    justifyContent: "center"
  },
  textInActive: {
    fontSize: 15,
    color: "#CECECE"
  }
});

export default CourseDetails;
