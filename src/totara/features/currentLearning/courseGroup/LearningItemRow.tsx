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

import React from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  ImageSourcePropType
} from "react-native";
import { ImageWrapper, Separator } from "@totara/components";
import { NAVIGATION } from "@totara/lib/navigation";
import { navigateTo } from "@totara/lib/navigation";
import { rowItem } from "../courseGroupStyle";
import { margins } from "@totara/theme/constants";
import { Images } from "@resources/images";

const LearningItemRow = ({ course, navigation }: any) => {
  return (
    <TouchableOpacity
      key={course.id}
      onPress={() =>
        navigateTo({
          navigate: navigation.navigate,
          routeId: NAVIGATION.COURSE_DETAILS,
          props: { targetId: course.id }
        })
      }
      activeOpacity={1.0}>
      <View style={rowItem.container}>
        {course.imageSrc.length > 0 ? (
          <ImageWrapper url={course.imageSrc} style={rowItem.imageWrapper} />
        ) : (
          <Image
            style={rowItem.imageWrapper}
            source={Images.defaultCourses as ImageSourcePropType}
          />
        )}
        <View style={rowItem.detailsWrapper}>
          <Text style={rowItem.courseName} numberOfLines={1}>
            {course.fullname}
          </Text>
          <Text style={rowItem.courseSummary} numberOfLines={1}>
            {course.summary}
          </Text>
        </View>
      </View>
      <View style={{ marginLeft: margins.margin3XL }}>
        <Separator />
      </View>
    </TouchableOpacity>
  );
};

export default LearningItemRow;
