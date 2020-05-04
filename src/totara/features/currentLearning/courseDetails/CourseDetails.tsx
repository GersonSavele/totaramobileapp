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
import { StyleSheet, View } from "react-native";
import {
  withNavigation,
  NavigationParams,
  NavigationInjectedProps,
} from "react-navigation";
import { GeneralErrorModal } from "@totara/components";
import { useQuery } from "@apollo/react-hooks";
import { translate } from "@totara/locale";
import { coreCourse } from "./api";
import Activities from "./Activities";
import { Course } from "@totara/types";
import OverviewDetails from "../overview/OverviewDetails";
import { ThemeContext } from "@totara/theme";
import { HeaderView } from "@totara/components/currentLearning";
import CourseCompletionSuccessModal from "./CourseCompletionSuccessModal";

type CourseDetailsProps = {
  course: Course;
  refetch: () => {};
  navigation?: NavigationParams;
};

const CourseDetails = ({ navigation }: NavigationInjectedProps) => {
  const courseId = navigation.getParam("courseId");
  const { loading, error, data, refetch } = useQuery(coreCourse, {
    variables: { courseid: courseId },
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
        tabBarLeft={translate("course.course-details.overview")}
        tabBarRight={translate("course.course-details.activities")}
        onPress={onSwitchTab}
        showOverview={showOverview}
        badgeTitle="Course"
      >
        <View
          style={[styles.container, { backgroundColor: theme.colorNeutral2 }]}
        >
          <View
            style={[
              styles.activitiesContainer,
              { backgroundColor: theme.colorNeutral1 },
            ]}
          >
            {!showOverview ? (
              <Activities sections={course.sections} refetch={refetch} />
            ) : (
              <OverviewDetails
                learningItem={course}
                summaryTypeTitle={translate(
                  "course.course_overview.course_summery"
                )}
              />
            )}
          </View>
        </View>
        <CourseCompletionSuccessModal course={course} navigation={navigation} />
      </HeaderView>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  activitiesContainer: {
    flex: 3,
    padding: 0,
  },
});

export default CourseDetails;
