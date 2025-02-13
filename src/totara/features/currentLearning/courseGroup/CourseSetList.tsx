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
import MoreInfo from '@totara/components/MoreInfo';
import { activeOpacity } from '@totara/lib/styles/base';
import { iconSizes } from '@totara/theme/constants';
import { TotaraTheme } from '@totara/theme/Theme';
import type { CourseSets } from '@totara/types/CourseGroup';
import React from 'react';
import type { ListRenderItemInfo } from 'react-native';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

import Course from './Course';
import { courseSet, horizontalList } from './courseGroupStyles';

type CourseSetListProps = {
  courseSetList: CourseSets[];
  navigate: any;
  testID: string;
  showCriteriaList?: (any) => void;
};

const LearningItems = ({ item, navigate, showCriteriaList = () => null }: any) => {
  const navigateToCourse = () => {
    // TODO: Add the link back once the CourseList page is fixed
    // navigateTo({
    //   navigate: navigate,
    //   routeId: NAVIGATION.COURSE_LIST,
    //   props: { coursesList: item }
    // });
  };

  const takeFirstTwoCourses = item.courses?.slice(0, 2) || [];

  return (
    <View testID={'test_learning_items'} style={courseSet.listContainer}>
      <TouchableOpacity onPress={navigateToCourse} activeOpacity={1.0}>
        <View style={courseSet.itemContainer}>
          <View style={courseSet.headerBar}>
            <Text style={courseSet.headerTitle} numberOfLines={1} ellipsizeMode="tail" testID={'test_header_title'}>
              {item.label}
            </Text>
            <MoreInfo onPress={showCriteriaList} testID={'test_view_criteria_clicked'} />
          </View>
          <View>
            {takeFirstTwoCourses.map(course => {
              return <Course key={course.id} course={course} navigate={navigate} />;
            })}
          </View>
          <View style={courseSet.viewAllContent}>
            {item.courses && item.courses.length > 2 && (
              <TouchableOpacity
                onPress={navigateToCourse}
                activeOpacity={activeOpacity}
                style={courseSet.viewAllTouchableOpacity}>
                <Text style={courseSet.viewAllTitle}>View all</Text>
                <Icon name="chevron-right" color={TotaraTheme.colorLink} size={iconSizes.sizeM / 2} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const CourseSetList = ({ courseSetList, navigate, testID, showCriteriaList = () => null }: CourseSetListProps) => {
  const renderItems = ({ item }: ListRenderItemInfo<CourseSets>) => (
    <LearningItems navigate={navigate} item={item} showCriteriaList={() => showCriteriaList(item.completionCriteria)} />
  );

  return (
    <View style={horizontalList.container} testID={testID}>
      <FlatList
        data={courseSetList}
        renderItem={renderItems}
        keyExtractor={(_, id) => id.toString()}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
      />
    </View>
  );
};
export { LearningItems }; //
export default CourseSetList;
