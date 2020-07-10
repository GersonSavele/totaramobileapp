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
import { View } from "react-native";
import { NavigationStackProp } from "react-navigation-stack";
import { useQuery } from "@apollo/react-hooks";
import { translate } from "@totara/locale";
import Courses from "./Courses";
import OverviewDetails from "../overview/OverviewDetails";
import { CourseGroup } from "@totara/types";
import { LoadingError, Loading } from "@totara/components";
import { coreProgram } from "./api";
import LearningDetails from "../LearningDetails";
import { details } from "./courseGroupStyles";

type CourseGroupProps = {
  navigation: NavigationStackProp;
};

const CourseGroupDetails = ({ navigation }: CourseGroupProps) => {
  const programId = navigation.getParam("targetId");
  const { loading, error, data, refetch } = useQuery(coreProgram, {
    variables: { programid: programId }
  });
  const onContentRefresh = () => {
    refetch();
  };

  if (loading) return <Loading />;
  if (error) return <LoadingError onRefreshTap={onContentRefresh} />;

  if (data) {
    return (
      <CourseGroupDetailsContent
        courseGroup={data.totara_mobile_program}
        onContentRefresh={onContentRefresh}
        navigation={navigation}
      />
    );
  }
};

type CourseGroupDetailsContentProps = {
  courseGroup: CourseGroup;
  onContentRefresh: () => void;
  navigation: NavigationStackProp;
};

const CourseGroupDetailsContent = ({
  courseGroup,
  onContentRefresh,
  navigation
}: CourseGroupDetailsContentProps) => {
  const [showOverview, setShowOverview] = useState(true);
  const onSwitchTab = () => {
    setShowOverview(!showOverview);
  };

  return (
    <LearningDetails
      details={courseGroup}
      tabBarLeftTitle={translate("course_group.tabs.overview")}
      tabBarRightTitle={translate("course_group.tabs.courses")}
      onPress={onSwitchTab}
      overviewIsShown={showOverview}
      badgeTitle={translate("course_group.details.badge_title_program")}
      image={courseGroup.imageSrc}
      onPullToRefresh={onContentRefresh}>
      <View style={details.container}>
        <View style={details.activitiesContainer}>
          {!showOverview ? (
            <Courses courseGroup={courseGroup} navigation={navigation} />
          ) : (
            <OverviewDetails
              id={courseGroup.id}
              summary={courseGroup.summary!}
              progress={courseGroup.completion.progress}
              isCourseSet={true}
              summaryTypeTitle={translate(
                "course_group.overview.summary_title_program"
              )}
            />
          )}
        </View>
      </View>
    </LearningDetails>
  );
};

export default CourseGroupDetails;
