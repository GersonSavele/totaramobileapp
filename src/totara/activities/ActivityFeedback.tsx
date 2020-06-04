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

import { ActivityType } from "@totara/types";
import ScormFeedback from "./scorm/ScormFeedback";
import { withNavigation } from "react-navigation";

type Props = {
  activity: ActivityType;
  onClose: () => void;
  onPrimary: () => void;
  data?: any;
};

const ActivityFeedback = ({ activity, onClose, onPrimary, data }: Props) => {
  return (
    <ScormFeedback
      activity={activity}
      onClose={onClose}
      onPrimary={onPrimary}
      isOnline={data && data.isOnline}
      attempt={data && data.attempt}
      gradeMethod={data && data.gradeMethod}
      completionScoreRequired={data && data.completionScoreRequired}
    />
  );
};
export default withNavigation(ActivityFeedback);
