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

import { PrimaryButton, TertiaryButton } from "@totara/components";
import { translate } from "@totara/locale";
import { margins } from "@totara/theme/constants";
import { scormFeedbackStyles } from "@totara/theme/scorm";
import { Grade } from "@totara/types/Scorm";
import { TotaraTheme } from "@totara/theme/Theme";

type SCORMFeedbackProps = {
  score?: string;
  gradeMethod: Grade;
  completionScoreRequired?: number;
  onClose: () => void;
  onPrimary: () => void;
};

const ScormFeedbackModal = ({
  score,
  gradeMethod,
  completionScoreRequired,
  onClose,
  onPrimary
}: SCORMFeedbackProps) => {
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
                  style={scormFeedbackStyles.resultStatusImage}
                  source={require("@resources/images/success_tick/success_tick.png")}
                />
              ) : (
                <>
                  <Text
                    style={{
                      ...TotaraTheme.textB3,
                      ...scormFeedbackStyles.resultTitle
                    }}>
                    {translate("scorm.feedback.grade_title")}
                  </Text>
                  <Text
                    style={{
                      ...TotaraTheme.textH1,
                      ...scormFeedbackStyles.scoreText
                    }}>
                    {score &&
                      `${score}${gradeMethod === Grade.objective ? "" : "%"}`}
                  </Text>
                </>
              )}
            </View>
          </View>
          <View style={scormFeedbackStyles.actionWrapper}>
            <Text
              style={{
                ...TotaraTheme.textH4,
                marginBottom: margins.margin2XL,
                textAlign: "center"
              }}>
              {translate("scorm.feedback.action_info")}
            </Text>
            <View style={scormFeedbackStyles.actionContainer}>
              <PrimaryButton
                onPress={onClose}
                text={translate("scorm.feedback.back")}
                style={{ marginBottom: margins.marginL }}
              />
              <TertiaryButton
                onPress={onPrimary}
                text={translate("scorm.feedback.attempt_again")}
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
