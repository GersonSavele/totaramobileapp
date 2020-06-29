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
 */

import { Grade, ScormBundle, GradeForAttemptProps } from "@totara/types/Scorm";
import { scormLessonStatus } from "@totara/lib/constants";
import { Log } from "@totara/lib";
import { scormActivitiesRecordsQuery } from "@totara/activities/scorm/api";
import { setWith, get, values, remove, omit, isEmpty } from "lodash";

import { getGradeForAttempt } from "./utils";

type CacheProps = {
  client: any;
  scormBundles?: { [key: string]: ScormBundle };
};

type CompletedScormAttemptProps = {
  scormId: string;
  attempt: number;
  client: any;
  onRetrieveAllData?: (data: CacheProps) => {};
  onSaveInTheCache?: (data: CacheProps) => void;
};
type SaveScormActivityProps = {
  data: any;
  client: any;
  maxGrade: number;
  gradeMethod: Grade;
  onGetGradeForAttempt?: (data: GradeForAttemptProps) => number;
  onRetrieveAllData?: (data: CacheProps) => {};
  onSaveInTheCache?: (data: CacheProps) => void;
};
/**
 *
 * @param param0 - Object with the scorm id to fetch the cached activity records
 * @returns an object: the specific scorm cached data
 */
const retrieveAllData = ({ client }): { [key: string]: ScormBundle } => {
  try {
    const { scormBundles } = client.readQuery({
      query: scormActivitiesRecordsQuery
    });
    return scormBundles;
  } catch (e) {
    Log.debug("empty cache for ActivitiesRecords");
  }
  return {};
};
/**
 * This saves the map of scorm bundle with the new scormBunble in the cache
 * @param param0
 */
const saveInTheCache = ({ client, scormBundles }: CacheProps) => {
  try {
    client.writeQuery({
      query: scormActivitiesRecordsQuery,
      data: {
        scormBundles
      }
    });
  } catch (e) {
    console.warn("Scorm cache data saving error: ", e);
  }
};
/* 
// TODO - removed after Last attempt implementation 
type OnTapAttemptProps = {
  callback: (action: number, bundle: ScormBundle, data: any) => void;
  scormBundle: ScormBundle | undefined;
  isUserOnline: boolean;
};

const onTapContinueLastAttempt = ({
  scormBundle,
  isUserOnline,
  callback
}: OnTapAttemptProps) => () => {
  if (isUserOnline) {
    if (scormBundle) {
      if (scormBundle.scorm && scormBundle.scorm.repeatUrl) {
        const currentAttempt = scormBundle.scorm.attemptsCurrent
          ? scormBundle.scorm.attemptsCurrent
          : 0;
        callback(scormActivityType.online, scormBundle, {
          url: scormBundle.scorm.repeatUrl,
          attempt: currentAttempt
        });
      } else {
        Log.warn("Cannot find last attempt url.", scormBundle.scorm.repeatUrl);
        showMessage({ text: translate("general.error_unknown") });
      }
    } else {
      Log.warn("Cannot find scorm data.", scormBundle);
      showMessage({ text: translate("general.error_unknown") });
    }
  }
};
*/
const saveScormActivityData = ({
  data,
  client,
  maxGrade,
  gradeMethod,
  onGetGradeForAttempt = getGradeForAttempt,
  onRetrieveAllData = retrieveAllData,
  onSaveInTheCache = saveInTheCache
}: SaveScormActivityProps) => {
  const scormId = data.scormid;
  const attempt = data.attempt;
  const scoId = data.scoid;
  const cmiData = data.cmi;
  const commitData = data.commit;

  const status = get(data.cmi, "core.lesson_status", undefined);
  if (status && status !== scormLessonStatus.incomplete) {
    const scormBundles = onRetrieveAllData({ client });
    let newData = { ...scormBundles };

    setWith(newData, `[${scormId}].cmi[${attempt}][${scoId}]`, cmiData, Object);

    const reportCmiList = get(newData, `[${scormId}].cmi`);
    const attemptGrade = onGetGradeForAttempt({
      attemptCmi: reportCmiList,
      maxGrade,
      gradeMethod
    });
    const newAttemptGrade = { gradereported: attemptGrade, attempt: attempt };

    const existingOfflineActivityData = get(
      newData,
      `[${scormId}].offlineAttempts`,
      []
    );
    if (existingOfflineActivityData && existingOfflineActivityData.length > 0) {
      if (
        existingOfflineActivityData[existingOfflineActivityData.length - 1]
          .attempt === newAttemptGrade.attempt
      ) {
        existingOfflineActivityData.pop();
      }
    }
    setWith(
      newData,
      `[${scormId}].offlineAttempts`,
      existingOfflineActivityData.concat([newAttemptGrade]),
      Object
    );

    setWith(
      newData,
      `[${scormId}].commits[${attempt}][${scoId}]`,
      commitData,
      Object
    );
    onSaveInTheCache({
      client,
      scormBundles: newData
    });
  }
};

