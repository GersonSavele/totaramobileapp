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
import { StyleSheet, TouchableOpacity, AccessibilityState, AccessibilityRole } from "react-native";
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
  onPress?: () => void;
};

const completionStates = {
  notAvailable: {
    icon: "lock",
    backgroundColor: colorAccent,
    iconColor: colorNeutral7,
    borderColor: colorNeutral7
  },
  completed: {
    icon: "check",
    backgroundColor: colorSuccess,
    iconColor: colorAccent,
    borderColor: colorSuccess
  },
  autoIncomplete: {
    icon: Images.autoCompleteTick,
    backgroundColor: colorAccent,
    iconColor: colorNeutral6,
    borderColor: colorNeutral6,
    fontAwesomeIcon: false
  },
  completeFail: {
    icon: "times",
    backgroundColor: colorAlert,
    iconColor: colorAccent,
    borderColor: colorAlert
  },
  manualIncomplete: {
    backgroundColor: colorAccent,
    iconColor: colorNeutral6,
    borderColor: colorNeutral6
  }
};

const completionAccessibility = {
  notAvailable: {
    label: translate("course.course_details.accessibility_activity_unavailable"),
    role: "none"
  },
  manualCompletion: {
    label: translate("course.course_details.accessibility_manual_completion"),
    state: { checked: false },
    role: "checkbox"
  },
  autoCompletion: {
    role: "checkbox",
    label: translate("course.course_details.accessibility_auto_completion"),
    state: { checked: false, disabled: true }
  },
  completeFail: {
    label: translate("course.course_details.accessibility_manual_completion"),
    hint: translate("course.course_details.accessibility_failed"),
    role: "none"
  }
};

const CompletionIcon = ({ completion, status, available, loading, onPress }: BuildContentProps) => {
  let stateKey;
  let accessibility;
  const isDisabled = loading || !onPress;
  let accessibleLable: string | undefined = undefined;
  let accessibleRole: AccessibilityRole = "spinbutton";
  let accessibleState: AccessibilityState | undefined = undefined;

  if (!available) {
    stateKey = completionIconStateKey.notAvailable;
    accessibility = completionAccessibility.notAvailable;
  } else if (completion !== completionTrack.trackingNone) {
    if (status === completionStatus.completePass || status === completionStatus.complete) {
      stateKey = completionIconStateKey.completed;
      accessibility =
        completion === completionTrack.trackingAutomatic
          ? completionAccessibility.autoCompletion
          : completionAccessibility.manualCompletion;
      accessibility.state = { ...accessibility.state, checked: true };
    } else if (status === completionStatus.incomplete) {
      stateKey =
        completion === completionTrack.trackingAutomatic
          ? completionIconStateKey.autoIncomplete
          : completionIconStateKey.manualIncomplete;
      accessibility =
        completion === completionTrack.trackingAutomatic
          ? completionAccessibility.autoCompletion
          : completionAccessibility.manualCompletion;
      accessibility.state = { ...accessibility.state, checked: false };
    } else if (status === completionStatus.completeFail) {
      stateKey = completionIconStateKey.completeFail;
      accessibility = completionAccessibility.completeFail;
    }
  }
  const stateObj = completionStates[stateKey];
  if (accessibility) {
    accessibleLable = accessibility.label;
    accessibleRole = accessibility.role;
    accessibleState = loading ? { busy: true } : accessibility.state;
  }

  return stateObj ? (
    <TouchableOpacity
      onPress={onPress}
      style={{ marginRight: margins.marginL }}
      disabled={isDisabled}
      accessibilityLabel={accessibleLable}
      accessibilityRole={accessibleRole}
      accessibilityState={accessibleState}
      accessible={true}>
      {loading ? (
        <Spinner size={iconSizes.sizeM} style={styles.spinner} />
      ) : (
        <CircleIcon
          icon={stateObj.icon}
          backgroundColor={stateObj.backgroundColor}
          iconColor={stateObj.iconColor}
          borderColor={stateObj.borderColor}
          fontAwesomeIcon={stateObj.fontAwesomeIcon}
        />
      )}
    </TouchableOpacity>
  ) : null;
};

const styles = StyleSheet.create({
  spinner: {
    height: iconSizes.sizeM,
    width: iconSizes.sizeM
  }
});
export default CompletionIcon;
