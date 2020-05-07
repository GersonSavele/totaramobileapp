/*

This file is part of Totara Enterprise.
*
Copyright (C) 2020 onwards Totara Learning Solutions LTD
*
Totara Enterprise is provided only to Totara Learning Solutions
LTD’s customers and partners, pursuant to the terms and
conditions of a separate agreement with Totara Learning
Solutions LTD or its affiliate.
*
If you do not have an agreement with Totara Learning Solutions
LTD, you may not access, use, modify, or distribute this software.
Please contact [sales@totaralearning.com] for more information.
*
*/
import React, { useState } from "react";

import { Course, StatusKey } from "@totara/types";
import { NAVIGATION_MY_LEARNING } from "@totara/lib/constants";
import { translate } from "@totara/locale";
import { PrimaryButton, InfoModal } from "@totara/components";

import { NavigationParams } from "react-navigation";

type CourseCompletionProps = {
  course: Course;
  navigation?: NavigationParams;
};

const CourseCompletionSuccessModal = ({
  navigation = {},
  course,
}: CourseCompletionProps) => {
  const [show, setShow] = useState(true);
  const onClose = () => {
    setShow(!show);
    navigation.navigate(NAVIGATION_MY_LEARNING);
  };
  if (course.completion && course.completion.statuskey === StatusKey.complete) {
    return (
      <InfoModal
        transparent={true}
        title={translate("course.course_complete.title")}
        description={translate("course.course_complete.description")}
        imageType="course_complete"
        visible={show}>
        <PrimaryButton
          text={translate("course.course_complete.button_title")}
          onPress={onClose}
        />
      </InfoModal>
    );
  } else {
    return null;
  }
};

export default CourseCompletionSuccessModal;
