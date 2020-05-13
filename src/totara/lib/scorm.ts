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
import { AttemptGrade, Grade, ScormBundle, Scorm } from "@totara/types/Scorm";
import { translate } from "@totara/locale";
import {
  calculatedAttemptsGrade,
  getOfflineScormPackageName,
  getGradeForAttempt,
  syncOfflineScormBundle,
} from "@totara/activities/scorm/offline/offlineScormController";
import {
  DATE_FORMAT,
  DATE_FORMAT_FULL,
  SECONDS_FORMAT,
  scormSummarySection,
  scormActivityType,
} from "./constants";
import ResourceManager from "@totara/core/ResourceManager/ResourceManager";
import { Log } from "@totara/lib";
import { offlineScormServerRoot } from "@totara/activities/scorm/offline";
import { showMessage } from "./tools";
import { scormZipPackagePath } from "@totara/activities/scorm/offline/SCORMFileHandler";
import { RetrieveStorageDataById } from "@totara/core/ResourceManager/StorageManager";
import {
  removeScormPackageData,
  getScormData,
} from "@totara/activities/scorm/offline/StorageHelper";

/**
 * this formats the attempts of the SCORM bundle
 * @param data
 */
const formatAttempts = (data: any) => {
  let scormData = { ...data };
  if (scormData) {
    if (scormData.attempts && scormData.attempts.length > 0) {
      let scormAttempts = scormData.attempts;
      const defaultCMI = scormData.attempts[scormData.attempts.length - 1];
      if (!defaultCMI.timestarted) {
        scormAttempts = scormAttempts.slice(0, -1);
      }
      scormData = {
        ...scormData,
        attempts: scormAttempts,
        defaultCMI: defaultCMI,
      };
    }
  }
  return scormData;
};

/**
 *
 * @param id
 * @param isUserOnline
 * @returns {Scorm} scorm
 */
// Removed calling this one
const shouldScormSync = (id: string, isUserOnline: boolean) => (
  storedData: ScormBundle
) => {
  let scormBundleData = storedData as ScormBundle;
  if (isUserOnline) {
    scormBundleData.lastsynced = parseInt(moment().format(SECONDS_FORMAT));
    return syncOfflineScormBundle(id, {
      lastsynced: scormBundleData.lastsynced,
    }).then(() => {
      return scormBundleData;
    });
  }
  return scormBundleData;
};

/**
 *
 * @param {string} id - scorm id
 * @param {Object} data - scorm data
 */
const updateScormBundleWithOfflineAttempts = (
  scormId: string,
  scorm: Scorm,
  isUserOnline: boolean
) => {
  return RetrieveStorageDataById(scormId)
    .then((storedResourceData) => {
      if (
        !storedResourceData ||
        storedResourceData === undefined ||
        storedResourceData === null
      ) {
        return removeScormPackageData(scormId).then(() => undefined);
      } else {
        return Promise.resolve(storedResourceData.unzipPath);
      }
    })
    .then((packageName) => {
      return getScormData(scormId).then(
        ({ bundle, cmis }: { bundle?: any; cmis?: any }) => {
          let storedBundle = bundle;
          if (
            storedBundle &&
            !storedBundle.scormPackage &&
            packageName &&
            storedBundle.lastsynced
          ) {
            const resourcePackageName = getOfflineScormPackageName(scormId);
            const dataScormPackage = {
              scormPackage: { path: resourcePackageName },
            };
            return syncOfflineScormBundle(scormId, dataScormPackage).then(
              () => {
                return {
                  bundle: { ...storedBundle, ...dataScormPackage },
                  cmis: cmis,
                };
              }
            );
          } else {
            return { bundle: storedBundle, cmis: cmis };
          }
        }
      );
    })
    .then(({ bundle, cmis }) => {
      let formattedData = { scorm: scorm, ...bundle } as ScormBundle;
      if (formattedData && formattedData.scorm) {
        if (!formattedData.scormPackage) {
          const resourcePackageName = getOfflineScormPackageName(scormId);
          formattedData = {
            ...formattedData!,
            scormPackage: { path: resourcePackageName },
          } as ScormBundle;
        }
        if (scorm.grademethod && scorm.maxgrade) {
          if (cmis) {
            const gradeMethod = scorm.grademethod as Grade;
            const maxGrade = scorm.maxgrade;
            const offlineReport = getOfflineAttemptsReport(
              cmis,
              maxGrade,
              gradeMethod
            );
            formattedData = {
              ...formattedData,
              offlineActivity: { attempts: offlineReport },
            } as ScormBundle;
          }
        }
      }
      return formattedData;
    });
};

