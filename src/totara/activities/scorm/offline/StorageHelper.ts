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

import { OfflineScormPackage } from "@totara/types/Scorm"


const ScormDataPre = "@TOTARAMOBILE_SCORM";
const getSCORMPackageDataKey = (scormId: string) => (`${ScormDataPre}_API_DATA_${scormId}`);
const getSCORMCommitDataKey = (scormId: string, attempt: number) => (`${ScormDataPre}_OFFLINE_COMMIT_${scormId}_${attempt}`);
const getSCORMCMIDataKey = (scormId: string, attempt: number) => (`${ScormDataPre}_OFFLINE_CMI_${scormId}_${attempt}`);
const getSCORMLastAttemptKey = (scormId: string) => (`${ScormDataPre}_OFFLINELAST_ATTEMPT_${scormId}`);

const setSCORMPackageData = (scormId: string, data: OfflineScormPackage) => {
    const scormPackageDataKey = getSCORMPackageDataKey(scormId);
    return AsyncStorage.setItem(scormPackageDataKey, JSON.stringify(data));
};

const getSCORMPackageData = (scormId: string) => {
    const scormPackageDataKey = getSCORMPackageDataKey(scormId);
    return AsyncStorage.getItem(scormPackageDataKey).then(data => {
        if(data) {
            return JSON.parse(data) as OfflineScormPackage;    
        }
        return null;
    });
};

const getLastAttemptForScorm = (scormId: string) => {
    return AsyncStorage.getItem(getSCORMLastAttemptKey(scormId)).then(storageData => {
        if(storageData) {
            return parseInt(storageData);
        }
        return null;
    });
}

const saveSCORMActivityData = (data: any) => {
    const keyScormCMIData = getSCORMCMIDataKey(data.scormid, data.attempt);
    const keyScormCommitData = getSCORMCommitDataKey(data.scormid, data.attempt);
    const keyScormLastAttempt = getSCORMLastAttemptKey(data.scormid);
    
    return AsyncStorage.multiGet([keyScormCMIData, keyScormCommitData, keyScormLastAttempt]).then(([storageCMIData, storageCommitData, storageLastAttempt]) => {
         const scoidKey = data.scoid;
         let scormCommitData = {[scoidKey] : [data.commit]};
         let scormCMIData = {[scoidKey] : data.cmi};
         let scormLastAttempt = parseInt(data.commit.attempt);
        
         if (storageCMIData && (storageCMIData.length === 2) && (storageCMIData[1] === keyScormCMIData) && JSON.parse(storageCMIData[1])) {
            let existingCMIData = JSON.parse(storageCMIData[1]);
            scormCMIData = {...existingCMIData[scoidKey], ...data.cmi};
        }
         if (storageCommitData && (storageCommitData.length === 2) && (storageCommitData[1] === keyScormCommitData) && JSON.parse(storageCommitData[1])) {
            let existingCommitData = JSON.parse(storageCommitData[1]);
            if (existingCommitData[scoidKey]) {
                existingCommitData[scoidKey].push(data.commit);
            } else {
                existingCommitData[scoidKey] = [data.commit];
            }
            scormCommitData = existingCommitData;
        }
        if (storageLastAttempt && (storageLastAttempt.length === 2) && (storageLastAttempt[1] === keyScormLastAttempt) &&  (scormLastAttempt < parseInt(storageLastAttempt[1]))) {
            scormLastAttempt = parseInt(storageLastAttempt[1]);
        }
        return [JSON.stringify(scormCMIData), JSON.stringify(scormCommitData), scormLastAttempt.toString()];
    }).then(([formattedCMIData, formattedCommitData, formattedScormLastAttempt]) => {
        return AsyncStorage.multiSet([[keyScormCMIData, formattedCMIData], [keyScormCommitData, formattedCommitData], [keyScormLastAttempt, formattedScormLastAttempt]]);
    });
};

const getSCORMAttemptData = async (scormId: string, attempt: number) => {
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
        console.log("cleaning AsyncStorage");
        return AsyncStorage.clear();
    }
};

export { setSCORMPackageData, getSCORMPackageData, saveSCORMActivityData, getSCORMAttemptData, getLastAttemptForScorm, storageClear };