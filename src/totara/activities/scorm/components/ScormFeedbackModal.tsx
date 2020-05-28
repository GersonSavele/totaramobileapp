/**
 * This file is part of Totara Mobile
 *
 * Copyright (C) 2019 onwards Totara Learning Solutions LTD
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @author: Kamala Tennakoon <kamala.tennakoon@totaralearning.com>
 */
import React from "react";
import { View, Text, Modal, Image } from "react-native";
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
    <Modal animationType="slide" transparent>
      <View style={scormFeedbackStyles.transparentViewStyle}>
        <SafeAreaView />
        <View style={scormFeedbackStyles.wrapper}>
          <View style={scormFeedbackStyles.resultOuterWrapper}>
            <View style={scormFeedbackStyles.resultInnerWrapper}>
              <View style={scormFeedbackStyles.resultContainer}>
                {!completionScoreRequired && (
                  <Image
                    style={scormFeedbackStyles.resultStatusImage}
                    source={require("@resources/images/success_tick/success_tick.png")}
                  />
                )}
                {completionScoreRequired && (
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
                      {score
                        ? `${score}${
                            gradeMethod === Grade.objective ? "" : "%"
                          }`
                        : ""}
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
    </Modal>
  );
};

export default ScormFeedbackModal;