const getOfflineAttemptsReport = (
  cmiList: any,
  maxgrade: number,
  grademethod: Grade
) => {
  let scoresData = [];
  for (let [attempt, scosData] of Object.entries(cmiList)) {
    const attemptScore = getGradeForAttempt(scosData, maxgrade, grademethod);

    scoresData.push({
      attempt: parseInt(attempt),
      gradereported: attemptScore,
    });
  }
  return scoresData;
};

// old code for our reference:
/**
 *
 *  @param {boolean} isUserOnline - if network status is online
 */
// const formatScormData = (
//   id: string,
//   isUserOnline: boolean,
//   scormData?: any
// ) => {
//   if (scormData) {
//     let newScormData = { ...scormData };

//     return getOfflineScormBundle(id, newScormData).then(
//       shouldScormSync(id, isUserOnline)
//     );
//   }
//   return Promise.reject("invalid scorm data");
// };

const getDataForScormSummary = (
  isUserOnline: boolean,
  scormBundle?: ScormBundle
): any => {
  let data: any = {
    description: undefined,
    totalAttempt: 0,
    attemptGrade: undefined,
    calculatedGrade: undefined,
    actionPrimary: undefined,
    actionSecondary: undefined,
    shouldShowAction: false,
    lastsyncText: undefined,
    completedAttemptsText: undefined,
    upcommingActivityText: undefined,
    maxAttempts: undefined,
  };
  if (!scormBundle) {
    return data;
  }
  const { scorm, scormPackage } = scormBundle;
  if (!scorm) {
    return data;
  }
  data.description =
    scorm.description && scorm.description !== null
      ? scorm.description
      : undefined;
  data.totalAttempt = scorm.attemptsCurrent ? scorm.attemptsCurrent : 0;
  if (scormBundle!.offlineActivity && scormBundle!.offlineActivity.attempts) {
    data.totalAttempt =
      data.totalAttempt + scormBundle!.offlineActivity.attempts.length;
  }

  const attemptGrade = scorm.whatgrade as AttemptGrade;
  const gradeMethod = scorm.grademethod as Grade;
  const offlineAttempts =
    scormBundle!.offlineActivity && scormBundle!.offlineActivity.attempts
      ? scormBundle!.offlineActivity.attempts
      : undefined;

  data.attemptGrade = translate(`scorm.grading_method.${attemptGrade}`);
  data.calculatedGrade = calculatedAttemptsGrade(
    attemptGrade,
    gradeMethod,
    scorm.maxgrade,
    scorm.calculatedGrade,
    scorm.attempts,
    offlineAttempts
  );

  const isCompletedAttempts =
    scormBundle &&
    scorm &&
    scorm.attemptsMax &&
    data.totalAttempt >= scorm.attemptsMax;
  const isUpcomingActivity =
    scormBundle &&
    scorm &&
    scorm.timeopen &&
    scorm.timeopen > parseInt(moment().format(SECONDS_FORMAT));
  const hasStartNewAttempt =
    (isUserOnline && scormBundle && scorm && scorm.launchUrl) ||
    (!isUserOnline &&
      scorm.offlineAttemptsAllowed &&
      scormPackage &&
      scormPackage.path);
  const hasRepeatAttempt =
    isUserOnline && scormBundle && scorm && scorm.repeatUrl;
  data.actionPrimary = hasStartNewAttempt
    ? { title: translate("scorm.summary.new_attempt") }
    : undefined;
  data.actionSecondary = hasRepeatAttempt
    ? { title: translate("scorm.summary.last_attempt") }
    : undefined;

  data.shouldShowAction =
    !isUpcomingActivity &&
    !isCompletedAttempts &&
    (hasStartNewAttempt || hasRepeatAttempt) &&
    true;

  data.lastsyncText =
    (!isUserOnline &&
      scormBundle &&
      scormBundle.lastsynced &&
      `${translate("scorm.last_synced")}: ${moment
        .unix(scormBundle.lastsynced)
        .toNow(true)} ${translate("scorm.ago")} (${moment
        .unix(scormBundle.lastsynced)
        .format(DATE_FORMAT)})`) ||
    (!isUserOnline && translate("general.no_internet")) ||
    undefined;
  data.completedAttemptsText = isCompletedAttempts
    ? translate("scorm.info_completed_attempts")
    : undefined;
  data.upcommingActivityText =
    !isCompletedAttempts && isUpcomingActivity
      ? `${translate("scorm.info_upcoming_activity")} ${moment
          .unix(scorm.timeopen)
          .format(DATE_FORMAT_FULL)}`
      : undefined;

  data.maxAttempts =
    scorm.attemptsMax == null
      ? translate("scorm.summary.attempt.unlimited")
      : scorm.attemptsMax;

  return data;
};

