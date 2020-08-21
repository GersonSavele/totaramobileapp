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
import { View, ImageSourcePropType } from "react-native";
import { NavigationStackProp } from "react-navigation-stack";

import { PrimaryButton, ModalContent } from "@totara/components";
import { translate } from "@totara/locale";
import { Grade } from "@totara/types/Scorm";
import { SCORM_TEST_IDS } from "../constants";
import { Images } from "@resources/images";

type ScormFeedbackProps = {
  score: string;
  gradeMethod: Grade;
  showGrades: boolean;
  completionScoreRequired?: number;
  onClose: () => void;
};
type FeedbackProps = {
  navigation: NavigationStackProp<ScormFeedbackProps>;
};

const { ATTEMPT_FEEDBACK } = SCORM_TEST_IDS;

const ScormFeedbackModal = ({ navigation }: FeedbackProps) => {
  const { showGrades, gradeMethod, completionScoreRequired, score, onClose } = navigation.state
    .params as ScormFeedbackProps;

  const isWithGrade = showGrades && completionScoreRequired !== undefined && completionScoreRequired !== null;

  const scoreText = isWithGrade
    ? translate("scorm.feedback.grade_title", { score: `${score}${gradeMethod !== Grade.objective ? "%" : ""}` })
    : "";

  return (
    <View style={{ flex: 1 }} testID={ATTEMPT_FEEDBACK}>
      <ModalContent
        title={scoreText}
        description={translate(
          isWithGrade ? "scorm.feedback.completed_attempt_with_grade" : "scorm.feedback.completed_attempt"
        )}
        imageSource={Images.attemptComplete as ImageSourcePropType}>
        <PrimaryButton text={translate("course.course_complete.button_title")} onPress={onClose} />
      </ModalContent>
    </View>
  );
};

export default ScormFeedbackModal;
