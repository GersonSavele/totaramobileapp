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
import {
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  Text,
  Switch
} from "react-native";
import {
  withNavigation,
  NavigationParams,
  NavigationInjectedProps
} from "react-navigation";
import { GeneralErrorModal } from "@totara/components";
import { useQuery } from "@apollo/react-hooks";
import { translate } from "@totara/locale";
import { coreCourse } from "./api";
import Activities from "./Activities";
import { CourseContentDetails } from "@totara/types";
import { statusKey } from "@totara/types/Completion";
import OverviewDetails from "../overview/Details";
import { TotaraTheme } from "@totara/theme/Theme";
import HeaderView from "../HeaderView";
import CourseCompletionModal from "../CourseCompletionModal";
import ActivitySheetWrapper from "@totara/activities/ActivitySheetWrapper";
import { learningItemEnum } from "@totara/lib/constants";
import { courseStyle } from "../currentLearningStyles";

const CourseDetails = ({ navigation }: NavigationInjectedProps) => {
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
    return (
      <ActivitySheetWrapper>
        <ScrollView
          style={courseStyle.scrollView}
          contentContainerStyle={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={pullToRefresh} />
          }>
          <UIWrapper
            courseDetails={data.mobile_course}
            courseRefreshCallBack={refetch}
          />
        </ScrollView>
      </ActivitySheetWrapper>
    );
  }
};

type Props = {
  courseDetails: CourseContentDetails;
  courseRefreshCallBack: () => {};
  navigation?: NavigationParams;
};

const UIWrapper = withNavigation(
  ({ navigation = {}, courseDetails, courseRefreshCallBack }: Props) => {
    const [showOverview, setShowOverview] = useState(true);
    const [showCompletionModal, setShowCompletionModal] = useState(true);
    const [expandActivities, setExpandActivities] = useState(false);
    const onClose = () => {
      setShowCompletionModal(!showCompletionModal);
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
      <HeaderView
        details={courseDetails.course}
        navigation={navigation!}
        tabBarLeftTitle={translate("course.course_details.overview")}
        tabBarRightTitle={translate("course.course_details.activities")}
        onPress={onSwitchTab}
        overviewIsShown={showOverview}
        image={courseDetails.imageSrc}
        badgeTitle="Course">
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
                  courseRefreshCallBack={courseRefreshCallBack}
                  expandAllActivities={expandActivities}
                />
              </View>
            ) : (
              <OverviewDetails
                contentDetails={courseDetails}
                summaryTypeTitle={translate(
                  "course.course_overview.course_summery"
                )}
                onclickContinueLearning={onClose}
              />
            )}
          </View>
        </View>
        {courseDetails.course.completion &&
          courseDetails.course.completion.statuskey === statusKey.complete && (
            <CourseCompletionModal onClose={onClose} />
          )}
      </HeaderView>
    );
  }
);

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
