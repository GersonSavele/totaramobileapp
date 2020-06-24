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

import moment from "moment";
import {
  AttemptGrade,
  Grade,
  ScormBundle,
  Scorm,
  ScormActivityResult,
  GradeForAttemptProps
} from "@totara/types/Scorm";
import { translate } from "@totara/locale";
import {
  SECONDS_FORMAT,
  scormSummarySection,
  scormActivityType,
  FILE_EXTENSION,
  scormLessonStatus
} from "@totara/lib/constants";
import { Log } from "@totara/lib";
import { showMessage } from "@totara/lib/tools";
import { scormActivitiesRecordsQuery } from "@totara/activities/scorm/api";
import { setWith, get, values, remove, omit, isEmpty } from "lodash";
import {
  OFFLINE_SCORM_PREFIX,
  offlineScormServerRoot,
  scormZipPackagePath
} from "@totara/lib/constants";

const getOfflineScormPackageName = (scormId: string) =>
  `${OFFLINE_SCORM_PREFIX}${scormId}`;

const getOfflinePackageUnzipPath = (scormId: string) =>
  `${offlineScormServerRoot}/${getOfflineScormPackageName(scormId)}`;

const getTargetZipFile = (scormId: string) =>
  `${scormZipPackagePath}/${getOfflineScormPackageName(
    scormId
  )}${FILE_EXTENSION}`;

/**
 * this formats the attempts of the SCORM bundle
 * This is a temporary hack because the server is not returning correct data
 * @param {Object} data - scorm data from the Backend
 */
