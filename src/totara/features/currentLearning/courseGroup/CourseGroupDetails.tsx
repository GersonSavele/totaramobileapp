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

import { NetworkStatus, useMutation, useQuery } from '@apollo/client';
import { Loading, LoadingError } from '@totara/components';
import { translate } from '@totara/locale';
import type { CourseGroup } from '@totara/types';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

import { useNavigation, useParams } from '@/src/totara/lib/hooks';

import CriteriaSheet from '../components/CriteriaSheet';
import LearningDetails from '../LearningDetails';
import OverviewDetails from '../overview/OverviewDetails';
import { coreCertification, coreProgram, mutationReportProgramme } from './api';
import { details } from './courseGroupStyles';
import Courses from './Courses';

const courseGroupTypeMap = {
  program: {
    query: coreProgram,
    idField: 'programid',
    queryAlias: 'totara_mobile_program',
    badgeTitlePath: 'learning_items.program'
  },
  certification: {
    query: coreCertification,
    idField: 'certificationid',
    queryAlias: 'totara_mobile_certification',
    badgeTitlePath: 'learning_items.certification'
  }
};

const CourseGroupDetails = () => {
  const { targetId, courseGroupType } = useParams('CourseGroupDetails');
  const navigation = useNavigation('CourseGroupDetails');
  const typeMap = courseGroupTypeMap[courseGroupType];
  console.log({ query: typeMap.query, variables: { [typeMap.idField]: targetId } });
  console.log(typeMap.query);
  const { networkStatus, error, data, refetch } = useQuery(typeMap.query, {
    variables: { [typeMap.idField]: targetId },
    notifyOnNetworkStatusChange: true
  });
  const [setReportProgramme] = useMutation(mutationReportProgramme);
  const onContentRefresh = () => {
    refetch();
  };

  useEffect(() => {
    if (networkStatus === NetworkStatus.loading || networkStatus === NetworkStatus.refetch) {
      setReportProgramme({
        variables: {
          program_id: targetId
        }
      }).then(({ data }) => {
        //TODO: investigate - somehow the API is not returning "totara_mobile_program_view"
        if (!data?.totara_mobile_program_view) {
          console.warn('Programme/Certificate reporting failed.');
        }
      });
    }
  }, [data]);

  if (networkStatus === NetworkStatus.loading) return <Loading testID={'test_loading'} />;
  if (!data && error) return <LoadingError onRefreshTap={onContentRefresh} testID={'test_error'} error={error} />;

  if (data) {
    const courseGroup = data[typeMap.queryAlias] as CourseGroup;
    return (
      <CourseGroupDetailsContent
        courseGroup={courseGroup}
        onContentRefresh={onContentRefresh}
        navigation={navigation}
        testID={'test_data'}
        badgeTitlePath={typeMap.badgeTitlePath}
        itemType={courseGroupType}
        loading={networkStatus === NetworkStatus.refetch}
      />
    );
  } else {
    return <Loading testID={'data_loading'} />;
  }
};

type CourseGroupDetailsContentProps = {
  courseGroup: CourseGroup;
  onContentRefresh: () => void;
  navigation: any;
  testID?: string;
  badgeTitlePath: string;
  itemType: string;
  loading: boolean;
};

const CourseGroupDetailsContent = ({
  courseGroup,
  onContentRefresh,
  navigation,
  testID,
  badgeTitlePath,
  itemType,
  loading
}: CourseGroupDetailsContentProps) => {
  const [showOverview, setShowOverview] = useState(true);
  const onSwitchTab = () => {
    setShowOverview(!showOverview);
  };

  const [index, setIndex] = useState(-1);
  const [criteria, setCriteria] = useState(undefined);

  const onClose = () => {
    setIndex(-1);
  };

  const showCriteriaList: (any) => void = completionCriteria => {
    setCriteria(completionCriteria);
    setIndex(1);
  };

  return (
    <View testID={testID} style={{ flex: 1 }}>
      <LearningDetails
        loading={loading}
        item={courseGroup}
        itemType={itemType}
        tabBarLeftTitle={translate('course_group.tabs.overview')}
        tabBarRightTitle={translate('course_group.tabs.courses')}
        onPress={onSwitchTab}
        overviewIsShown={showOverview}
        badgeTitle={translate(badgeTitlePath)}
        image={courseGroup.imageSrc}
        onPullToRefresh={onContentRefresh}
        navigation={navigation}>
        <View style={details.container}>
          <View style={details.activitiesContainer}>
            {!showOverview ? (
              <Courses courseGroup={courseGroup} navigation={navigation} showCriteriaList={showCriteriaList} />
            ) : (
              <OverviewDetails
                id={courseGroup.id}
                summary={courseGroup.summary!}
                summaryFormat={courseGroup.summaryformat!}
                progress={courseGroup?.completion?.progress}
                isCourseSet={true}
                showCriteriaList={showCriteriaList}
                summaryTypeTitle={translate('course_group.overview.summary_title_program')}
              />
            )}
          </View>
        </View>
      </LearningDetails>
      <CriteriaSheet
        title={translate('course_group.criteria.bottom_sheet_header')}
        criteriaList={criteria}
        onClose={onClose}
        index={index}
      />
    </View>
  );
};

export default CourseGroupDetails;
