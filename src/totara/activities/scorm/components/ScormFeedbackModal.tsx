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
import React, { useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  Modal,
  Image,
  Dimensions,
  Platform
} from "react-native";
import SafeAreaView from "react-native-safe-area-view";

import { ThemeContext } from "@totara/theme";
import { PrimaryButton, TertiaryButton } from "@totara/components";
import { translate } from "@totara/locale";
import { margins } from "@totara/theme/constants";

type SCORMFeedbackProps = {
  score?: string;
  grade?: string;
  method?: string;
  onClose: () => void;
  onPrimary: () => void;
};

const ScormFeedbackModal = ({
  score,
  grade,
  method,
  onClose,
  onPrimary
}: SCORMFeedbackProps) => {
  const [theme] = useContext(ThemeContext);
  return (
    <Modal animationType="slide" transparent>
      <View style={stylesScormFeedback.transparentViewStyle}>
        <SafeAreaView />
        <View style={stylesScormFeedback.wrapper}>
          <View
            style={{
              ...stylesScormFeedback.resultOuterWrapper,
              backgroundColor: theme.colorNeutral1
            }}>
            <View
              style={{
                ...stylesScormFeedback.resultInnerWrapper,
                backgroundColor: theme.colorNeutral3,
                borderBottomStartRadius:
                  stylesScormFeedback.resultOuterWrapper.width * 2,
                borderBottomEndRadius:
                  stylesScormFeedback.resultOuterWrapper.width * 2,
                transform: [{ scaleX: 2 }]
              }}>
              <View
                style={{
                  ...stylesScormFeedback.resultContainer,
                  backgroundColor: theme.colorNeutral7,
                  transform: [{ scaleX: 0.5 }]
                }}>
                {!method && (
                  <Image
                    style={stylesScormFeedback.resultStatusImage}
                    source={require("@resources/images/success_tick/success_tick.png")}
                  />
                )}
                {method && (
                  <>
                    <Text
                      style={{
                        ...theme.textB3,
                        ...stylesScormFeedback.resultTitle,
                        color: theme.textColorLight
                      }}>
                      {translate("scorm.feedback.grade_title")}
                    </Text>
                    <Text
                      style={{
                        ...theme.textH1,
                        ...stylesScormFeedback.score,
                        color: theme.textColorLight,
                        marginVertical: margins.marginS
                      }}>
                      {score ? score : ""}
                    </Text>
                  </>
                )}
              </View>
            </View>
            <View style={stylesScormFeedback.actionWrapper}>
              <Text
                style={{
                  ...theme.textH4,
                  marginBottom: margins.margin2XL,
                  textAlign: "center"
                }}>
                {translate("scorm.feedback.action_info")}
              </Text>
              <View style={stylesScormFeedback.actionContainer}>
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

const stylesScormFeedback = StyleSheet.create({
  transparentViewStyle: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)"
  },
  wrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  resultOuterWrapper: {
    flex: 1,
    height: Dimensions.get("window").height * 0.7,
    width: Dimensions.get("window").width * 0.7,
    borderRadius: 4,
    marginHorizontal: "8%",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-around",
    alignSelf: "center",
    overflow: "hidden"
  },
  resultInnerWrapper: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignSelf: "center",
    width: "100%",
    overflow: "hidden"
  },
  resultContainer: {
    width: 185,
    height: 185,
    borderRadius: 92.5,
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    alignSelf: "center"
  },
  resultStatusImage: {
    alignSelf: "center",
    height: "50%",
    width: "50%",
    resizeMode: "contain"
  },
  resultTitle: {
    textAlign: "center",
    fontWeight: "600"
  },
  score: {
    textAlign: "center"
  },
  actionWrapper: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: margins.margin3XL
  },
  actionContainer: {
    alignSelf: "center",
    justifyContent: "space-between",
    alignContent: "space-between"
  }
});

export default ScormFeedbackModal;
