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
 *
 * @author: Kamala Tennakoon <kamala.tennakoon@totaralearning.com>
 */
import React from "react";
import { View } from "react-native";
import { NavigationStackProp } from "react-navigation-stack";

import { PrimaryButton, InfoContent } from "@totara/components";
import { translate } from "@totara/locale";
import { Grade } from "@totara/types/Scorm";
import { SCORM_TEST_IDS } from "../constants";

type ScormFeedbackProps = {
  score: string;
  gradeMethod: Grade;
  completionScoreRequired?: number;
  onClose: () => void;
};
type FeedbackProps = {
  navigation: NavigationStackProp<ScormFeedbackProps>;
};

const { ATTEMPT_FEEDBACK } = SCORM_TEST_IDS;

const ScormFeedbackModal = ({ navigation }: FeedbackProps) => {
  const { gradeMethod, completionScoreRequired, score, onClose } = navigation.state.params as ScormFeedbackProps;

  const isWithGrade = completionScoreRequired !== undefined && completionScoreRequired !== null;
  const scoreText =
    (isWithGrade &&
      `${translate("scorm.feedback.grade_title")} ${score}${(gradeMethod !== Grade.objective && `%`) || ""}`) ||
    undefined;

  return (
    <View style={{ flex: 1 }} testID={ATTEMPT_FEEDBACK}>
      <InfoContent
        title={scoreText}
        description={
          (isWithGrade && translate("scorm.feedback.completed_attempt_with_grade")) ||
          translate("scorm.feedback.completed_attempt")
        }
        imageType={"attempt_complete"}>
        <PrimaryButton text={translate("general.continue_learning")} onPress={onClose} />
      </InfoContent>
    </View>
  );
};

export default ScormFeedbackModal;
