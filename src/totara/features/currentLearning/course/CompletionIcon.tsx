/*
 *
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
 */

import React from "react";
import { View } from "react-native";
import { TotaraTheme } from "@totara/theme/Theme";
import {
  completionTrack,
  completionStatus,
  completionIconStateKey
} from "@totara/lib/constants";
import { CircleIcon } from "@totara/components";
import { Images } from "@resources/images";
import { margins } from "@totara/theme/constants";

type BuildContentProps = {
  completion?: string;
  status?: string;
  available: boolean;
};

const completionStates = {
  notAvailable: {
    icon: "lock",
    backgroundColor: TotaraTheme.colorAccent,
    iconColor: TotaraTheme.colorNeutral7,
    borderColor: TotaraTheme.colorNeutral7
  },
  completed: {
    icon: "check",
    backgroundColor: TotaraTheme.colorSuccess,
    iconColor: TotaraTheme.colorAccent,
    borderColor: TotaraTheme.colorSuccess
  },
  autoIncomplete: {
    icon: Images.autoCompleteTick,
    backgroundColor: TotaraTheme.colorAccent,
    iconColor: TotaraTheme.colorNeutral6,
    borderColor: TotaraTheme.colorNeutral6,
    fontAwesomeIcon: false
  },
  completeFail: {
    icon: "times",
    backgroundColor: TotaraTheme.colorAlert,
    iconColor: TotaraTheme.colorAccent,
    borderColor: TotaraTheme.colorAlert
  },
  manualIncomplete: {
    backgroundColor: TotaraTheme.colorAccent,
    iconColor: TotaraTheme.colorNeutral6,
    borderColor: TotaraTheme.colorNeutral6
  }
};

const CompletionIcon = ({
  completion,
  status,
  available
}: BuildContentProps) => {
  let stateKey;
  if (!available) {
    stateKey = completionIconStateKey.notAvailable;
  } else {
    if (
      status === completionStatus.completePass ||
      status === completionStatus.complete
    ) {
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
      <CircleIcon
        icon={stateObj.icon}
        backgroundColor={stateObj.backgroundColor}
        iconColor={stateObj.iconColor}
        borderColor={stateObj.borderColor}
        fontAwesomeIcon={stateObj.fontAwesomeIcon}
      />
    </View>
  ) : null;
};

export default CompletionIcon;
