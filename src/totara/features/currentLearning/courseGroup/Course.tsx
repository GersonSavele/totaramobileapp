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

import { Images } from '@resources/images';
import { ImageWrapper, ProgressCircle } from '@totara/components';
import { NAVIGATION } from '@totara/lib/navigation';
import { navigateTo } from '@totara/lib/navigation';
import { iconSizes, margins } from '@totara/theme/constants';
import listViewStyles from '@totara/theme/listView';
import type { LearningItem } from '@totara/types';
import React, { useState } from 'react';
import type { ImageSourcePropType } from 'react-native';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import NativeAccessRestriction from '../NativeAccessRestriction';
import { extractTargetId } from '../utils';
import { rowItem } from './courseGroupStyles';
type CourseProps = {
  course: LearningItem;
  navigate: any;
  testID?: string;
};

const Course = ({ course, navigate, testID }: CourseProps) => {
  const [showRestriction, setShowRestriction] = useState(false);
  const onClose = () => {
    setShowRestriction(!showRestriction);
  };

  return (
    <TouchableOpacity
      testID={testID}
      onPress={() => {
        if (course.native) {
          navigateTo({
            navigate: navigate,
            routeId: NAVIGATION.COURSE_DETAILS,
            props: { targetId: extractTargetId(course.id) }
          });
        } else {
          setShowRestriction(true);
        }
      }}>
      <View style={rowItem.container}>
        <View style={rowItem.imageWrapper}>
          {course.imageSrc && course.imageSrc.length > 0 ? (
            <ImageWrapper url={course.imageSrc} style={rowItem.image} />
          ) : (
            <Image
              style={rowItem.image}
              source={Images.defaultCourses as ImageSourcePropType}
              testID={'test_default_image'}
              resizeMode="contain"
            />
          )}
        </View>
        <View style={rowItem.detailsWrapper}>
          <Text style={rowItem.courseName} numberOfLines={2} testID={'test_course_full_name'}>
            {course.fullname}
          </Text>
        </View>
        <View style={{ alignSelf: 'center' }}>
          {course.progress !== null && (
            <ProgressCircle
              size={iconSizes.sizeXL}
              progress={course.progress}
              testID={'test_CurrentLearningItem_Progress'}
            />
          )}
        </View>
      </View>
      <View
        style={{
          ...listViewStyles.thinSeparator,
          marginLeft: margins.marginL
        }}
      />
      {showRestriction && <NativeAccessRestriction onClose={onClose} urlView={course.urlView!} />}
    </TouchableOpacity>
  );
};

export default Course;
