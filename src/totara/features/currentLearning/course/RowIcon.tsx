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
import { completionTrack, completionStatus } from "@totara/lib/constants";
import { ContentIcon } from "@totara/components";
// @ts-ignore NOTE: tried "@resources/*": ["resources/*"] in tslint file and did not work
import { Images } from "@resources/images";
import { margins } from "@totara/theme/constants";

type BuildContentProps = {
  completion?: string;
  status?: string;
  available: boolean;
};

const RowIcon = ({ completion, status, available }: BuildContentProps) => {
  if (!available) {
    return (
      <View style={{ marginRight: margins.marginL }}>
        <ContentIcon
          icon={"lock"}
          iconSize={12}
          size={24}
          backgroundColor={TotaraTheme.colorAccent}
          iconColor={TotaraTheme.colorNeutral7}
          borderColor={TotaraTheme.colorNeutral7}
        />
      </View>
    );
  } else if (
    completion === completionTrack.trackingAutomatic &&
    (status === completionStatus.completePass ||
      status === completionStatus.complete)
  ) {
    return (
      <View style={{ marginRight: margins.marginL }}>
        <ContentIcon
          icon={"check"}
          iconSize={12}
          size={24}
          backgroundColor={TotaraTheme.colorSuccess}
          iconColor={TotaraTheme.colorAccent}
          borderColor={TotaraTheme.colorSuccess}
        />
      </View>
    );
  } else if (
    completion === completionTrack.trackingAutomatic &&
    status === completionStatus.incomplete
  ) {
    return (
      <View style={{ marginRight: margins.marginL }}>
        <ContentIcon
          icon={Images.autoCompleteTick}
          iconSize={12}
          size={24}
          backgroundColor={TotaraTheme.colorAccent}
          iconColor={TotaraTheme.colorNeutral6}
          borderColor={TotaraTheme.colorNeutral6}
          fontAwesomeIcon={false}
        />
      </View>
    );
  } else if (status === completionStatus.completeFail) {
    return (
      <View style={{ marginRight: margins.marginL }}>
        <ContentIcon
          icon={"times"}
          iconSize={12}
          size={24}
          backgroundColor={TotaraTheme.colorAlert}
          iconColor={TotaraTheme.colorAccent}
          borderColor={TotaraTheme.colorAlert}
        />
      </View>
    );
  } else if (
    completion === completionTrack.trackingManual &&
    (status === completionStatus.completePass ||
      status === completionStatus.complete)
  ) {
    return (
      <View style={{ marginRight: margins.marginL }}>
        <ContentIcon
          icon={"check"}
          iconSize={12}
          size={24}
          backgroundColor={TotaraTheme.colorSuccess}
          iconColor={TotaraTheme.colorAccent}
          borderColor={TotaraTheme.colorSuccess}
        />
      </View>
    );
  } else if (
    completion === completionTrack.trackingManual &&
    status === completionStatus.incomplete
  ) {
    return (
      <View style={{ marginRight: margins.marginL }}>
        <ContentIcon
          iconSize={12}
          size={24}
          backgroundColor={TotaraTheme.colorAccent}
          iconColor={TotaraTheme.colorNeutral6}
          borderColor={TotaraTheme.colorNeutral6}
        />
      </View>
    );
  } else {
    return null;
  }
};

export default RowIcon;
