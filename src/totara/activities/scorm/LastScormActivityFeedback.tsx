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

import React, { useEffect, useState, useContext } from "react";

import { ActivityType } from "@totara/types";
import { ActivitySheetContext } from "@totara/activities/ActivitySheet";
import { getScormFeedbackData } from "@totara/lib/scorm";
import ScormFeedbackModal from "./components/ScormFeedbackModal";

type AttemptResult = {
  score: string;
  grade: string;
  method: string;
};

type Props = {
  activity: ActivityType;
  onClose: () => void;
  onPrimary: () => void;
  attempt: number;
  report: any;
  isOnline: boolean;
};

const LastScormActivityFeedback = ({
  activity,
  onClose,
  onPrimary,
  attempt,
  report,
  isOnline
}: Props) => {
  const [lastAttemptResult, setLastAttemptResult] = useState<AttemptResult>(
    report
  );
  const activitySheet = useContext(ActivitySheetContext);
  console.log("LastScormActivityFeedback: ", LastScormActivityFeedback);
  useEffect(() => {
    getScormFeedbackData(activity.instanceid, isOnline, report).then(
      (result) => {
        console.log(
          "result.scorm.attemptsCurrent === attempt",
          result.attemptsCurrent,
          " === ",
          attempt
        );
        if (result && result.attemptsCurrent === attempt) {
          setLastAttemptResult(result);
        } else {
          // activitySheet.setFeedback(undefined);
        }
      }
    );
  }, [activity.instanceid, isOnline]);

  const resultGrade =
    lastAttemptResult && lastAttemptResult.grade
      ? lastAttemptResult.grade
      : undefined;
  const resultScore =
    lastAttemptResult && lastAttemptResult.score
      ? lastAttemptResult.score
      : undefined;
  const resultMethod =
    lastAttemptResult && lastAttemptResult.method
      ? lastAttemptResult.method
      : undefined;

  return lastAttemptResult ? (
    <ScormFeedbackModal
      grade={resultGrade}
      score={resultScore}
      method={resultMethod}
      onClose={onClose}
      onPrimary={onPrimary}
    />
  ) : null;
};

export default LastScormActivityFeedback;
