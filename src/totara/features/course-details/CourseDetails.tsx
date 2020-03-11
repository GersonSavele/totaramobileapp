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
  TouchableOpacity,
  //Switch, To Do: This UI implementation not related for this ticket(All activity expanding), Later this design will be usefull when function will be implemented
  Dimensions
} from "react-native";
import {
  withNavigation,
  NavigationParams,
  NavigationInjectedProps
} from "react-navigation";
import {
  GeneralErrorModal,
  CardElement,
  ImageElement,
  PrimaryButton,
  InfoModal
} from "@totara/components";
import { useQuery } from "@apollo/react-hooks";
import { normalize } from "@totara/theme";
import { translate } from "@totara/locale";
import { coreCourse } from "./api";
import { Course } from "@totara/types";
import { ActivityList } from "./ActivityList";
import OverviewDetails from "./OverviewDetails";
import { ThemeContext } from "@totara/theme";
import { NAVIGATION_MY_LEARNING } from "@totara/lib/Constant";
import ParallaxScrollView from "./ParallaxScrollView/ParallaxScrollView";

type CourseDetailsProps = {
  course: Course;
  refetch: () => {};
  navigation?: NavigationParams;
};

type CourseCompletedProps = {
  course: Course;
  navigation?: NavigationParams;
};

const CourseDetails = ({ navigation }: NavigationInjectedProps) => {
  const courseId  = navigation.getParam("courseId")
  const { loading, error, data, refetch } = useQuery(coreCourse, {
     variables: { courseid: courseId }
    // variables: { courseid: 1 }
  });
  if (loading) return null;
  if (error) return <GeneralErrorModal siteUrl="" />;
  if (data) {
    return <CourseDetailsComponent course={data.course} refetch={refetch} />;
  }
};

 const CourseDetailsComponent = withNavigation(
  ({ navigation, course, refetch }: CourseDetailsProps) => {
    const [showActivities, setShowActivities] = useState(false);
    const [theme] = useContext(ThemeContext);
    const renderNavigationTitle = () => {
      return (
        <View style={{ backgroundColor: theme.colorNeutral2 }}>
          <CardElement item={course} cardStyle={styles.itemCard}>
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
          </CardElement>
        </View>
      );
    };

    const renderNavigationTab = () => {
      return (
        <View
          style={[
            styles.tabBarContainer,
            { backgroundColor: theme.colorNeutral2 }
          ]}
        >
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
                    ? [theme.textB3, { fontWeight: "400" }]
                    : [
                        theme.textB3,
                        { color: theme.colorNeutral6, fontWeight: "400" }
                      ]
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
                    ? [theme.textB3, { fontWeight: "400" }]
                    : [
                        theme.textB3,
                        {
                          color: theme.colorNeutral6,
                          fontWeight: "400"
                        }
                      ]
                }
              >
                {translate("course-details.activities")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    };
    const scrollViewRender = () => {
      return (
        <View
          style={[
            styles.headerContainer,
            { backgroundColor: theme.colorNeutral2 }
          ]}
        >
          <ImageElement item={course} imageStyle={styles.itemImage} />
        </View>
      );
    };

    return (
      <View style={styles.container}>
        <ParallaxScrollView
          parallaxHeaderHeight={normalize(320)}
          renderBackground={scrollViewRender}
          tabBar={renderNavigationTab}
          titleBar={renderNavigationTitle}
          onChangeHeaderVisibility={(value: number) => {
            if (value > 0) {
              navigation!.setParams({
                opacity: value / 100 > 0.5 ? 1 : value / 100
              });
              navigation!.setParams({ title: course.fullname });
            } else if (-value / 100 > 1) {
              navigation!.setParams({
                opacity: (100 + value) / 100 > 0.5 ? 1 : (100 + value) / 100
              });
              navigation!.setParams({ title: course.fullname });
            } else {
              navigation!.setParams({ title: "" });
            }
          }}
        >
          <View
            style={[styles.container, { backgroundColor: theme.colorNeutral2 }]}
          >
            <View
              style={[
                styles.activitiesContainer,
                { backgroundColor: theme.colorNeutral1 }
              ]}
            >
              {showActivities ? (
                <Activities course={course} refetch={refetch} />
              ) : (
                <OverviewDetails course={course} />
              )}
            </View>
          </View>
        </ParallaxScrollView>
        <CourseCompleted course={course} />
      </View>
    );
  }
);

const CourseCompleted = withNavigation(
  ({ navigation, course }: CourseCompletedProps) => {
    const [show, setShow] = useState(true);
    const onClose = () => {
      setShow(!show);
      navigation!.navigate(NAVIGATION_MY_LEARNING);
    };

    if (
      course.completion &&
      (course.completion.statuskey as string) == "complete"
    ) {
      return (
        <InfoModal
          transparent={true}
          title={translate("course_complete.title")}
          description={translate("course_complete.description")}
          imageType="course_complete"
          visible={show}
        >
          <PrimaryButton
            text={translate("course_complete.button_title")}
            onPress={onClose}
          />
        </InfoModal>
      );
    } else {
      return null;
    }
  }
);

const Activities = ({ course, refetch }: CourseDetailsProps) => {
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
      <ActivityList sections={course.sections} refetch={refetch} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerContainer: {
    flex: 1,
    maxHeight: normalize(340),
    minHeight: normalize(320)
  },
  itemImage: {
    flex: 2.5,
    minHeight: normalize(160)
  },
  itemCard: {
    maxHeight: normalize(80),
    minHeight: normalize(60)
  },
  courseLabelWrap: {
    borderRadius: 8,
    borderStyle: "solid",
    borderWidth: 1,
    alignSelf: "flex-start",
    alignItems: "center"
  },
  tabBarContainer: {
    flex: 0.4,
    maxHeight: 50,
    minHeight: 44
  },
  tabNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: normalize(16),
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
  courseLabelText: {
    fontSize: normalize(10),
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
    paddingLeft: 24,
    paddingRight: 24
  }
});

export  { CourseDetails, CourseDetailsComponent, CourseCompleted };