type OnTapProps = {
  callback: (scormId: string, data: any) => Promise<void>;
  downloadManager: ResourceManager;
  scormBundle: ScormBundle | undefined;
  apiKey?: string;
};

const onTapDownloadResource = ({
  callback,
  downloadManager,
  scormBundle,
  apiKey,
}: OnTapProps) => () => {
  if (!downloadManager) return;
  if (scormBundle) {
    const _url = scormBundle!.scorm.packageUrl!;
    const _name = scormBundle!.scorm.name;
    const _scormId = scormBundle!.scorm.id;

    const offlineSCORMPackageName = getOfflineScormPackageName(_scormId);
    const _targetZipFile = `${scormZipPackagePath}/${offlineSCORMPackageName}.zip`;
    const _unzipPath = `${offlineScormServerRoot}/${offlineSCORMPackageName}`;
    const _downloadId = _scormId.toString();
    if (apiKey) {
      downloadManager.download(
        apiKey,
        _downloadId,
        _name,
        _url,
        _targetZipFile,
        _unzipPath
      );
      const _offlineScormData = {
        lastsynced: scormBundle.lastsynced,
      } as ScormBundle;

      callback(_scormId, _offlineScormData);
    } else {
      Log.debug("Cannot find api key");
    }
  }
};

type OnTapAttemptProps = {
  callback: (action: scormActivityType, bundle: ScormBundle, data: any) => void;
  scormBundle: ScormBundle | undefined;
  isUserOnline: boolean;
};

const onTapNewAttempt = ({
  scormBundle,
  isUserOnline,
  callback,
}: OnTapAttemptProps) => () => {
  if (scormBundle && scormBundle.scorm) {
    if (!isUserOnline) {
      let newAttempt =
        scormBundle.scorm && scormBundle.scorm.attemptsCurrent
          ? scormBundle.scorm.attemptsCurrent
          : 0;
      if (scormBundle.offlineActivity && scormBundle.offlineActivity.attempts) {
        newAttempt = newAttempt + scormBundle.offlineActivity.attempts.length;
      }
      newAttempt = newAttempt + 1;
      callback(scormActivityType.offline, scormBundle, {
        attempt: newAttempt,
      });
    } else {
      if (scormBundle.scorm && scormBundle.scorm.launchUrl) {
        callback(scormActivityType.online, scormBundle, {
          url: scormBundle.scorm.launchUrl,
        });
      } else {
        Log.warn("Cannot find new attempt url.", scormBundle.scorm.launchUrl);
        showMessage(translate("general.error_unknown"), () => null);
      }
    }
  } else {
    Log.warn("Cannot find scorm data.", scormBundle);
    showMessage(translate("general.error_unknown"), () => null);
  }
};

const onTapContinueLastAttempt = ({
  scormBundle,
  isUserOnline,
  callback,
}: OnTapAttemptProps) => () => {
  if (isUserOnline) {
    if (scormBundle) {
      if (scormBundle.scorm && scormBundle.scorm.repeatUrl) {
        callback(scormActivityType.online, scormBundle, {
          url: scormBundle.scorm.repeatUrl,
        });
      } else {
        Log.warn("Cannot find last attempt url.", scormBundle.scorm.repeatUrl);
        showMessage(translate("general.error_unknown"), () => null);
      }
    } else {
      Log.warn("Cannot find scorm data.", scormBundle);
      showMessage(translate("general.error_unknown"), () => null);
    }
  }
};

type OnTapViewAttemptsProps = {
  callback: React.Dispatch<React.SetStateAction<scormSummarySection>>;
  scormBundle: ScormBundle | undefined;
};
const onTapViewAllAttempts = ({
  scormBundle,
  callback,
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
    showMessage(translate("general.error_unknown"), () => null);
  }
};

export {
  updateScormBundleWithOfflineAttempts,
  formatAttempts,
  shouldScormSync,
  getDataForScormSummary,
  onTapDownloadResource,
  onTapNewAttempt,
  onTapContinueLastAttempt,
  onTapViewAllAttempts,
};
