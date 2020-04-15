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

import { Grade, AttemptGrade, ScormActivityResult, ScormBundle } from "@totara/types/Scorm";
import { RetrieveStorageDataById } from "@totara/core/ResourceManager/StorageManager";
import { removeSCORMPackageData, getSCORMData, setSCORMPackageData, getSCORMPackageData, getAllCommits, clearCommit } from "./StorageHelper";

const getGradeForAttempt = (attemptcmi: any, maxgrade: number, grademethod: Grade) => {
  let sumGrade = 0;
  let highestGrade = 0;
  let completedScos = 0;
  let average = 0;
  if (Object.keys(attemptcmi) && Object.keys(attemptcmi).length > 0) {
    const numberOfScors = Object.keys(attemptcmi).length;
    for (let [, cmi] of Object.entries(attemptcmi)) {
      let rowScore = 0;
      if (cmi.core && cmi.core.score && cmi.core.score.raw) {
        rowScore = parseInt(cmi.core.score.raw)
      } else if (cmi.score && cmi.score.raw) {
        rowScore = parseInt(cmi.core.score.raw)
      }
      const lessonStatus = cmi.core.lesson_status.toLowerCase();
      if (lessonStatus == "passed" || lessonStatus == "completed") {
        completedScos = completedScos + 1;
      }
      sumGrade = sumGrade + rowScore
      if (highestGrade < rowScore) {
        highestGrade = rowScore
      }
    }
    average = Math.round((sumGrade / numberOfScors));
  }
  
  
  switch (grademethod) {
    case Grade.objective: 
      return completedScos;
    case Grade.average: 
      return (average / maxgrade) * 100;
    case Grade.highest: 
      return (highestGrade / maxgrade) * 100;
    case Grade.sum:
      return (sumGrade / maxgrade) * 100; 
  }
};

const getAttemptsGrade = (attemptsreport: [any], whatgrade: AttemptGrade) => {
  switch(whatgrade) {
    case AttemptGrade.highest: {
      const highestAttempt = attemptsreport.reduce((highest: any, attemptResult: any) => { 
        if (highest && (highest.gradereported >= attemptResult.gradereported)) {
            return highest.gradereported;
        } 
        return attemptResult;
      }, undefined);
      return highestAttempt;
    }
    case AttemptGrade.average: {
      const sumofscores = attemptsreport.reduce((scores: number, attemptResult: any) => (scores + attemptResult.gradereported), 0);
      return Math.round(sumofscores / attemptsreport.length);
    }
    case AttemptGrade.first: 
      return attemptsreport[0].gradereported;
    case AttemptGrade.last:
      return attemptsreport[attemptsreport.length - 1].gradereported; 
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

const getOfflineSCORMBundle = (scormId: number) => {
   return RetrieveStorageDataById(scormId.toString()).then(storedResourceData => { 
      if (!storedResourceData || storedResourceData === undefined || storedResourceData === null) {
          return removeSCORMPackageData(scormId);
      } else {
          return Promise.resolve()
      }
    }).then(() => {
      return getSCORMData(scormId);
    }).then(({bundle, cmis}) => {
      let formattedData = bundle;
      if (formattedData && formattedData && formattedData.scorm) {
        if(cmis) {
          const gradeMethod = parseInt(formattedData.scorm.grademethod) as Grade;
          const maxGrade = formattedData.scorm.maxgrade
          if (gradeMethod != null && maxGrade != null) {
            const offlineReport = getOfflineAttemptsReport(cmis, maxGrade, gradeMethod);
            formattedData = {...formattedData, ...{offlineActivity: {attempts: offlineReport}}};
          }
        }
      }
      return formattedData;
    });
 };

const calculatedAttemptsGrade = (maxgrade: number, whatgrade: AttemptGrade, grademethod: Grade, onlineCalculatedGrade?: number, onlineAttempts?:[ScormActivityResult], offlineAttempts?: [ScormActivityResult]) => {
  if (offlineAttempts && offlineAttempts.length > 0 && whatgrade != null && grademethod != null) {
    let allAttempts = offlineAttempts;
    if (onlineAttempts && onlineAttempts.length > 0) {
      allAttempts = onlineAttempts.concat(offlineAttempts);
    }

    const caculatedGradeReport = getAttemptsGrade(allAttempts, whatgrade);
    return (grademethod == Grade.objective) ? caculatedGradeReport.toString() : `${caculatedGradeReport}%`;
  } else {
    return onlineCalculatedGrade;
  }
};

const syncOfflineSCORMBundel = (scormId: number, data: any) => {

  return getSCORMPackageData(scormId).then(storedData => {
    if(storedData){
      let newData = storedData as ScormBundle;
      if (data.scorm) {
        newData.scorm = data.scorm;
      } 
      if (data.lastsynced) {
        newData.lastsynced = data.lastsynced;
      }
      if (data.package) { 
        newData.package = data.package;
      }
      return setSCORMPackageData(scormId, newData);
    } else {
      if (data && data.scorm && data.package && data.package.path) {
        return setSCORMPackageData(scormId, data);
      } else {
        return;
      }
    }
  });

}

const getOfflineSCORMCommits = () => {
  return getAllCommits().then(storedData => {
    if (storedData) {
      let formattedUnsyncedData = [];
      for(let commitScormId in storedData ) {
        const scormCommits = storedData[commitScormId];
        const orededAttemptKeys = Object.keys(scormCommits).sort();
        for(let index = 0; index < orededAttemptKeys.length; index++) {
          const commitAttempt = orededAttemptKeys[index];
          if (scormCommits[commitAttempt]) {
            const commitTracks = getTracksForAllScos(scormCommits[commitAttempt]);
            const commit = {scormId: parseInt(commitScormId), attempt: parseInt(commitAttempt), tracks: commitTracks};
            formattedUnsyncedData.push(commit);
          }
        }
      }
      return formattedUnsyncedData;
    } else {
      return undefined;
    }
  });
}

const getTracksForAllScos = (scosCommits: any) => {
  let fullTracks = [];
  for (let scoId in scosCommits) {
    if(scosCommits[scoId] ) {
      fullTracks = fullTracks.concat(scosCommits[scoId]);
    }
  }
  return fullTracks;
}

const clearSyncedSCORMCommit = (scormId: number, attempt: number) => {
  return clearCommit(scormId, attempt);
} 
export { getOfflineSCORMBundle, calculatedAttemptsGrade, syncOfflineSCORMBundel, getOfflineSCORMCommits, clearSyncedSCORMCommit };