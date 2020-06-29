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
import { View, ScrollView, RefreshControl } from "react-native";
import { NavigationParams } from "react-navigation";
import { useQuery } from "@apollo/react-hooks";
import { translate } from "@totara/locale";
import Courses from "./Courses";
import OverviewDetails from "../overview/Details";
import { CourseGroup } from "@totara/types";
import { GeneralErrorModal } from "@totara/components";
import { coreProgram } from "./api";
import LearningDetails from "../LearningDetails";
import { details } from "../courseGroupStyle";

type CourseGroupProps = {
  courseGroup: CourseGroup;
};

const CourseGroupDetails = ({ navigation }: NavigationParams) => {
  const programId = navigation.getParam("targetId");
  const { loading, error, data, refetch } = useQuery(coreProgram, {
    variables: { programid: programId }
  });

  const pullToRefresh = () => {
    refetch();
  };

  if (loading) return null;
  if (error) return <GeneralErrorModal siteUrl="" />;
  if (data) {
    return (
      <ScrollView
        style={details.scrollView}
        contentContainerStyle={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={pullToRefresh} />
        }>
        <UIWrapper courseGroup={data.totara_mobile_program} />
      </ScrollView>
    );
  }
};

const UIWrapper = ({ courseGroup }: CourseGroupProps) => {
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
      image={courseGroup.imageSrc}>
      <View style={details.container}>
        <View style={details.activitiesContainer}>
          {!showOverview ? (
            <Courses courseGroup={courseGroup} />
          ) : (
            <OverviewDetails
              id={courseGroup.id}
              summary={courseGroup.summary!}
              progress={courseGroup.completion.progress}
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
