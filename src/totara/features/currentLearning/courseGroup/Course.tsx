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
  Text,
  TouchableOpacity,
  View,
  Image,
  ImageSourcePropType
} from "react-native";
import { ImageWrapper, Separator } from "@totara/components";
import { NAVIGATION } from "@totara/lib/navigation";
import NativeAccessRestriction from "../NativeAccessRestriction";
import { navigateTo } from "@totara/lib/navigation";
import { rowItem } from "./courseGroupStyles";
import { margins } from "@totara/theme/constants";
import { Images } from "@resources/images";

type CourseProps = {
  course: any;
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
            props: { targetId: course.id }
          });
        } else {
          setShowRestriction(true);
        }
      }}
      activeOpacity={1.0}>
      <View style={rowItem.container}>
        {course.imageSrc && course.imageSrc.length > 0 ? (
          <ImageWrapper url={course.imageSrc} style={rowItem.imageWrapper} />
        ) : (
          <Image
            style={rowItem.imageWrapper}
            source={Images.defaultCourses as ImageSourcePropType}
            testID={"test_default_image"}
          />
        )}
        <View style={rowItem.detailsWrapper}>
          <Text
            style={rowItem.courseName}
            numberOfLines={1}
            testID={"test_course_full_name"}>
            {course.fullname}
          </Text>
          <Text
            style={rowItem.courseSummary}
            numberOfLines={1}
            testID={"test_course_summary"}>
            {course.summary}
          </Text>
        </View>
      </View>
      <View style={{ marginLeft: margins.margin3XL }}>
        <Separator />
      </View>
      {showRestriction && (
        <NativeAccessRestriction onClose={onClose} urlView={course.urlView} />
      )}
    </TouchableOpacity>
  );
};

export default Course;
