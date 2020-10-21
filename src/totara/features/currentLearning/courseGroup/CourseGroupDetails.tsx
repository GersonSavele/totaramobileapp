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
import { coreProgram, coreCertification } from "./api";
import LearningDetails from "../LearningDetails";
import { details } from "./courseGroupStyles";

type CourseGroupProps = {
  navigation: NavigationStackProp;
};

const courseGroupTypeMap = {
  program: {
    query: coreProgram,
    idField: "programid",
    queryAlias: "totara_mobile_program",
    badgeTitlePath: "course_group.details.badge_title_program"
  },
  certification: {
    query: coreCertification,
    idField: "certificationid",
    queryAlias: "totara_mobile_certification",
    badgeTitlePath: "course_group.details.badge_title_certification"
  }
};

type ParamsType = {
  targetId: string;
  courseGroupType: string;
};

const CourseGroupDetails = ({ navigation }: CourseGroupProps) => {
  const { targetId, courseGroupType } = navigation.state.params as ParamsType;
  const typeMap = courseGroupTypeMap[courseGroupType];
  const { loading, error, data, refetch } = useQuery(typeMap.query, {
    variables: { [typeMap.idField]: targetId }
  });

  const onContentRefresh = () => {
    refetch();
  };

  if (loading) return <Loading testID={"test_loading"} />;
  if (!data && error) return <LoadingError onRefreshTap={onContentRefresh} testID={"test_error"} />;

  if (data) {
    const courseGroup = data[typeMap.queryAlias] as CourseGroup;
    return (
      <CourseGroupDetailsContent
        courseGroup={courseGroup}
        onContentRefresh={onContentRefresh}
        navigation={navigation}
        testID={"test_data"}
        badgeTitlePath={typeMap.badgeTitlePath}
        itemType={courseGroupType}
      />
    );
  }
};

type CourseGroupDetailsContentProps = {
  courseGroup: CourseGroup;
  onContentRefresh: () => void;
  navigation: NavigationStackProp;
  testID?: string;
  badgeTitlePath: string;
  itemType: string;
};

const CourseGroupDetailsContent = ({
  courseGroup,
  onContentRefresh,
  navigation,
  testID,
  badgeTitlePath,
  itemType
}: CourseGroupDetailsContentProps) => {
  const [showOverview, setShowOverview] = useState(true);
  const onSwitchTab = () => {
    setShowOverview(!showOverview);
  };

  return (
    <View testID={testID} style={{ flex: 1 }}>
      <LearningDetails
        item={courseGroup}
        itemType={itemType}
        tabBarLeftTitle={translate("course_group.tabs.overview")}
        tabBarRightTitle={translate("course_group.tabs.courses")}
        onPress={onSwitchTab}
        overviewIsShown={showOverview}
        badgeTitle={translate(badgeTitlePath)}
        image={courseGroup.imageSrc}
        onPullToRefresh={onContentRefresh}
        navigation={navigation}>
        <View style={details.container}>
          <View style={details.activitiesContainer}>
            {!showOverview ? (
              <Courses courseGroup={courseGroup} navigation={navigation} />
            ) : (
              <OverviewDetails
                id={courseGroup.id}
                summary={courseGroup.summary!}
                summaryFormat={courseGroup.summaryformat!}
                progress={courseGroup?.completion?.progress}
                isCourseSet={true}
                summaryTypeTitle={translate("course_group.overview.summary_title_program")}
              />
            )}
          </View>
        </View>
      </LearningDetails>
    </View>
  );
};

export default CourseGroupDetails;
