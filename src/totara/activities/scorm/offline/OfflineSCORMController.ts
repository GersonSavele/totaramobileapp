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

import { Grade, AttemptGrade, ScormActivityResult, ScormBundle } from "@totara/types/Scorm";
import { RetrieveStorageDataById } from "@totara/core/ResourceManager/StorageManager";
import { removeScormPackageData, getScormData, setScormPackageData, getScormPackageData, getAllCommits, clearCommit } from "./StorageHelper";
import { LessonStatus } from "@totara/lib/Constant";

const getGradeForAttempt = (attemptCmi: any, maxGrade: number, gradeMethod: Grade) => {
  let sumGrade = 0;
  let highestGrade = 0;
  let completedScos = 0;
  let averageGrade = 0;
  if (Object.keys(attemptCmi) && Object.keys(attemptCmi).length > 0) {
    const numberOfScors = Object.keys(attemptCmi).length;
    for (let [, cmi] of Object.entries(attemptCmi)) {
      // Check whether SCORM-1.2 can be "score.raw" and "core.score.raw"
      // Versions of scorm have different "score" paths
      const rawScore =  parseInt(get(cmi,'core.score.raw', undefined) || get(cmi,'score.raw', 0));
      const lessonStatus = get(cmi,'core.lesson_status', '').toLowerCase();
      if (lessonStatus === LessonStatus.passed || lessonStatus === LessonStatus.completed) {
        completedScos = completedScos + 1;
      }
      sumGrade = sumGrade + rawScore;
      if (highestGrade < rawScore) {
        highestGrade = rawScore;
      }
    }
    averageGrade = (sumGrade / numberOfScors);
  }
  const getGrades = () => ({
    [Grade.objective]: completedScos,
    [Grade.highest]: Math.round(highestGrade * (100 / maxGrade)),
    [Grade.average]: Math.round(averageGrade * (100 / maxGrade)),
    [Grade.sum]: Math.round(sumGrade * (100 / maxGrade)),
  });
  return getGrades()[gradeMethod];
};


const getAttemptsGrade = (attemptsReport: ScormActivityResult[], attemptGrade: AttemptGrade, maxGrade: number) => {
  if(!attemptsReport || attemptsReport.length === 0 ) {
    return 0;
  }
  switch(attemptGrade) {
    case AttemptGrade.highest: {
      const highestAttempt = attemptsReport.reduce((result: any, highestResult: any) => { 
        if (result && result.gradereported > highestResult.gradereported) {
            return result;
        } 
        return highestResult;
      }, undefined);
      return get(highestAttempt, 'gradereported', 0);
    }
    case AttemptGrade.average: {
      const sumofscores = attemptsReport.reduce((scores: number, attemptResult: any) => (scores + attemptResult.gradereported), 0);
      const rawSum = (sumofscores * (maxGrade / 100));
      const avgRawSum = Math.round(rawSum / attemptsReport.length);
      return (avgRawSum * (100 / maxGrade));
    }
    case AttemptGrade.first: 
      return attemptsReport[0].gradereported;
    case AttemptGrade.last:
      return attemptsReport[attemptsReport.length - 1].gradereported; 
  }
};

const getOfflineAttemptsReport = (cmiList:any, maxgrade: number, grademethod: Grade) => {
  let scoresData = [];
  for (let [attempt, scosData] of Object.entries(cmiList)) {
    const attemptScore = getGradeForAttempt(scosData, maxgrade, grademethod);
    
    scoresData.push({ attempt: parseInt(attempt), gradereported: attemptScore});
  }    
  return scoresData; 
};

const getOfflineScormBundle = (scormId: number) => {
   return RetrieveStorageDataById(scormId.toString()).then(storedResourceData => { 
      if (!storedResourceData || storedResourceData === undefined || storedResourceData === null) {
          return removeScormPackageData(scormId);
      } else {
          return Promise.resolve()
      }
    }).then(() => {
      return getScormData(scormId);
    }).then(({bundle, cmis}) => {
      let formattedData = bundle as ScormBundle | undefined;
      if (formattedData && formattedData.scorm && formattedData.scorm.grademethod && formattedData.scorm.maxgrade) {
        if(cmis) {
          const gradeMethod = formattedData.scorm.grademethod as Grade
          const maxGrade = formattedData.scorm.maxgrade;
          const offlineReport = getOfflineAttemptsReport(cmis, maxGrade, gradeMethod);
          return {...formattedData, ...{offlineActivity: {attempts: offlineReport}}};
        }
      }
      return formattedData;
    });
 };

const calculatedAttemptsGrade = (attemptGrade: AttemptGrade, gradeMethod: Grade, maxGrade: number, onlineCalculatedGrade?: number, onlineAttempts?:ScormActivityResult[], offlineAttempts?: ScormActivityResult[]) => {
  if (offlineAttempts && offlineAttempts.length > 0 && attemptGrade != null && gradeMethod != null) {
    const allAttempts = (onlineAttempts && onlineAttempts.length > 0) ? onlineAttempts.concat(offlineAttempts)! : offlineAttempts!
    const caculatedGradeReport = getAttemptsGrade(allAttempts, attemptGrade, maxGrade);
    return (gradeMethod == Grade.objective) ? caculatedGradeReport.toString() : `${caculatedGradeReport}%`;
  } else {
    return onlineCalculatedGrade;
  }
};

const syncOfflineScormBundle = (scormId: number, data: any) => {

  return getScormPackageData(scormId).then(storedData => {
    if(storedData){
      let newData = storedData as ScormBundle;
      if (data.scorm) {
        newData.scorm = data.scorm;
      } 
      if (data.lastsynced) {
        newData.lastsynced = data.lastsynced;
      }
      if (data.scormPackage) { 
        newData.scormPackage = data.scormPackage;
      }
      return setScormPackageData(scormId, newData);
    } else {
      if (data && data.scorm && data.scormPackage && data.scormPackage.path) {
        return setScormPackageData(scormId, data);
      } else {
        return;
      }
    }
  });

}

const getOfflineScormCommits = () => {
  return getAllCommits().then(storedData => {
    let formattedUnsyncedData = undefined;
    if (storedData) {
      formattedUnsyncedData = [];
      for(let commitScormId in storedData ) {
        const scormCommits = storedData[commitScormId];
        const orededAttemptKeys = Object.keys(scormCommits).sort();
        for(let index = 0; index < orededAttemptKeys.length; index++) {
          const commitAttempt = orededAttemptKeys[index];
          if (scormCommits[commitAttempt]) {
            const commitTracks = values(scormCommits[commitAttempt]).filter(value => value);
            const commit = {scormId: parseInt(commitScormId), attempt: parseInt(commitAttempt), tracks: commitTracks};
            formattedUnsyncedData.push(commit);
          }
        }
      }
    } 
    return formattedUnsyncedData;
  });
}

const clearSyncedScormCommit = (scormId: number, attempt: number) => {
  return clearCommit(scormId, attempt);
} 
export { getOfflineScormBundle, calculatedAttemptsGrade, syncOfflineScormBundle, getOfflineScormCommits, clearSyncedScormCommit, getGradeForAttempt, getAttemptsGrade };