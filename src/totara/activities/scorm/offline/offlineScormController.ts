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

import { get, values } from "lodash";

import {
  Grade,
  AttemptGrade,
  ScormActivityResult,
  ScormBundle,
} from "@totara/types/Scorm";
import {
  setScormPackageData,
  getScormPackageData,
  getAllCommits,
  clearCommit,
} from "./StorageHelper";
import { scormLessonStatus, SECONDS_FORMAT } from "@totara/lib/constants";
import moment from "moment";

const getOfflineScormPackageName = (scormId: string) =>
  `OfflineSCORM_${scormId}`;

const getGradeForAttempt = (
  attemptCmi: any,
  maxGrade: number,
  gradeMethod: Grade
) => {
  let sumGrade = 0;
  let highestGrade = 0;
  let completedScos = 0;
  let averageGrade = 0;
  if (Object.keys(attemptCmi) && Object.keys(attemptCmi).length > 0) {
    const numberOfScors = Object.keys(attemptCmi).length;
    for (let [, cmi] of Object.entries(attemptCmi)) {
      // Check whether SCORM-1.2 can be "score.raw" and "core.score.raw"
      // Versions of scorm have different "score" paths
      const rawScore = parseInt(
        get(cmi, "core.score.raw", undefined) || get(cmi, "score.raw", 0)
      );
      const lessonStatus = get(cmi, "core.lesson_status", "").toLowerCase();
      if (
        lessonStatus === scormLessonStatus.passed ||
        lessonStatus === scormLessonStatus.completed
      ) {
        completedScos = completedScos + 1;
      }
      sumGrade = sumGrade + rawScore;
      if (highestGrade < rawScore) {
        highestGrade = rawScore;
      }
    }
    averageGrade = sumGrade / numberOfScors;
  }
  const getGrades = () => ({
    [Grade.objective]: completedScos,
    [Grade.highest]: Math.round(highestGrade * (100 / maxGrade)),
    [Grade.average]: Math.round(averageGrade * (100 / maxGrade)),
    [Grade.sum]: Math.round(sumGrade * (100 / maxGrade)),
  });
  return getGrades()[gradeMethod];
};

const getAttemptsGrade = (
  attemptsReport: ScormActivityResult[],
  attemptGrade: AttemptGrade,
  maxGrade: number
): number => {
  if (!attemptsReport || attemptsReport.length === 0) {
    return 0;
  }
  switch (attemptGrade) {
    case AttemptGrade.highest: {
      const highestAttempt = attemptsReport.reduce(
        (result: any, highestResult: any) => {
          if (result && result.gradereported > highestResult.gradereported) {
            return result;
          }
          return highestResult;
        },
        undefined
      );
      return get(highestAttempt, "gradereported", 0);
    }
    case AttemptGrade.average: {
      const sumofscores = attemptsReport.reduce(
        (scores: number, attemptResult: any) =>
          scores + attemptResult.gradereported,
        0
      );
      const rawSum = sumofscores * (maxGrade / 100);
      const avgRawSum = Math.round(rawSum / attemptsReport.length);
      return avgRawSum * (100 / maxGrade);
    }
    case AttemptGrade.first:
      return attemptsReport[0].gradereported;
    case AttemptGrade.last:
      return attemptsReport[attemptsReport.length - 1].gradereported;
  }
};

const calculatedAttemptsGrade = (
  attemptGrade: AttemptGrade,
  gradeMethod: Grade,
  maxGrade: number,
  onlineCalculatedGrade?: string,
  onlineAttempts: ScormActivityResult[] = [],
  offlineAttempts: ScormActivityResult[] = []
) => {
  if (
    offlineAttempts &&
    onlineAttempts &&
    offlineAttempts.length > 0 &&
    attemptGrade !== null &&
    gradeMethod !== null &&
    maxGrade !== null
  ) {
    const allAttempts = [...onlineAttempts, ...offlineAttempts];
    const caculatedGradeReport = getAttemptsGrade(
      allAttempts,
      attemptGrade,
      maxGrade
    );
    return gradeMethod == Grade.objective
      ? caculatedGradeReport.toString()
      : `${caculatedGradeReport}%`;
  } else {
    return onlineCalculatedGrade;
  }
};

const syncOfflineScormBundle = (scormId: string, data: any): Promise<void> => {
  return getScormPackageData(scormId).then((storedData) => {
    let newData = {
      ...data,
      lastsynced: parseInt(moment().format(SECONDS_FORMAT)),
    };
    if (storedData) {
      newData = {
        ...storedData,
        lastsynced: newData.lastsynced,
      } as ScormBundle;

      if (data.scormPackage) {
        newData.scormPackage = data.scormPackage;
      }
      return setScormPackageData(scormId, newData);
    } else {
      if (newData && newData.scormPackage && newData.scormPackage.path) {
        return setScormPackageData(scormId, newData);
      }
    }
  });
};

const getOfflineScormCommits = () => {
  return getAllCommits().then((storedData) => {
    let formattedUnsyncedData = undefined;
    if (storedData) {
      formattedUnsyncedData = [];
      for (let commitScormId in storedData) {
        const scormCommits = storedData[commitScormId];
        const orededAttemptKeys = Object.keys(scormCommits).sort();
        for (let index = 0; index < orededAttemptKeys.length; index++) {
          const commitAttempt = orededAttemptKeys[index];
          if (scormCommits[commitAttempt]) {
            const commitTracks = values(scormCommits[commitAttempt]).filter(
              (value) => value
            );
            const commit = {
              scormId: commitScormId,
              attempt: parseInt(commitAttempt),
              tracks: commitTracks,
            };
            formattedUnsyncedData.push(commit);
          }
        }
      }
    }
    return formattedUnsyncedData;
  });
};

const clearSyncedScormCommit = (scormId: string, attempt: number) => {
  return clearCommit(scormId, attempt);
};

export {
  calculatedAttemptsGrade,
  syncOfflineScormBundle,
  getOfflineScormCommits,
  clearSyncedScormCommit,
  getGradeForAttempt,
  getAttemptsGrade,
  getOfflineScormPackageName,
};