const setCompletedScormAttempt = ({
  scormId,
  attempt,
  client,
  onRetrieveAllData = retrieveAllData,
  onSaveInTheCache = saveInTheCache
}: CompletedScormAttemptProps) => {
  const scormBundles = onRetrieveAllData({ client });
  let newData = { ...scormBundles };

  const newCommitsData = get(newData, `completed_attempts.[${scormId}]`, []);
  if (!newCommitsData.some((x) => x === attempt)) {
    newCommitsData.push(attempt);
    setWith(newData, `completed_attempts.[${scormId}]`, newCommitsData, Object);
    onSaveInTheCache({
      client,
      scormBundles: newData
    });
  }
};

const getOfflineLastActivityResult = ({
  scormId,
  client,
  onRetrieveAllData = retrieveAllData
}: CompletedScormAttemptProps) => {
  const scormBundles = onRetrieveAllData({ client });
  const scormOfflineActivityReport = get(
    scormBundles,
    `[${scormId}].offlineAttempts`,
    undefined
  );
  if (scormOfflineActivityReport && scormOfflineActivityReport.length > 0) {
    return scormOfflineActivityReport[scormOfflineActivityReport.length - 1];
  }
};

const getOfflineActivity = ({
  client,
  scormId,
  onRetrieveAllData = retrieveAllData
}: CompletedScormAttemptProps) => {
  const cachedData = onRetrieveAllData({ client });

  const offlineAttempts = get(
    cachedData,
    `[${scormId}].offlineAttempts`,
    undefined
  );
  if (offlineAttempts && Object.keys(offlineAttempts).length) {
    return offlineAttempts;
  }
};

const getOfflineScormCommits = ({
  client,
  onRetrieveAllData = retrieveAllData
}: CompletedScormAttemptProps) => {
  const allOfflineData = onRetrieveAllData({ client });
  const completedScormAttempts = get(
    allOfflineData,
    `completed_attempts`,
    undefined
  );

  const formattedUnsyncedData: [any?] = [];
  if (completedScormAttempts) {
    const scormIs = Object.keys(completedScormAttempts);
    for (let keyIndex = 0; keyIndex < scormIs.length; keyIndex++) {
      const scormId = scormIs[keyIndex];
      const completedAttempts = completedScormAttempts[scormId];
      for (
        let indexAttempt = 0;
        indexAttempt < completedAttempts.length;
        indexAttempt++
      ) {
        const attempt = completedAttempts[indexAttempt];

        const commitScormAttempt = get(
          allOfflineData,
          `${[scormId]}.commits[${[attempt]}]`,
          undefined
        );
        if (commitScormAttempt) {
          const commitTracks = values(commitScormAttempt).filter(
            (value) => value
          );
          const commit = {
            scormId: scormId,
            attempt: parseInt(attempt),
            tracks: commitTracks
          };
          formattedUnsyncedData.push(commit);
        }
      }
    }
    if (formattedUnsyncedData.length > 0) {
      return formattedUnsyncedData;
    }
  }
  return;
};

const clearSyncedScormCommit = ({
  client,
  scormId,
  attempt,
  onRetrieveAllData = retrieveAllData,
  onSaveInTheCache = saveInTheCache
}: CompletedScormAttemptProps) => {
  let allOfflineData = onRetrieveAllData({ client });

  if (allOfflineData && !isEmpty(allOfflineData)) {
    const completedScormAttempts = get(
      allOfflineData,
      `completed_attempts.[${scormId}]`,
      undefined
    );
    if (completedScormAttempts) {
      remove(completedScormAttempts, (num) => num == attempt);
      if (!completedScormAttempts) {
        allOfflineData = omit(allOfflineData, [
          `completed_attempts.[${scormId}]`
        ]);
      } else {
        setWith(
          allOfflineData,
          `completed_attempts.[${scormId}]`,
          completedScormAttempts,
          Object
        );
      }
    }
    allOfflineData = omit(allOfflineData, [
      `[${scormId}].commits[${attempt}]`,
      `[${scormId}].cmi[${attempt}]`
    ]);
    const existingOfflineActivityData = get(
      allOfflineData,
      `[${scormId}].offlineAttempts`,
      []
    );
    // record.attempt is string and attempt is number, so avoid checking type
    remove(existingOfflineActivityData, (record) => record.attempt == attempt);
    setWith(
      allOfflineData,
      `[${scormId}].offlineAttempts`,
      existingOfflineActivityData,
      Object
    );
    onSaveInTheCache({
      client,
      scormBundles: allOfflineData
    });
  }
  return true;
};

const getScormAttemptData = ({
  client,
  scormId,
  attempt,
  onRetrieveAllData = retrieveAllData
}: CompletedScormAttemptProps) => {
  const cachedData = onRetrieveAllData({ client });

  const attemptCmi = get(cachedData, `[${scormId}].cmi[${attempt}]`, undefined);
  if (attemptCmi && Object.keys(attemptCmi).length) {
    return attemptCmi;
  }
};

export {
  retrieveAllData,
  saveInTheCache,
  saveScormActivityData,
  setCompletedScormAttempt,
  getOfflineLastActivityResult,
  getOfflineActivity,
  getOfflineScormCommits,
  clearSyncedScormCommit,
  getScormAttemptData
};
