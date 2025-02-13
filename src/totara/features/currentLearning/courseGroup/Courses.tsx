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

import Icon from '@totara/components/Icon';
import { activeOpacity } from '@totara/lib/styles/base';
import { translate } from '@totara/locale';
import { iconSizes } from '@totara/theme/constants';
import listViewStyles from '@totara/theme/listView';
import { TotaraTheme } from '@totara/theme/Theme';
import type { CourseGroup, CourseSets } from '@totara/types/CourseGroup';
import { StatusKey } from '@totara/types/CourseGroup';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { courses } from './courseGroupStyles';
import CourseSet from './CourseSet';
import CourseSetList from './CourseSetList';

type CoursesProps = {
  courseGroup: CourseGroup;
  navigation: any;
  showCriteriaList?: (any) => void;
};

const Courses = ({ courseGroup, navigation, showCriteriaList = () => null }: CoursesProps) => {
  return (
    <View style={courses.container}>
      {courseGroup.courseSetHeader && courseGroup.courseSetHeader.length > 0 ? (
        <CompletionInfo
          title={courseGroup.courseSetHeader}
          icon={'check-circle'}
          viewTestID={'test_set_header'}
          textTestID={'test_set_header_title'}
          iconColor={TotaraTheme.colorSuccess}
        />
      ) : null}
      {courseGroup.currentCourseSets.map((item: [CourseSets], key: number) => {
        return (
          <View key={key}>
            {item.length == 1 && (
              <CourseSet
                courseSets={item[0]}
                navigation={navigation}
                testID={'test_course_set'}
                showCriteriaList={() => showCriteriaList(item[0].completionCriteria)}
              />
            )}
            {item.length > 1 && (
              <CourseSetList
                courseSetList={item}
                navigate={navigation.navigate}
                testID={'test_course_set_list'}
                showCriteriaList={showCriteriaList}
              />
            )}
            {item[item.length - 1] && item[item.length - 1].nextsetoperator && (
              <View style={courses.nextSet}>
                <View style={{ ...listViewStyles.thickSeparator, flex: 1 }} />
                <Text style={courses.nextSetText}>{item[item.length - 1].nextsetoperator}</Text>
                <View style={{ ...listViewStyles.thickSeparator, flex: 1 }} />
              </View>
            )}
          </View>
        );
      })}
      {courseGroup.completion.statuskey === StatusKey.completed && (
        <Completed endnote={courseGroup.endnote} navigation={navigation} testID={'test_program_completed'} />
      )}
      {courseGroup.countUnavailableSets > 0 && (
        <CompletionInfo
          title={courseGroup.countUnavailableSets.toString() + ' ' + translate('course_group.courses.unavailable_sets')}
          icon={'ban'}
          viewTestID={'test_unavailable_set'}
          textTestID={'test_unavailable_set_title'}
          iconColor={TotaraTheme.colorAlert}
        />
      )}
    </View>
  );
};

type CompletionInfoProps = {
  title: string;
  icon: any;
  viewTestID?: string;
  textTestID?: string;
  iconColor: string;
};

const CompletionInfo = ({ title, icon, viewTestID, textTestID, iconColor }: CompletionInfoProps) => {
  return (
    <View style={courses.completionInfoView} testID={viewTestID}>
      <View style={{ backgroundColor: 'transparent' }}>
        <Icon name={icon} size={iconSizes.sizeS} color={iconColor} />
      </View>
      <Text style={courses.completionInfoTitle} testID={textTestID}>
        {title}
      </Text>
    </View>
  );
};

type CompletedProps = {
  endnote?: string;
  navigation: any;
  testID: string;
};

const Completed = ({ endnote, navigation, testID }: CompletedProps) => {
  return (
    <View style={courses.bottomView} testID={testID}>
      <Text style={courses.completedText}>{translate('course_group.courses.compete')}</Text>
      <Text numberOfLines={5} style={courses.endNoteText} testID={'test_endnote'}>
        {endnote}
      </Text>
      <TouchableOpacity
        style={courses.button}
        testID={'test_go_back_button'}
        onPress={() => navigation.goBack()}
        activeOpacity={activeOpacity}>
        <Text style={courses.buttonTextTitle}>{translate('course_group.courses.current_learning_button_title')}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Courses;
