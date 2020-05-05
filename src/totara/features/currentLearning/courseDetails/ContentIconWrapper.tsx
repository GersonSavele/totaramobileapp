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

import React from "react";
import { View } from "react-native";

import { AppliedTheme } from "@totara/theme/Theme";
import { CompletionTrack, CompletionStatus } from "@totara/types";
import { ContentIcon } from "@totara/components";
import  autoCompleteTick  from "@resources/images/auto_complete_tick/auto_complete_tick.png";
import { activityIconStyles } from "@totara/theme/activityList";

type BuildContentProps = {
  completion?: string;
  completionStatus?: string;
  available: boolean;
  theme: AppliedTheme;
};

const ContentIconWrapper = ({
  completion,
  completionStatus,
  available,
  theme,
}: BuildContentProps) => {
  if (!available) {
    return (
      <View style={activityIconStyles.container}>
        <ContentIcon
          icon={"lock"}
          iconSize={15}
          size={30}
          backgroundColor={theme.colorAccent}
          iconColor={theme.colorNeutral7}
          borderColor={theme.colorNeutral7}
        />
      </View>
    );
  } else if (
    completion === CompletionTrack.trackingAutomatic &&
    (completionStatus === CompletionStatus.completePass ||
      completionStatus === CompletionStatus.complete)
  ) {
    return (
      <View style={activityIconStyles.container}>
        <ContentIcon
          icon={"check"}
          iconSize={15}
          size={30}
          backgroundColor={theme.colorSuccess}
          iconColor={theme.colorAccent}
          borderColor={theme.colorSuccess}
        />
      </View>
    );
  } else if (
    completion === CompletionTrack.trackingAutomatic &&
    completionStatus === CompletionStatus.incomplete
  ) {
    return (
      <View style={activityIconStyles.container}>
        <ContentIcon
          icon={autoCompleteTick}
          iconSize={15}
          size={30}
          backgroundColor={theme.colorAccent}
          iconColor={theme.colorNeutral6}
          borderColor={theme.colorNeutral6}
          fontAwesomeIcon={false}
        />
      </View>
    );
  } else if (completionStatus === CompletionStatus.completeFail) {
    return (
      <View style={activityIconStyles.container}>
        <ContentIcon
          icon={"times"}
          iconSize={15}
          size={30}
          backgroundColor={theme.colorAlert}
          iconColor={theme.colorAccent}
          borderColor={theme.colorAlert}
        />
      </View>
    );
  } else if (
    completion === CompletionTrack.trackingManual &&
    (completionStatus === CompletionStatus.completePass ||
      completionStatus === CompletionStatus.complete)
  ) {
    return (
      <View style={activityIconStyles.container}>
        <ContentIcon
          icon={"check"}
          iconSize={15}
          size={30}
          backgroundColor={theme.colorSuccess}
          iconColor={theme.colorAccent}
          borderColor={theme.colorSuccess}
        />
      </View>
    );
  } else if (
    completion === CompletionTrack.trackingManual &&
    completionStatus === CompletionStatus.incomplete
  ) {
    return (
      <View style={activityIconStyles.container}>
        <ContentIcon
          iconSize={15}
          size={30}
          backgroundColor={theme.colorAccent}
          iconColor={theme.colorNeutral6}
          borderColor={theme.colorNeutral6}
        />
      </View>
    );
  } else {
    return null;
  }
};

export default ContentIconWrapper;
