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

import { ImageWrapper } from '@totara/components';
import Icon from '@totara/components/Icon';
import MoreInfo from '@totara/components/MoreInfo';
import { SummaryContent } from '@totara/components/SummaryContent';
import DefaultImage from '@totara/features/currentLearning/components/DefaultImage';
import { navigateTo, NAVIGATION } from '@totara/lib/navigation';
import { activeOpacity } from '@totara/lib/styles/base';
import { CL_TEST_IDS } from '@totara/lib/testIds';
import { translate } from '@totara/locale';
import { margins } from '@totara/theme/constants';
import { TotaraTheme } from '@totara/theme/Theme';
import type { CourseSets } from '@totara/types/CourseGroup';
import React, { useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

import NativeAccessRestriction from '../NativeAccessRestriction';
import { extractTargetId } from '../utils';
import { courseSet } from './courseGroupStyles';

type CourseSetProps = {
  courseSets: CourseSets;
  navigation: any;
  testID: string;
  showCriteriaList?: () => void;
};

const CourseSetItem = ({ item, navigation }: any) => {
  const [showRestriction, setShowRestriction] = useState(false);
  const onCloseRestriction = () => {
    setShowRestriction(!showRestriction);
  };
  // in case the endpoint doesn't return "viewable" field, then the course would be "viewable"
  const viewable = item.viewable === undefined || item.viewable;
  return (
    <View style={[viewable && courseSet.container, !viewable && courseSet.noShadowContainer]}>
      <TouchableOpacity
        key={item.id}
        testID={CL_TEST_IDS.COURSE_SET_ITEM}
        disabled={!viewable}
        style={{ opacity: viewable ? 1 : 0.6 }}
        onPress={() => {
          const targetId = extractTargetId(item.id);
          if (item.native) {
            navigateTo({
              navigate: navigation.navigate,
              routeId: NAVIGATION.COURSE_DETAILS,
              props: { targetId: targetId }
            });
          } else {
            setShowRestriction(true);
          }
        }}
        activeOpacity={activeOpacity}>
        <View style={courseSet.itemContainer}>
          <View style={{ flex: 1 }}>
            {item?.imageSrc?.length > 0 ? (
              <ImageWrapper url={item?.imageSrc} style={courseSet.courseSetItemImage} />
            ) : (
              <DefaultImage itemType={item.itemtype} style={courseSet.courseSetItemImage} />
            )}
          </View>
          <View style={{ padding: margins.marginL }}>
            <Text numberOfLines={1} style={courseSet.courseTitle}>
              {item.fullname}
            </Text>
            <View style={{ marginTop: margins.marginM, minHeight: margins.marginM }}>
              {viewable && <SummaryContent numberOfLines={2} content={item.summary} contentType={item.summaryFormat} />}
            </View>
          </View>
        </View>
        {showRestriction && <NativeAccessRestriction onClose={onCloseRestriction} urlView={item.urlView} />}
      </TouchableOpacity>
      {!viewable && (
        <View style={courseSet.absoluteItem}>
          <Icon name="ban" color={TotaraTheme.colorAlert} size={16} />
          <Text style={{ marginLeft: margins.marginS }}>{translate('course_group.courses.unavailable_course')}</Text>
        </View>
      )}
    </View>
  );
};

const CourseSet = ({ courseSets, navigation, testID, showCriteriaList = () => null }: CourseSetProps) => {
  const renderItem = ({ item }: any) => {
    return <CourseSetItem navigation={navigation} item={item} />;
  };

  return (
    <View style={{ marginTop: margins.marginXL }} testID={testID}>
      <View style={courseSet.courseSetHeader}>
        <Text style={courseSet.title}>{courseSets.label}</Text>
        <MoreInfo onPress={showCriteriaList} testID={CL_TEST_IDS.MORE_INFO} />
      </View>
      <FlatList
        data={courseSets.courses}
        renderItem={renderItem}
        keyExtractor={(_, id) => id.toString()}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        testID={CL_TEST_IDS.COURSE_SET_SCROLL}
      />
    </View>
  );
};

export default CourseSet;
