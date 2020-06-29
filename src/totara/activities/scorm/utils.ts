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
import { get } from "lodash";

import {
  AttemptGrade,
  Grade,
  Attempt,
  ScormBundle,
  Scorm,
  GradeForAttemptProps,
  ScormPlayerProps,
  Sco
} from "@totara/types/Scorm";
import moment from "moment";
import {
  OFFLINE_SCORM_PREFIX,
  offlineScormServerRoot,
  scormZipPackagePath,
  scormLessonStatus,
  FILE_EXTENSION,
  SECONDS_FORMAT
} from "@totara/lib/constants";

type GetPlayerInitialDataProps = {
  scormId: string;
  scos: [Sco];
  scoId: string;
  attempt: number;
  packageLocation: string;
  playerInitalData: any;
};

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
  if (scormBundle!.offlineAttempts && scormBundle!.offlineAttempts) {
    data.totalAttempt = data.totalAttempt + scormBundle!.offlineAttempts.length;
  }

  data.attemptGrade = scorm.whatgrade as AttemptGrade;
  data.gradeMethod = scorm.grademethod as Grade;
  const offlineAttempts =
    scormBundle!.offlineAttempts && scormBundle!.offlineAttempts
      ? scormBundle!.offlineAttempts
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
      scormBundle.offlineAttempts &&
      scormBundle.offlineAttempts &&
      scorm.attempts.concat(scormBundle.offlineAttempts)) ||
    scorm.attempts ||
    (scormBundle.offlineAttempts && scormBundle.offlineAttempts);
  return data;
};

const calculatedAttemptsGrade = (
  attemptGrade: AttemptGrade,
  gradeMethod: Grade,
  maxGrade: number,
  onlineCalculatedGrade?: string,
  onlineAttempts: Attempt[] = [],
  offlineAttempts: Attempt[] = []
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
  attemptsReport: Attempt[],
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

const getScormPlayerInitialData = ({
  scormId,
  scos,
  scoId,
  attempt,
  packageLocation,
  playerInitalData
}: GetPlayerInitialDataProps) => {
  const { defaults, interactions, objectives } = playerInitalData;
  const selectedSCO: Sco | undefined = scos.find((sco) => sco.id === scoId);

  const _entrysrc = `${packageLocation}/${selectedSCO!.launchSrc}`;
  const _scormdebugging = false;
  const _scormauto = 0;
  const _scormid = scormId;
  const _scoid = selectedSCO!.id;
  const _autocommit = false;
  const _masteryoverride = true;
  const _hidetoc = 1;

  return {
    entrysrc: _entrysrc,
    def: { ...defaults },
    obj: { ...objectives },
    int: { ...interactions },
    scormdebugging: _scormdebugging,
    scormauto: _scormauto,
    scormid: _scormid,
    scoid: _scoid,
    attempt: attempt,
    autocommit: _autocommit,
    masteryoverride: _masteryoverride,
    hidetoc: _hidetoc
  } as ScormPlayerProps;
};

const scormDataIntoJsInitCode = (scormData: any, cmi: any) => {
  const _entrysrc = "'" + scormData.entrysrc + "'";
  const _def = "'" + JSON.stringify(scormData.def) + "'";
  const _cmiobj = "'" + JSON.stringify(scormData.obj) + "'";
  const _cmiint = "'" + JSON.stringify(scormData.int) + "'";
  const _scormdebugging = "'" + scormData.scormdebugging + "'";
  const _scormauto = "'" + scormData.scormauto + "'";
  const _scormid = "'" + scormData.scormid + "'";
  const _scoid = "'" + scormData.scoid + "'";
  const _attempt = "'" + scormData.attempt + "'";
  const _autocommit = scormData.autocommit;
  const _masteryoverride = scormData.masteryoverride;
  const _hidetoc = "'" + scormData.hidetoc + "'";

  return (
    "{onInjectScormData(" +
    _entrysrc +
    ", " +
    _def +
    ", " +
    _cmiobj +
    ", " +
    _cmiint +
    ", " +
    _scormdebugging +
    ", " +
    _scormauto +
    ", " +
    _scormid +
    ", " +
    _scoid +
    ", " +
    _attempt +
    ", " +
    _autocommit +
    ", " +
    _masteryoverride +
    ", " +
    _hidetoc +
    ", " +
    "'" +
    JSON.stringify(cmi) +
    "'" +
    ")}"
  );
};

export {
  getOfflinePackageUnzipPath,
  getTargetZipFile,
  getOfflineScormPackageName,
  formatAttempts,
  getDataForScormSummary,
  calculatedAttemptsGrade,
  getAttemptsGrade,
  getGradeForAttempt,
  shouldAllowAttempt,
  getScormPlayerInitialData,
  scormDataIntoJsInitCode
};
