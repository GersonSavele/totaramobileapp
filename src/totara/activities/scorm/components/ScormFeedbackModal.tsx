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
import { View, Text, Image } from "react-native";
import SafeAreaView from "react-native-safe-area-view";

import { PrimaryButton } from "@totara/components";
import { translate } from "@totara/locale";
import { margins } from "@totara/theme/constants";
import { scormFeedbackStyles } from "@totara/theme/scorm";
import { Grade } from "@totara/types/Scorm";
import { TotaraTheme } from "@totara/theme/Theme";
import { NavigationStackProp } from "react-navigation-stack";

type SCORMFeedbackProps = {
  score: string;
  gradeMethod: Grade;
  completionScoreRequired?: number;
  onClose: () => void;
};
type FeedbackProps = {
  navigation: NavigationStackProp<SCORMFeedbackProps>;
};
const ScormFeedbackModal = ({ navigation }: FeedbackProps) => {
  const { gradeMethod, completionScoreRequired, score, onClose } = navigation
    .state.params as SCORMFeedbackProps;
  return (
    <View style={scormFeedbackStyles.transparentViewStyle}>
      <SafeAreaView />
      <View style={scormFeedbackStyles.wrapper}>
        <View style={scormFeedbackStyles.resultOuterWrapper}>
          <View style={scormFeedbackStyles.resultInnerWrapper}>
            <View style={scormFeedbackStyles.resultContainer}>
              {completionScoreRequired === undefined ||
              completionScoreRequired === null ? (
                <Image
                  testID={"scorm_feedback_completed_image"}
                  style={scormFeedbackStyles.resultStatusImage}
                  source={require("@resources/images/success_tick/success_tick.png")}
                />
              ) : (
                <>
                  <Text
                    style={{
                      ...TotaraTheme.textXSmall,
                      ...scormFeedbackStyles.resultTitle
                    }}>
                    {translate("scorm.feedback.grade_title")}
                  </Text>
                  <Text
                    testID={"scorm_feedback_score_value"}
                    style={{
                      ...TotaraTheme.textH1,
                      ...scormFeedbackStyles.scoreText
                    }}>
                    {`${score}${gradeMethod === Grade.objective ? "" : "%"}`}
                  </Text>
                </>
              )}
            </View>
          </View>
          <View style={scormFeedbackStyles.actionWrapper}>
            <View style={scormFeedbackStyles.actionContainer}>
              <PrimaryButton
                onPress={onClose}
                text={translate("general.ok")}
                style={{ marginBottom: margins.marginL }}
              />
            </View>
          </View>
        </View>
      </View>
      <SafeAreaView />
    </View>
  );
};

export default ScormFeedbackModal;
