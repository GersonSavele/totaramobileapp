/**
 * This file is part of Totara Enterprise.
 *
 * Copyright (C) 2020 onwards Totara Learning Solutions LTD
 *
 * Totara Enterprise is provided only to Totara Learning Solutions
 * LTD’s customers and partners, pursuant to the terms and
 * conditions of a separate agreement with Totara Learning
 * Solutions LTD or its affiliate.
 *
 * If you do not have an agreement with Totara Learning Solutions
 * LTD, you may not access, use, modify, or distribute this software.
 * Please contact [sales@totaralearning.com] for more information.
 */

import React, { useState } from "react";
import { StyleSheet, View, Text, Switch } from "react-native";
import { NavigationParams } from "react-navigation";
import { NavigationStackProp } from "react-navigation-stack";
import { Loading, LoadingError } from "@totara/components";
import { useQuery } from "@apollo/react-hooks";
import { translate } from "@totara/locale";
import { coreCourse } from "./api";
import Activities from "./Activities";
import { CourseContentDetails } from "@totara/types";
import { StatusKey } from "@totara/types/Completion";
import OverviewDetails from "../overview/OverviewDetails";
import { TotaraTheme } from "@totara/theme/Theme";
import LearningDetails from "../LearningDetails";
import CourseCompletionModal from "../CourseCompletionModal";
import { learningItemEnum } from "../constants";
import courseDetailsStyle from "./courseDetailsStyle";

const CourseDetails = ({ navigation }: NavigationParams) => {
  const courseId = navigation.getParam("targetId");
  const { loading, error, data, refetch } = useQuery(coreCourse, {
    variables: { courseid: courseId }
  });

  const onContentRefresh = () => {
    refetch();
  };

  if (loading) return <Loading />;
  if (error) return <LoadingError onRefreshTap={onContentRefresh} />;

  if (data) {
    return (
      <CourseDetailsContent
        pullToRefresh={onContentRefresh}
        courseDetails={data.mobile_course}
        courseRefreshCallback={refetch}
        navigation={navigation}
      />
    );
  }
};

type CourseDetailsContentProps = {
  courseDetails: CourseContentDetails;
  courseRefreshCallback: () => {};
  pullToRefresh: () => void;
  navigation: NavigationStackProp;
};

const CourseDetailsContent = ({
  courseDetails,
  courseRefreshCallback,
  pullToRefresh,
  navigation
}: CourseDetailsContentProps) => {
  const [showOverview, setShowOverview] = useState(true);
  const [showCompletionModal, setShowCompletionModal] = useState(true);
  const [expandActivities, setExpandActivities] = useState(false);
  const onClose = () => {
    setShowCompletionModal(!showCompletionModal);
    courseRefreshCallback();
    navigation.goBack();
  };
  const onSwitchTab = () => {
    setShowOverview(!showOverview);
  };
  const onChangeExpand = () => {
    setExpandActivities(!expandActivities);
  };
  return (
    <LearningDetails
      onPullToRefresh={pullToRefresh}
      item={courseDetails.course}
      itemType={learningItemEnum.Course}
      tabBarLeftTitle={translate("course.course_details.overview")}
      tabBarRightTitle={translate("course.course_details.activities")}
      onPress={onSwitchTab}
      overviewIsShown={showOverview}
      image={courseDetails.imageSrc}
      badgeTitle={translate("course.course_details.badge_title")}
      navigation={navigation}>
      <View style={[styles.container, { backgroundColor: TotaraTheme.colorNeutral2 }]}>
        <View style={[styles.activitiesContainer, { backgroundColor: TotaraTheme.colorNeutral1 }]}>
          {!showOverview ? (
            <View
              style={{
                backgroundColor: TotaraTheme.colorAccent
              }}>
              <View style={courseDetailsStyle.expandContentWrap}>
                <Text style={courseDetailsStyle.expandTextWrap}>
                  {translate("course.course_details.expand_or_collapse")}
                </Text>
                <Switch
                  style={[{ borderColor: TotaraTheme.colorNeutral5 }]}
                  value={expandActivities}
                  onValueChange={onChangeExpand}
                />
              </View>
              <Activities
                sections={courseDetails.course.sections}
                courseRefreshCallBack={courseRefreshCallback}
                expandAllActivities={expandActivities}
              />
            </View>
          ) : (
            <OverviewDetails
              isCourseSet={false}
              id={courseDetails.course.id}
              criteria={courseDetails.course.criteria}
              summary={courseDetails.course.summary}
              gradeFinal={courseDetails.gradeFinal}
              progress={courseDetails.course.completion.progress}
              summaryTypeTitle={translate("course.course_overview.course_summary")}
              onclickContinueLearning={onClose}
              courseRefreshCallback={courseRefreshCallback}
              showGrades={courseDetails.course.showGrades}
              completionEnabled={courseDetails.course.completionEnabled}
            />
          )}
        </View>
      </View>
      {courseDetails.course.completion && courseDetails.course.completion.statuskey === StatusKey.complete && (
        <CourseCompletionModal onClose={onClose} />
      )}
    </LearningDetails>
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

export default CourseDetails;