const formatAttempts = (data: any): Scorm => {
  let scormData = { ...data };
  if (scormData) {
    if (scormData.attempts && scormData.attempts.length > 0) {
      let scormAttempts = scormData.attempts;
      const defaultCMI = scormData.attempts[scormData.attempts.length - 1];
      if (!defaultCMI.timestarted) {
        // remove the last scorm attempt from the original scorm data(from the backend)
        scormAttempts = scormAttempts.slice(0, -1);
      }
      scormData = {
        ...scormData,
        attempts: scormAttempts,
        defaultCMI: defaultCMI
      };
    }
  }
  return scormData;
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

const getDataForScormSummary = (
  isUserOnline: boolean,
  scormBundle?: ScormBundle
): any => {
  let data: any = {
    name: undefined,
    description: undefined,
    totalAttempt: 0,
    gradeMethod: undefined,
    attemptGrade: undefined,
    calculatedGrade: undefined,
    actionPrimary: false,
    actionSecondary: false,
    lastsynced: undefined,
    timeOpen: undefined,
    maxAttempts: undefined,
    attempts: undefined,
    completionScoreRequired: undefined
  };
  if (!scormBundle) {
    return data;
  }
  const { scorm, scormPackage } = scormBundle;
  if (!scorm) {
    return data;
  }
  data.name = scorm.name;
  data.description =
    scorm.description && scorm.description !== null
      ? scorm.description
      : undefined;
  data.totalAttempt = scorm.attemptsCurrent ? scorm.attemptsCurrent : 0;
  if (scormBundle!.offlineActivity && scormBundle!.offlineActivity.attempts) {
    data.totalAttempt =
      data.totalAttempt + scormBundle!.offlineActivity.attempts.length;
  }

  data.attemptGrade = scorm.whatgrade as AttemptGrade;
  data.gradeMethod = scorm.grademethod as Grade;
  const offlineAttempts =
    scormBundle!.offlineActivity && scormBundle!.offlineActivity.attempts
      ? scormBundle!.offlineActivity.attempts
      : undefined;

  data.calculatedGrade = calculatedAttemptsGrade(
    data.attemptGrade,
    data.gradeMethod,
    scorm.maxgrade,
    scorm.calculatedGrade,
    scorm.attempts,
    offlineAttempts
  );
  data.timeOpen =
    (scormBundle &&
      scorm &&
      scorm.timeopen &&
      scorm.timeopen > parseInt(moment().format(SECONDS_FORMAT)) &&
      moment.unix(scorm.timeopen)) ||
    undefined;
  data.maxAttempts =
    (scorm.attemptsMax !== null && scorm.attemptsMax) || undefined;

  data.completionScoreRequired =
    (scorm.completionscorerequired !== null && scorm.completionscorerequired) ||
    undefined;
  data.actionPrimary =
    (scormBundle &&
      scorm &&
      (!data.maxAttempts || data.maxAttempts > data.totalAttempt) &&
      (scorm.launchUrl ||
        (scormPackage && scormPackage.path && scorm.offlineAttemptsAllowed)) &&
      true) ||
    false;
  data.actionSecondary =
    (isUserOnline && scormBundle && scorm && scorm.repeatUrl && true) || false;

  data.lastsynced =
    (!isUserOnline &&
      scormBundle &&
      scormBundle.lastsynced &&
      moment.unix(scormBundle.lastsynced)) ||
    undefined;

  data.attempts =
    (scorm.attempts &&
      scormBundle.offlineActivity &&
      scormBundle.offlineActivity.attempts &&
      scorm.attempts.concat(scormBundle.offlineActivity.attempts)) ||
    scorm.attempts ||
    (scormBundle.offlineActivity && scormBundle.offlineActivity.attempts);
  return data;
};

type OnTapProps = {
  scormBundle: ScormBundle | undefined;
  client: any;
  apiKey?: string;
};

type OnTapAttemptProps = {
  callback: (action: scormActivityType, bundle: ScormBundle, data: any) => void;
  scormBundle: ScormBundle | undefined;
  isUserOnline: boolean;
};

const onTapNewAttempt = ({
  scormBundle,
  isUserOnline,
  callback
}: OnTapAttemptProps) => () => {
  if (scormBundle && scormBundle.scorm) {
    const currentAttempt = scormBundle.scorm.attemptsCurrent
      ? scormBundle.scorm.attemptsCurrent
      : 0;
    if (!isUserOnline) {
      let newAttempt = currentAttempt;
      if (scormBundle.offlineActivity && scormBundle.offlineActivity.attempts) {
        newAttempt = newAttempt + scormBundle.offlineActivity.attempts.length;
      }
      newAttempt = newAttempt + 1;
      // this is setting the state of the parent component with those 3 parameters
      callback(scormActivityType.offline, scormBundle, {
        attempt: newAttempt
      });
    } else {
      if (scormBundle.scorm && scormBundle.scorm.launchUrl) {
        // this is setting the state of the parent component with those 3 parameters
        callback(scormActivityType.online, scormBundle, {
          url: scormBundle.scorm.launchUrl,
          attempt: currentAttempt + 1
        });
      } else {
        Log.warn("Cannot find new attempt url.", scormBundle.scorm.launchUrl);
        showMessage({ text: translate("general.error_unknown") });
      }
    }
  } else {
    Log.warn("Cannot find scorm data.", scormBundle);
    showMessage({ text: translate("general.error_unknown") });
  }
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

type OnTapViewAttemptsProps = {
  callback: React.Dispatch<React.SetStateAction<scormSummarySection>>;
  scormBundle: ScormBundle | undefined;
};
const onTapViewAllAttempts = ({
  scormBundle,
  callback
}: OnTapViewAttemptsProps) => () => {
  if (
    scormBundle &&
    scormBundle.scorm &&
    (scormBundle.scorm.attempts ||
      (scormBundle.offlineActivity && scormBundle.offlineActivity.attempts))
  ) {
    callback(scormSummarySection.attempts);
  } else {
    Log.warn("Cannot find scorm data", scormBundle);
    showMessage({ text: translate("general.error_unknown") });
  }
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
      `[${scormId}].offlineActivity.attempts`,
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
      `[${scormId}].offlineActivity.attempts`,
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

const setCompletedScormAttempt = (
  scormId: string,
  attempt: number,
  client: any
) => {
  const scormBundles = retrieveAllData({ client });
  let newData = { ...scormBundles };

  const newCommitsData = get(newData, `[${scormId}].completed_attempts`, []);
  if (!newCommitsData.some((x) => x === attempt)) {
    newCommitsData.push(attempt);
    setWith(newData, `completed_attempts.[${scormId}]`, newCommitsData, Object);
    saveInTheCache({
      client,
      scormBundles: newData
    });
  }
};

const getOfflineLastActivityResult = (scormId: string, client: any) => {
  const scormBundles = retrieveAllData({ client });
  const scormOfflineActivityReport = get(
    scormBundles,
    `[${scormId}].offlineActivity.attempts`,
    undefined
  );
  if (scormOfflineActivityReport && scormOfflineActivityReport.length > 0) {
    return scormOfflineActivityReport[scormOfflineActivityReport.length - 1];
  }
  return undefined;
};

/**
 * This is to allow the user to make decision to show the buttons
 * @param param0
 */
const shouldAllowAttempt = ({
  timeOpen,
  maxAttempts,
  totalAttempt,
  actionPrimary,
  actionSecondary
}) =>
  !timeOpen &&
  (!maxAttempts || maxAttempts >= totalAttempt) &&
  (actionPrimary || actionSecondary);

const getOfflineActivity = ({ client, id }: { client: any; id: string }) => {
  const cachedData = retrieveAllData({ client });

  const offlineAttempts = get(cachedData, `[${id}].offlineActivity`, undefined);
  if (offlineAttempts && Object.keys(offlineAttempts).length) {
    return offlineAttempts;
  }
  return undefined;
};

const getOfflineScormCommits = ({ client }: { client: any }) => {
  const allOfflineData = retrieveAllData({ client });
  const completedScormAttempts = get(
    allOfflineData,
    `completed_attempts`,
    undefined
  );
  let formattedUnsyncedData = undefined;
  if (completedScormAttempts) {
    formattedUnsyncedData = [];
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
  }
  return formattedUnsyncedData;
};

const clearSyncedScormCommit = ({
  client,
  scormId,
  attempt
}: {
  client: any;
  scormId: string;
  attempt: number;
}) => {
  let allOfflineData = retrieveAllData({ client });

  if (allOfflineData && !isEmpty(allOfflineData)) {
    const completedScormAttempts = get(
      allOfflineData,
      `completed_attempts.[${scormId}]`,
      undefined
    );
    if (completedScormAttempts) {
      remove(completedScormAttempts, (num) => num === attempt);
      if (completedScormAttempts) {
        omit(allOfflineData, [`completed_attempts.[${scormId}]`]);
      } else {
        setWith(
          allOfflineData,
          `completed_attempts.[${scormId}]`,
          completedScormAttempts,
          Object
        );
      }
    }
    omit(allOfflineData, [
      `[${scormId}].commits[${attempt}]`,
      `[${scormId}].cmi[${attempt}]`
    ]);
    const existingOfflineActivityData = get(
      allOfflineData,
      `[${scormId}].offlineActivity.attempts`,
      []
    );
    // record.attempt is string and attempt is number, so avoid checking type
    remove(existingOfflineActivityData, (record) => record.attempt == attempt);
    setWith(
      allOfflineData,
      `[${scormId}].offlineActivity.attempts`,
      existingOfflineActivityData,
      Object
    );
    saveInTheCache({
      client,
      scormBundles: existingOfflineActivityData
    });
  }
  return true;
};

type CacheProps = {
  client: any;
  scormBundles?: { [key: string]: ScormBundle };
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

const getGradeForAttempt = ({
  attemptCmi,
  maxGrade,
  gradeMethod
}: GradeForAttemptProps) => {
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
    [Grade.sum]: Math.round(sumGrade * (100 / maxGrade))
  });
  return getGrades()[gradeMethod];
};
export {
  formatAttempts,
  getDataForScormSummary,
  onTapNewAttempt,
  onTapContinueLastAttempt,
  onTapViewAllAttempts,
  retrieveAllData,
  saveScormActivityData,
  getOfflineLastActivityResult,
  getOfflinePackageUnzipPath,
  getTargetZipFile,
  shouldAllowAttempt,
  getOfflineScormPackageName,
  setCompletedScormAttempt,
  getOfflineActivity,
  getOfflineScormCommits,
  clearSyncedScormCommit,
  calculatedAttemptsGrade,
  getAttemptsGrade,
  getGradeForAttempt
};
