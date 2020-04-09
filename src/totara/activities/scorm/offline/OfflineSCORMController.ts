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

const getGradeForAttempt = (attemptcmi: any, grademethod?: number) => {
  if(grademethod) {
    let sumGrade = 0;
    let highestGrade = 0;
    
    for (let [, cmi] of Object.entries(attemptcmi)) {
      const rowScore = parseInt(cmi.core.score.raw) ? parseInt(cmi.core.score.raw) : 0;
      sumGrade = sumGrade + rowScore
      if(highestGrade < rowScore) {
        highestGrade = rowScore
      }
    }

    switch(grademethod) {
      case Grade.objective: 
        return 0;
      case Grade.average: {
        if(attemptcmi && attemptcmi.length) {
          return (sumGrade / attemptcmi.length);
        }
        return 0;
      }
      case Grade.highest: 
        return highestGrade;
      case Grade.sum:
        return sumGrade; 
    }
  } else {
    return 0;
  }
};

const getAttemptsGrade = (attemptsreport: [any], whatgrade?: number) => {
  if( attemptsreport && attemptsreport.length > 0) {
    switch(whatgrade) {
      case AttemptGrade.highest: {
        const highestAttempt = attemptsreport.reduce((highest: any, attemptResult: any) => { 
          if (highest && (highest.scoreRaw >= attemptResult.scoreRaw)) {
              return highest;
          } 
          return attemptResult;
        }, undefined);
        return highestAttempt;
      }
      case AttemptGrade.average: {
        const sumofscores = attemptsreport.reduce((scores: number, attemptResult: any) => (scores + attemptResult.scoreRaw), 0);
        return {scoreRaw: (sumofscores / attemptsreport.length)};
      }
      case AttemptGrade.first: 
        return attemptsreport[0];
      case AttemptGrade.last:
        return attemptsreport[attemptsreport.length - 1]; 
      default:
        return {scoreRaw: 0};
    }
  } 
};

const getOfflineAttemptsReport = (cmiList:any, maxgrade: number, grademethod?: number, completionscorerequired: number) => {
  let scoresData = [];
  for (let [attempt, scosData] of Object.entries(cmiList)) {
    const attemptScore = getGradeForAttempt(scosData, grademethod);
    let lessonStatus = "completed";
    if(completionscorerequired <= attemptScore) {
        lessonStatus = "passed";
    } else if(attemptScore < completionscorerequired) {
        lessonStatus = "failed";
    }
    scoresData.push({ attempt: parseInt(attempt), scoreRaw: attemptScore, scoreMax: maxgrade, lessonStatus: lessonStatus});
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
          const offlineReport = getOfflineAttemptsReport(cmis, formattedData.scorm.maxgrade, formattedData.scorm.grademethod, formattedData.scorm.completionscorerequired);
          formattedData = {...formattedData, ...{offlineActivity: {attempts: offlineReport}}};
        }
      }
      return formattedData;
    });
 };

const calculatedAttemptsGrade = (maxgrade: number, whatgrade: number, onlineCalculatedGrade?: string, onlineAttempts?:[ScormActivityResult], offlineAttempts?: [ScormActivityResult]) => {
  if(offlineAttempts && offlineAttempts.length > 0) {
    let allAttempts = offlineAttempts;
    if (onlineAttempts && onlineAttempts.length > 0) {
      allAttempts = onlineAttempts.concat(offlineAttempts);
    }
    const caculatedGradeReport = getAttemptsGrade(allAttempts, whatgrade);
    if(maxgrade === 0) {
      return `${Math.round(caculatedGradeReport.scoreRaw)}`;
    } else {
      const calValue = ((caculatedGradeReport.scoreRaw / maxgrade) * 100);
      return `${Math.round(calValue)}%`;
    }    
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