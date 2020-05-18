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
  syncOfflineScormBundle
} from "@totara/activities/scorm/offline/offlineScormController";
import {
  SECONDS_FORMAT,
  scormSummarySection,
  scormActivityType
} from "./constants";
import ResourceManager from "@totara/core/ResourceManager/ResourceManager";
import { Log } from "@totara/lib";
import { offlineScormServerRoot } from "@totara/activities/scorm/offline";
import { showMessage } from "./tools";
import { scormZipPackagePath } from "@totara/activities/scorm/offline/SCORMFileHandler";
import { RetrieveStorageDataById } from "@totara/core/ResourceManager/StorageManager";
import {
  removeScormPackageData,
  getScormData
} from "@totara/activities/scorm/offline/StorageHelper";
import { scormBundlesQuery } from "@totara/activities/scorm/api";

/**
 * this formats the attempts of the SCORM bundle
 * @param {Object} data - scorm data from the Backend
 */
const formatAttempts = (data: any) => {
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
 * This function update the scorm bundle with the offline attempts
 * @param {string} id - scorm id
 * @param {Object} data - scorm data
 */
const updateScormBundleWithOfflineAttempts = (
  scormId: string,
  scorm: Scorm,
  client: any
) => {
  // retrieve from the resource manager that comes from the downloads
  return RetrieveStorageDataById(scormId)
    .then((storedResourceData) => {
      if (!storedResourceData) {
        // remove from the SCORM package data from the AsyncStorage
        return removeScormPackageData(scormId).then(() => undefined);
      } else {
        return Promise.resolve(storedResourceData.unzipPath);
      }
    })
    .then((packageName) => {
      // starting cache data with the very first scorm data
      let cacheData = { [scormId]: scorm };
      try {
        // using cache in case we have cached scorms
        cacheData = client.readQuery({ query: scormBundlesQuery });
      } catch (e) {
        console.log("e");
      }
      // resulting data
      let newData: { [x: string]: any } | undefined = { ...cacheData };
      if (packageName) {
        const resourcePackageName = getOfflineScormPackageName(scormId);
        newData = {
          [scormId]: {
            scormPackage: { path: resourcePackageName },
            lastsynced: parseInt(moment().format(SECONDS_FORMAT))
          }
        };
        if (cacheData && cacheData[scormId]) {
          const newScormData = { ...cacheData[scormId], ...newData[scormId] };
          newData = { ...cacheData, [scormId]: newScormData };
          return client.writeQuery({
            query: scormBundlesQuery,
            data: {
              scormBundles: newData
            }
          });
        }
      } else {
        if (
          cacheData &&
          cacheData[scormId] &&
          cacheData[scormId].scormPackage
        ) {
          delete newData[scormId].scormPackage;
          if (
            newData &&
            newData[scormId].lastsynced &&
            Object.keys(newData[scormId]).length === 1
          ) {
            delete newData[scormId];
          }
          if (!(newData && Object.keys(newData))) {
            newData = undefined;
          }
          return client.writeQuery({
            query: scormBundlesQuery,
            data: {
              scormBundles: newData
            }
          });
        }
      }
      return (
        newData && newData[scormId] && { scorm: scorm, ...newData[scormId] }
      );
    });
};

const updateScormBundleWithOfflineAttemptsOld = (
  scormId: string,
  scorm: Scorm
) => {
  // retrieve from the resource manager that comes from the downloads
  return RetrieveStorageDataById(scormId)
    .then((storedResourceData) => {
      if (!storedResourceData) {
        // remove from the SCORM package data from the AsyncStorage
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
              scormPackage: { path: resourcePackageName }
            };
            return syncOfflineScormBundle(scormId, dataScormPackage).then(
              () => {
                return {
                  bundle: { ...storedBundle, ...dataScormPackage },
                  cmis: cmis,
                  packageName
                };
              }
            );
          } else {
            return {
              bundle: storedBundle,
              cmis: cmis,
              packageName: packageName
            };
          }
        }
      );
    })
    .then(({ bundle, cmis, packageName }) => {
      let formattedData = { scorm: scorm, ...bundle } as ScormBundle;
      if (formattedData && formattedData.scorm) {
        if (!formattedData.scormPackage && packageName) {
          const resourcePackageName = getOfflineScormPackageName(scormId);
          formattedData = {
            ...formattedData!,
            scormPackage: { path: resourcePackageName }
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
              offlineActivity: { attempts: offlineReport }
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
      gradereported: attemptScore
    });
  }
  return scoresData;
};

// old code for our reference:
/**
 * @param id
 * @param isUserOnline
 * @returns {Scorm} scorm
 */
const shouldScormSync = (id: string, isUserOnline: boolean) => (
  storedData: ScormBundle
) => {
  let scormBundleData = storedData as ScormBundle;
  if (isUserOnline) {
    scormBundleData.lastsynced = parseInt(moment().format(SECONDS_FORMAT));
    return syncOfflineScormBundle(id, {
      lastsynced: scormBundleData.lastsynced
    }).then(() => {
      return scormBundleData;
    });
  }
  return scormBundleData;
};

/**
 *
 *  @param {boolean} isUserOnline - if network status is online
 */
// old code
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
    attempts: undefined
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

  data.actionPrimary =
    (((isUserOnline && scormBundle && scorm && scorm.launchUrl) ||
      (!isUserOnline &&
        scorm.offlineAttemptsAllowed &&
        scormPackage &&
        scormPackage.path)) &&
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

  data.maxAttempts =
    (scorm.attemptsMax !== null && scorm.attemptsMax) || undefined;

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
  callback: (scormId: string, data: any, client: any) => Promise<void>;
  downloadManager: ResourceManager;
  scormBundle: ScormBundle | undefined;
  client: any;
  apiKey?: string;
};

const onTapDownloadResource = ({
  callback,
  downloadManager,
  scormBundle,
  apiKey,
  client
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
        lastsynced: scormBundle.lastsynced
      } as ScormBundle;

      callback(_scormId, _offlineScormData, client);
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
  callback
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
        attempt: newAttempt
      });
    } else {
      if (scormBundle.scorm && scormBundle.scorm.launchUrl) {
        callback(scormActivityType.online, scormBundle, {
          url: scormBundle.scorm.launchUrl
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
  callback
}: OnTapAttemptProps) => () => {
  if (isUserOnline) {
    if (scormBundle) {
      if (scormBundle.scorm && scormBundle.scorm.repeatUrl) {
        callback(scormActivityType.online, scormBundle, {
          url: scormBundle.scorm.repeatUrl
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
    showMessage(translate("general.error_unknown"), () => null);
  }
};

export {
  updateScormBundleWithOfflineAttempts,
  formatAttempts,
  // formatScormData,
  shouldScormSync,
  getDataForScormSummary,
  onTapDownloadResource,
  onTapNewAttempt,
  onTapContinueLastAttempt,
  onTapViewAllAttempts
};
