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
import { Text, TouchableOpacity, View, FlatList } from "react-native";
import { CourseSets } from "@totara/types/CourseGroup";
import { translate } from "@totara/locale";
import { NAVIGATION } from "@totara/lib/navigation";
import { navigateTo } from "@totara/lib/navigation";
import { courseSet } from "./courseGroupStyles";
import { margins } from "@totara/theme/constants";
import CriteriaSheet from "../components/CriteriaSheet";
import NativeAccessRestriction from "../NativeAccessRestriction";
import MoreInfo from "@totara/components/MoreInfo";
import { ImageWrapper } from "@totara/components";
import DefaultImage from "@totara/features/currentLearning/components/DefaultImage";
import { extractTargetId } from "../utils";
import { activeOpacity } from "@totara/lib/styles/base";
import { CL_TEST_IDS } from "@totara/lib/testIds";
import { SummaryContent } from "@totara/components/SummaryContent";

type CourseSetProps = {
  courseSets: CourseSets;
  navigation: any;
  testID: string;
};

const CourseSetItem = ({ item, navigation }: any) => {
  const [showRestriction, setShowRestriction] = useState(false);
  const onCloseRestriction = () => {
    setShowRestriction(!showRestriction);
  };
  return (
    <View style={courseSet.container}>
      <TouchableOpacity
        key={item.id}
        testID={CL_TEST_IDS.COURSE_SET_ITEM}
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
          <View style={courseSet.courseDetails}>
            <Text numberOfLines={1} style={courseSet.courseTitle}>
              {item.fullname}
            </Text>
            <SummaryContent
              numberOfLines={2}
              style={courseSet.courseSummary}
              content={item.summary}
              contentType={item.summaryFormat}
            />
          </View>
        </View>
        {showRestriction && <NativeAccessRestriction onClose={onCloseRestriction} urlView={item.urlView} />}
      </TouchableOpacity>
    </View>
  );
};

const CourseSet = ({ courseSets, navigation, testID }: CourseSetProps) => {
  const [show, setShow] = useState(false);
  const onCloseBottomSheet = () => {
    setShow(!show);
  };

  const renderItem = ({ item }: any) => {
    return <CourseSetItem navigation={navigation} item={item} />;
  };

  return (
    <View style={{ marginTop: margins.marginXL }} testID={testID}>
      <View style={courseSet.courseSetHeader}>
        <Text style={courseSet.title}>{courseSets.label}</Text>
        <MoreInfo onPress={onCloseBottomSheet} testID={CL_TEST_IDS.MORE_INFO} />
      </View>
      <FlatList
        data={courseSets.courses}
        renderItem={renderItem}
        keyExtractor={(_, id) => id.toString()}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        testID={CL_TEST_IDS.COURSE_SET_SCROLL}
      />
      {show && (
        <CriteriaSheet
          title={translate("course_group.criteria.bottom_sheet_header")}
          criteriaList={courseSets.completionCriteria}
          onClose={onCloseBottomSheet}
        />
      )}
    </View>
  );
};

export default CourseSet;
