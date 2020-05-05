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

import { AppliedTheme } from "@totara/theme/Theme";
import { completionTrack, completionStatus } from "@totara/lib/constants";
import { ContentIcon } from "@totara/components";
// @ts-ignore NOTE: tried "@resources/*": ["resources/*"] in tslint file and did not work
import { Images } from "@resources/images";

type BuildContentProps = {
  completion?: string;
  status?: string;
  available: boolean;
  theme: AppliedTheme;
};

const ContentIconWrapper = ({
  completion,
  status,
  available,
  theme,
}: BuildContentProps) => {
  if (!available) {
    return (
      <ContentIcon
        icon={"lock"}
        iconSize={15}
        size={30}
        backgroundColor={theme.colorAccent}
        iconColor={theme.colorNeutral7}
        borderColor={theme.colorNeutral7}
      />
    );
  } else if (
    completion === completionTrack.trackingAutomatic &&
    (status === completionStatus.completePass ||
      status === completionStatus.complete)
  ) {
    return (
      <ContentIcon
        icon={"check"}
        iconSize={15}
        size={30}
        backgroundColor={theme.colorSuccess}
        iconColor={theme.colorAccent}
        borderColor={theme.colorSuccess}
      />
    );
  } else if (
    completion === completionTrack.trackingAutomatic &&
    status === completionStatus.incomplete
  ) {
    return (
      <ContentIcon
        icon={Images.autoCompleteTick}
        iconSize={15}
        size={30}
        backgroundColor={theme.colorAccent}
        iconColor={theme.colorNeutral6}
        borderColor={theme.colorNeutral6}
        fontAwesomeIcon={false}
      />
    );
  } else if (status === completionStatus.completeFail) {
    return (
      <ContentIcon
        icon={"times"}
        iconSize={15}
        size={30}
        backgroundColor={theme.colorAlert}
        iconColor={theme.colorAccent}
        borderColor={theme.colorAlert}
      />
    );
  } else if (
    completion === completionTrack.trackingManual &&
    (status === completionStatus.completePass ||
      status === completionStatus.complete)
  ) {
    return (
      <ContentIcon
        icon={"check"}
        iconSize={15}
        size={30}
        backgroundColor={theme.colorSuccess}
        iconColor={theme.colorAccent}
        borderColor={theme.colorSuccess}
      />
    );
  } else if (
    completion === completionTrack.trackingManual &&
    status === completionStatus.incomplete
  ) {
    return (
      <ContentIcon
        iconSize={15}
        size={30}
        backgroundColor={theme.colorAccent}
        iconColor={theme.colorNeutral6}
        borderColor={theme.colorNeutral6}
      />
    );
  } else {
    return null;
  }
};

export default ContentIconWrapper;
