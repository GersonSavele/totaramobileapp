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

import React, { useEffect, useState } from "react";

import { getLastAttemptScore } from "./StorageHelper";
import SCORMFeedbackModal from "../components/SCORMFeedbackModal";
import { ActivityType } from "@totara/types";

type AttemptResult = {
  score: string;
  grade: string;
  method: string;
};

type Props = {
  activity: ActivityType;
  onClose: () => void;
  onPrimary: () => void;
};

const OfflineSCORMFeedback = ({ activity, onClose, onPrimary }: Props) => {
  const [offlineLastAttemptResult, setOfflineLastAttemptResult] = useState<
    AttemptResult
  >();
  useEffect(() => {
    getLastAttemptScore(activity.instanceid).then((lastAttemptResult) => {
      if (lastAttemptResult) {
        const result: AttemptResult = {
          ...lastAttemptResult,
          ...{ method: "grade" },
        };
        setOfflineLastAttemptResult(result);
      }
    });
  }, [activity.instanceid]);

  const resultGrade =
    offlineLastAttemptResult && offlineLastAttemptResult.grade
      ? offlineLastAttemptResult.grade
      : undefined;
  const resultScore =
    offlineLastAttemptResult && offlineLastAttemptResult.score
      ? offlineLastAttemptResult.score
      : undefined;
  const resultMethod =
    offlineLastAttemptResult && offlineLastAttemptResult.method
      ? offlineLastAttemptResult.method
      : undefined;

  return (
    <SCORMFeedbackModal
      grade={resultGrade}
      score={resultScore}
      method={resultMethod}
      onClose={onClose}
      onPrimary={onPrimary}
    />
  );
};

export default OfflineSCORMFeedback;
