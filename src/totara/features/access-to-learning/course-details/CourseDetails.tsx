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
  View,
  //Switch, To Do: This UI implementation not related for this ticket(All activity expanding), Later this design will be usefull when function will be implemented
} from "react-native";
import {
  withNavigation,
  NavigationParams,
  NavigationInjectedProps
} from "react-navigation";
import {
  GeneralErrorModal,
  PrimaryButton,
  InfoModal
} from "@totara/components";
import { useQuery } from "@apollo/react-hooks";
import { translate } from "@totara/locale";
import { coreCourse } from "./api";
import { Course } from "@totara/types";
import { ActivityList } from "./ActivityList";
import OverviewDetails from "../overview/OverviewDetails";
import { ThemeContext } from "@totara/theme";
import { NAVIGATION_MY_LEARNING } from "@totara/lib/Constant";
import { HeaderView } from "../components";

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
  });
  if (loading) return null;
  if (error) return <GeneralErrorModal siteUrl="" />;
  if (data) {
    return <CourseDetailsComponent course={data.course} refetch={refetch} />;
  }
};

 const CourseDetailsComponent = withNavigation(
  ({ navigation, course, refetch }: CourseDetailsProps) => {
    const [showOverview, setShowOverview] = useState(true);
    const onSwitchTab = () => {
      setShowOverview(!showOverview);
    };
    const [theme] = useContext(ThemeContext);
    return (
      <HeaderView
        details={course}
        navigation={navigation!}
        tabBarLeft={translate("Course-details.overview")}
        tabBarRight={translate("Course-details.activities")}
        onPress={onSwitchTab}
        showOverview={showOverview}
        badgeTitle = "Course"
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
            {!showOverview ? (
            <Activities course={course} refetch={refetch} />
            ) : (
              <OverviewDetails progress={course.completion.progress} gradeFinal = {course.completion.gradefinal} gradeMax = {course.completion.grademax}
              summary = {course.summary != null ? course.summary : ""} summaryTypeTitle = "Course Summary"/>
            )}         
          </View>
        </View>
      </HeaderView>
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
  activitiesContainer: {
    flex: 3,
    padding: 0
  }
});

export  { CourseDetails, CourseDetailsComponent, CourseCompleted };
