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
import { View, StyleSheet } from "react-native";
import { TotaraTheme } from "@totara/theme/Theme";
import { completionTrack, completionStatus, completionIconStateKey } from "../constants";
import { CircleIcon } from "@totara/components";
import { Images } from "@resources/images";
import { iconSizes, margins } from "@totara/theme/constants";
import { Spinner } from "native-base";
import { translate } from "@totara/locale";

const { colorAccent, colorNeutral7, colorSuccess, colorNeutral6, colorAlert } = TotaraTheme;

type BuildContentProps = {
  completion?: string;
  status?: string;
  available: boolean;
  loading?: boolean;
};

const completionStates = {
  notAvailable: {
    icon: "lock",
    backgroundColor: colorAccent,
    iconColor: colorNeutral7,
    borderColor: colorNeutral7,
    accessibilityLabel: translate("course.course_details.accessibility_activity_unavailable")
  },
  completed: {
    icon: "check",
    backgroundColor: colorSuccess,
    iconColor: colorAccent,
    borderColor: colorSuccess,
    accessibilityLabel: translate("course.course_details.accessibility_activity_completion"),
    accessibilityHint: translate("course.course_details.accessibility_completed")
  },
  autoIncomplete: {
    icon: Images.autoCompleteTick,
    backgroundColor: colorAccent,
    iconColor: colorNeutral6,
    borderColor: colorNeutral6,
    fontAwesomeIcon: false,
    accessibilityLabel: translate("course.course_details.accessibility_activity_completion"),
    accessibilityHint: translate("course.course_details.accessibility_incomplete")
  },
  completeFail: {
    icon: "times",
    backgroundColor: colorAlert,
    iconColor: colorAccent,
    borderColor: colorAlert,
    accessibilityLabel: translate("course.course_details.accessibility_activity_completion"),
    accessibilityHint: translate("course.course_details.accessibility_failed")
  },
  manualIncomplete: {
    backgroundColor: colorAccent,
    iconColor: colorNeutral6,
    borderColor: colorNeutral6,
    accessibilityLabel: translate("course.course_details.accessibility_activity_completion"),
    accessibilityHint: translate("course.course_details.accessibility_incomplete")
  }
};

const CompletionIcon = ({ completion, status, available, loading }: BuildContentProps) => {
  let stateKey;
  if (!available) {
    stateKey = completionIconStateKey.notAvailable;
  } else if (completion !== completionTrack.trackingNone) {
    if (status === completionStatus.completePass || status === completionStatus.complete) {
      stateKey = completionIconStateKey.completed;
    } else if (status === completionStatus.incomplete) {
      stateKey =
        completion === completionTrack.trackingAutomatic
          ? completionIconStateKey.autoIncomplete
          : completionIconStateKey.manualIncomplete;
    } else if (status === completionStatus.completeFail) {
      stateKey = completionIconStateKey.completeFail;
    }
  }
  const stateObj = completionStates[stateKey];

  return stateObj ? (
    <View style={{ marginRight: margins.marginL }}>
      {loading ? (
        <Spinner size={iconSizes.sizeM} style={styles.spinner} />
      ) : (
        <CircleIcon
          icon={stateObj.icon}
          backgroundColor={stateObj.backgroundColor}
          iconColor={stateObj.iconColor}
          borderColor={stateObj.borderColor}
          fontAwesomeIcon={stateObj.fontAwesomeIcon}
          accessibilityLabel={stateObj.accessibilityLabel}
          accessibilityHint={stateObj.accessibilityHint}
        />
      )}
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  spinner: {
    height: iconSizes.sizeM,
    width: iconSizes.sizeM
  }
});
export default CompletionIcon;
