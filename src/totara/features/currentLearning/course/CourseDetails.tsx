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

import React, { useState, useContext } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  Text,
  Switch
} from "react-native";
import { NavigationContext } from "react-navigation";
import { GeneralErrorModal } from "@totara/components";
import { useQuery } from "@apollo/react-hooks";
import { translate } from "@totara/locale";
import { coreCourse } from "./api";
import Activities from "./Activities";
import { CourseContentDetails } from "@totara/types";
import { statusKey } from "@totara/types/Completion";
import OverviewDetails from "../overview/Details";
import { TotaraTheme } from "@totara/theme/Theme";
import LearningDetails from "../LearningDetails";
import CourseCompletionModal from "../CourseCompletionModal";
import { learningItemEnum } from "@totara/lib/constants";
import { courseStyle } from "../currentLearningStyles";

const CourseDetails = () => {
  const navigation = useContext(NavigationContext);
  const courseId = navigation.getParam("targetId");
  const { loading, error, data, refetch } = useQuery(coreCourse, {
    variables: { courseid: courseId }
  });
  const pullToRefresh = () => {
    refetch();
  };
  if (loading) return null;
  if (error) return <GeneralErrorModal siteUrl="" />;
  if (data) {
    console.log("pritn ccc");
    return (
      <ScrollView
        style={courseStyle.scrollView}
        contentContainerStyle={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        scrollsToTop={true}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={pullToRefresh} />
        }>
        <UIWrapper
          courseDetails={data.mobile_course}
          courseRefreshCallback={refetch}
        />
      </ScrollView>
    );
  }
};

type Props = {
  courseDetails: CourseContentDetails;
  courseRefreshCallback: () => {};
};

const UIWrapper = ({ courseDetails, courseRefreshCallback }: Props) => {
  const [showOverview, setShowOverview] = useState(true);
  const [showCompletionModal, setShowCompletionModal] = useState(true);
  const [expandActivities, setExpandActivities] = useState(false);
  const navigation = useContext(NavigationContext);
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
  courseDetails.course.itemtype = learningItemEnum.Course;
  return (
    <LearningDetails
      details={courseDetails.course}
      tabBarLeftTitle={translate("course.course_details.overview")}
      tabBarRightTitle={translate("course.course_details.activities")}
      onPress={onSwitchTab}
      overviewIsShown={showOverview}
      image={courseDetails.imageSrc}
      badgeTitle={translate("course.course_details.badge_title")}>
      <View
        style={[
          styles.container,
          { backgroundColor: TotaraTheme.colorNeutral2 }
        ]}>
        <View
          style={[
            styles.activitiesContainer,
            { backgroundColor: TotaraTheme.colorNeutral1 }
          ]}>
          {!showOverview ? (
            <View
              style={{
                backgroundColor: TotaraTheme.colorNeutral2
              }}>
              <View style={courseStyle.expandContentWrap}>
                <Text style={courseStyle.expandTextWrap}>
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
              id={courseDetails.course.id}
              criteria={courseDetails.course.criteria}
              summary={courseDetails.course.summary}
              gradeFinal={courseDetails.gradeFinal}
              progress={courseDetails.course.completion.progress}
              summaryTypeTitle={translate(
                "course.course_overview.course_summery"
              )}
              onclickContinueLearning={onClose}
              courseRefreshCallback={courseRefreshCallback}
            />
          )}
        </View>
      </View>
      {courseDetails.course.completion &&
        courseDetails.course.completion.statuskey === statusKey.complete && (
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
