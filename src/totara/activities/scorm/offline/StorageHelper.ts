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

import AsyncStorage from "@react-native-community/async-storage";

import { OfflineScormPackage, ScormOfflineActivity } from "@totara/types/Scorm"


const ScormDataPre = "@TOTARAMOBILE_SCORM";
const getSCORMPackageDataKey = (scormId: number) => (`${ScormDataPre}_API_DATA_${scormId}`);
const getSCORMCommitDataKey = (scormId: number, attempt: number) => (`${ScormDataPre}_OFFLINE_COMMIT_${scormId}_${attempt}`);
const getSCORMCMIDataKey = (scormId: number, attempt: number) => (`${ScormDataPre}_OFFLINE_CMI_${scormId}_${attempt}`);
const getSCORMLastActivityKey = (scormId: number) => (`${ScormDataPre}_OFFLINE_LAST_ACTIVITY_${scormId}`);
const getSCORMFirstActivityKey = (scormId: number) => (`${ScormDataPre}_OFFLINE_FIRST_ACTIVITY_${scormId}`);

const setSCORMPackageData = (scormId: number, data: OfflineScormPackage) => {
    const scormPackageDataKey = getSCORMPackageDataKey(scormId);
    return AsyncStorage.setItem(scormPackageDataKey, JSON.stringify(data));
};

const getSCORMData = (scormId: number) => {
    const keyScormPackage = getSCORMPackageDataKey(scormId);
    const keyScormLastActivity = getSCORMLastActivityKey(scormId);
    const keyScormFirstActivity = getSCORMFirstActivityKey(scormId);
    return AsyncStorage.multiGet([keyScormPackage, keyScormLastActivity, keyScormFirstActivity]).then(([dataScormPackage, dataLastActivity, dataFirstActivity]) => {
        let scormData = null;
        if(dataScormPackage.length === 2 && dataScormPackage[1]) {
            let activityData = {start: undefined, last: undefined}; 
            if (dataLastActivity.length === 2 && dataLastActivity[1]){
                activityData.last = JSON.parse(dataLastActivity[1]);
            }
            if (dataLastActivity.length === 2 && dataLastActivity[1]){
                activityData.last = JSON.parse(dataLastActivity[1]);
            }
            scormData = {...JSON.parse(dataScormPackage[1]), ...{offlineActivity: activityData}} as OfflineScormPackage;   
        }
        return scormData;
    });
};

const getSCORMLastActivity = async (scormId: number) => {
    return AsyncStorage.getItem(getSCORMLastActivityKey(scormId)).then(storageData => {
        if(storageData) {
            return JSON.parse(storageData);
        }
        return null;
    });
}

const saveSCORMActivityData = (data: any) => {
    const keyScormCMIData = getSCORMCMIDataKey(data.scormid, data.attempt);
    const keyScormCommitData = getSCORMCommitDataKey(data.scormid, data.attempt);
    const keyScormLastActivity = getSCORMLastActivityKey(data.scormid);
    const keyScormFirstActivity = getSCORMFirstActivityKey(data.scormId);
    
    return AsyncStorage.multiGet([keyScormCMIData, keyScormCommitData, keyScormLastActivity, keyScormFirstActivity]).then(([storageCMIData, storageCommitData, storageLastAttempt, storageFirstAttempt]) => {
         const scoidKey = data.scoid;
         let scormCommitData = {[scoidKey] : [data.commit]};
         let scormCMIData = {[scoidKey] : data.cmi};
         let scormLastAttempt = {attempt: parseInt(data.commit.attempt), scoid: data.commit.scoid};
         let scormFirstAttempt = scormLastAttempt;
        
         if (storageCMIData && (storageCMIData.length === 2) && (storageCMIData[0] === keyScormCMIData) && storageCMIData[1] && JSON.parse(storageCMIData[1])) {
            let existingCMIData = JSON.parse(storageCMIData[1]);
            scormCMIData = {...existingCMIData[scoidKey], ...data.cmi};
        }
         if (storageCommitData && (storageCommitData.length === 2) && (storageCommitData[0] === keyScormCommitData) && storageCommitData[1] && JSON.parse(storageCommitData[1])) {
            let existingCommitData = JSON.parse(storageCommitData[1]);
            if (existingCommitData[scoidKey]) {
                existingCommitData[scoidKey].push(data.commit);
            } else {
                existingCommitData[scoidKey] = [data.commit];
            }
            scormCommitData = existingCommitData;
        }
        if (storageLastAttempt && (storageLastAttempt.length === 2) && (storageLastAttempt[0] === keyScormLastActivity) &&  storageLastAttempt[1] && JSON.parse(storageLastAttempt[1])) {
            const existingLastAttemptData = JSON.parse(storageLastAttempt[1]);
            if (existingLastAttemptData.attempt > scormLastAttempt.attempt) {
               scormLastAttempt = existingLastAttemptData;
            }
        }
        if (storageFirstAttempt  && (storageFirstAttempt.length === 2) && (storageFirstAttempt[0] === keyScormFirstActivity) && storageFirstAttempt[1] && JSON.parse(storageFirstAttempt[1])) {
            scormFirstAttempt = JSON.parse(storageFirstAttempt[1]);
        }
        return [JSON.stringify(scormCMIData), JSON.stringify(scormCommitData), JSON.stringify(scormLastAttempt), JSON.stringify(scormFirstAttempt)];
    }).then(([formattedCMIData, formattedCommitData, formattedScormLastAttempt, formattedScormFirstAttempt]) => {
        return AsyncStorage.multiSet([[keyScormCMIData, formattedCMIData], [keyScormCommitData, formattedCommitData], [keyScormLastActivity, formattedScormLastAttempt], [keyScormFirstActivity, formattedScormFirstAttempt]]);
    });
};

const getSCORMAttemptData = async (scormId: number, attempt: number) => {
    const keyCMIData = getSCORMCMIDataKey(scormId, attempt);
    return AsyncStorage.getItem(keyCMIData).then(data => {
        if (data) {
            return JSON.parse(data);
        }
        return null;
    });
};

const storageClear = async () => {
    const asyncStorageKeys = await AsyncStorage.getAllKeys();
    if (asyncStorageKeys.length > 0) {
        return AsyncStorage.clear();
    }
};

export { setSCORMPackageData, getSCORMData, saveSCORMActivityData, getSCORMAttemptData, getSCORMLastActivity, storageClear };