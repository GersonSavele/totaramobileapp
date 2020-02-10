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

import React, { useState, useContext } from "react";
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
import { normalize } from "@totara/theme";
import { translate } from "@totara/locale";
import { getCourse, CourseResponse } from "./api";
import { Course } from "@totara/types";
import ActivityList from "./ActivityList";
import OverviewDetails from "./OverviewDetails"
import { ThemeContext } from "@totara/theme";

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

const CourseDetailsComponent = ({ course }: { course: Course }) => {
  const [showActivities, setShowActivities] = useState(false);
  const [theme] = useContext(ThemeContext);
  return (
    <ScrollView>
      <View style={styles.container}>
        <View
          style={[
            styles.headerContainer,
            { backgroundColor: theme.colorNeutral2 }
          ]}
        >
          <LearningItemCard
            item={course}
            imageStyle={styles.itemImage}
            cardStyle={styles.itemCard}
          >
            <View
              style={[
                styles.courseLabelWrap,
                { borderColor: theme.colorNeutral6 }
              ]}
            >
              <Text
                style={[styles.courseLabelText, { color: theme.colorNeutral6 }]}
              >
                Course
              </Text>
            </View>
          </LearningItemCard>
        </View>
        <View
          style={[
            styles.tabBarContainer,
            { backgroundColor: theme.colorNeutral2 }
          ]}
        >
          <View
            style={[
              styles.viewSeparator,
              { backgroundColor: theme.colorNeutral3 }
            ]}
          ></View>
          <View style={styles.tabNav}>
            <TouchableOpacity
              style={
                !showActivities
                  ? [
                      styles.tabSelected,
                      {
                        borderBottomColor: theme.colorNeutral7,
                        borderBottomWidth: 2
                      }
                    ]
                  : [styles.tabSelected]
              }
              onPress={() => setShowActivities(false)}
            >
              <Text
                style={
                  !showActivities
                    ? [theme.textB3]
                    : [theme.textB3, { color: theme.colorNeutral6 }]
                }
              >
                {translate("course-details.overview")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                showActivities
                  ? [
                      styles.tabSelected,
                      {
                        borderBottomColor: theme.colorNeutral7,
                        borderBottomWidth: 2
                      }
                    ]
                  : [styles.tabSelected]
              }
              onPress={() => setShowActivities(true)}
            >
              <Text
                style={
                  showActivities
                    ? [theme.textB3]
                    : [theme.textB3, { color: theme.colorNeutral6, paddingLeft: 8, paddingRight: 8 }]
                }
              >
                {translate("course-details.activities")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={[
            styles.activitiesContainer,
            { backgroundColor: theme.colorNeutral1 }
          ]}
        >
          {showActivities ? <Activities course={course} /> : <OverviewDetails course = {course}/>}
        </View>
      </View>
    </ScrollView>
  );
};

const Activities = ({ course }: { course: Course }) => {
  //To Do: This UI implementation not related for this ticket(All activity expanding), Later this design will be usefull when function will be implemented   
 
  // const [theme] = useContext(ThemeContext);
  return (
    <View>
      {/* <View
        style={[
          styles.toggleViewContainer,
          { backgroundColor: theme.colorNeutral1 }
        ]}
      >
        <Text style={[theme.textH3, { color: theme.colorNeutral8 }]}>
          Expand/ Collapse all topics
        </Text>
        <Switch
          style={[{ borderColor: theme.colorNeutral5 }]}
          value={true} // set the value into the tracked state
          onValueChange={() => console.log()} // give the function that would handle value change for this component
          //   disabled={false}
          trackColor={{
            true: theme.colorNeutral5,
            false: theme.colorNeutral1
          }}
        />
      </View> */}
      <ActivityList sections={course.sections} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerContainer: {
    flex: 1,
    maxHeight: 350,
    minHeight: 300
  },
  itemImage: {
    flex: 3,
    minHeight: 150
  },
  itemCard: {
    flex: 0.6,
    maxHeight: 80,
    minHeight: 60
  },
  tabBarContainer: {
    flex: 0.25,
    maxHeight: 50,
    minHeight: 44
  },
  viewSeparator: {
    height: 0.5,
    marginLeft: 20,
    marginRight: 20
  },
  tabNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: normalize(48),
    width: Dimensions.get("window").width * 0.5,
    alignItems: "center",
    flex: 1
  },
  activitiesContainer: {
    flex: 3,
    padding: 0
  },
  toggleViewContainer: {
    flex: 0.25,
    marginLeft: 16,
    marginRight: 16,
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: Dimensions.get("window").width - 32
  },
  courseLabelWrap: {
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 8,
    borderStyle: "solid",
    borderWidth: 1,
    alignSelf: "flex-start",
    alignItems: "center"
  },
  courseLabelText: {
    fontSize: 10,
    fontWeight: "500",
    fontStyle: "normal",
    textAlign: "center",
    paddingLeft: 4,
    paddingRight: 4,
    paddingTop: 1,
    paddingBottom: 2
  },
  tabSelected: {
    height: "100%",
    justifyContent: "center",
    paddingLeft: 12, 
    paddingRight: 12
  }
});

export default CourseDetails;
