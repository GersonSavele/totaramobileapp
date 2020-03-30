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

import { OfflineScormPackage } from "@totara/types/Scorm";


const ScormDataPre = "@TOTARAMOBILE_SCORM";
const KeySCORMPackageData = `${ScormDataPre}_API_DATA`;
const KeySCORMCommitData = `${ScormDataPre}_OFFLINE_COMMIT`;
const KeySCORMCMIData = `${ScormDataPre}_OFFLINE_CMI`;
const KeySCORMActivityData = `${ScormDataPre}_OFFLINE_ACTIVITY`;

const setSCORMPackageData = (scormId: number, data: OfflineScormPackage) => {
    return AsyncStorage.getItem(KeySCORMPackageData).then(storedData=> {
        let newData = {[scormId]: data}
        if (storedData && JSON.parse(storedData)) {
            newData = {...JSON.parse(storedData), ...newData};
        }
        return AsyncStorage.setItem(KeySCORMPackageData, JSON.stringify(newData));
    });
};

const getSCORMData = (scormId: number) => {
    return AsyncStorage.multiGet([KeySCORMPackageData, KeySCORMActivityData]).then(([dataScormPackage, dataActivity]) => {
        let scormData = null;
        if(dataScormPackage.length === 2 && dataScormPackage[1] && JSON.parse(dataScormPackage[1])) {
            scormData = JSON.parse(dataScormPackage[1])[scormId];
            let activityData = undefined; 
            if (dataActivity.length === 2 && dataActivity[1] && JSON.parse(dataActivity[1])){
                activityData = JSON.parse(dataActivity[1])[scormId];
            }
            scormData = {...scormData, ...{offlineActivity: activityData}} as OfflineScormPackage;   
        }
        return scormData;
    });
};

const getSCORMLastActivity = async (scormId: number) => {
    return AsyncStorage.getItem(KeySCORMActivityData).then(storageData => {
        if(storageData && JSON.parse(storageData) && JSON.parse(storageData)[scormId]) {
            return JSON.parse(storageData)[scormId];
        }
        return null;
    });
};

const saveSCORMActivityData = (data: any) => {
    
    return AsyncStorage.multiGet([KeySCORMCMIData, KeySCORMCommitData, KeySCORMActivityData]).then(([storageCMIData, storageCommitData, storageActivity]) => {
        let scormCMIData = {[data.scormid] : {[data.attempt]: {[data.scoid]: data.cmi}}};
        let scormCommitData = {[data.scormid] : {[data.attempt]: {[data.scoid]: [data.commit]}}};
        const activityInfo = {attempt: parseInt(data.attempt), scoid: data.scoid};
        let scormActivityData = {[data.scormid] : {last: activityInfo, start: activityInfo}};
        
        if (storageCMIData && (storageCMIData.length === 2) && (storageCMIData[0] === KeySCORMCMIData) && storageCMIData[1] && JSON.parse(storageCMIData[1])) {
            let existingCMIData = JSON.parse(storageCMIData[1]);
            if (existingCMIData[data.scormid] && existingCMIData[data.scormid][data.attempt] && existingCMIData[data.scormid][data.attempt][data.scoid]) {
                existingCMIData[data.scormid][data.attempt][data.scoid] = data.cmi;
            } else if(existingCMIData[data.scormid] && existingCMIData[data.scormid][data.attempt]) {
                existingCMIData[data.scormid][data.attempt][data.scoid] =  data.cmi;
            } else if(existingCMIData[data.scormid]) {
                existingCMIData[data.scormid][data.attempt] = {[data.scoid]: data.cmi};
            } else {
                existingCMIData[data.scormid] = {[data.attempt]: {[data.scoid]: data.cmi}};
            }
            scormCMIData = existingCMIData;
        }
        if (storageCommitData && (storageCommitData.length === 2) && (storageCommitData[0] === KeySCORMCommitData) && storageCommitData[1] && JSON.parse(storageCommitData[1])) {
            let existingCommitData = JSON.parse(storageCommitData[1]);
            if (existingCommitData[data.scormid] && existingCommitData[data.scormid][data.attempt] && existingCommitData[data.scormid][data.attempt][data.scoid]) {
                existingCommitData[data.scormid][data.attempt][data.scoid].push(data.commit);
            } else if (existingCommitData[data.scormid] && existingCommitData[data.scormid][data.attempt]) {
                existingCommitData[data.scormid][data.attempt][data.scoid] = [data.commit];
            } else if (existingCommitData[data.scormid]) {
                existingCommitData[data.scormid][data.attempt] = {[data.scoid]: [data.commit]};
            } else {
                existingCommitData[data.scormid] = {[data.attempt]: {[data.scoid]: [data.commit]}};
            }
            scormCommitData = existingCommitData;
        }
        if (storageActivity && (storageActivity.length === 2) && (storageActivity[0] === KeySCORMActivityData) &&  storageActivity[1] && JSON.parse(storageActivity[1])) {
            const existingActivityData = JSON.parse(storageActivity[1])[data.scormid];
            if(existingActivityData) {
                if (existingActivityData.last && existingActivityData.last.attempt && (existingActivityData.last.attempt > scormActivityData[data.scormid].last.attempt)) {
                   scormActivityData[data.scormid].last = existingActivityData.last;
                } 
                if (existingActivityData.start && existingActivityData.start.attempt && (existingActivityData.start.attempt < scormActivityData[data.scormid].start.attempt)) {
                    scormActivityData[data.scormid].start = existingActivityData.start;
                }
            } else {
                scormActivityData = {...existingActivityData, ...scormActivityData};  
            }
        }
        return [JSON.stringify(scormCMIData), JSON.stringify(scormCommitData), JSON.stringify(scormActivityData)];
    }).then(([formattedCMIData, formattedCommitData, formattedScormActivity]) => {
        return AsyncStorage.multiSet([[KeySCORMCMIData, formattedCMIData], [KeySCORMCommitData, formattedCommitData], [KeySCORMActivityData, formattedScormActivity]]);
    });
};

const getSCORMAttemptData = async (scormId: number, attempt: number) => {
    return AsyncStorage.getItem(KeySCORMCMIData).then(data => {
        if (data && JSON.parse(data) && JSON.parse(data)[scormId][attempt]) {
            return JSON.parse(data)[scormId][attempt];
        }
        return null;
    });
};

const getUnsyncedData = () => {
    return AsyncStorage.getItem(KeySCORMCommitData).then((storedCommitsData) => {
        if (storedCommitsData && JSON.parse(storedCommitsData)) {
            const commitsData = JSON.parse(storedCommitsData);
            let formattedUnsyncedData = [];
            for(let commitScormId in commitsData ) {
                formattedUnsyncedData.push({scormid: commitScormId, attempts: commitsData[commitScormId]});
            }
            return formattedUnsyncedData;
        } else {
            return null;
        }
    });
};
const setSyncedScormActivity = (scormId: number, attempt: number) => {
    return AsyncStorage.multiGet([KeySCORMCMIData, KeySCORMCommitData, KeySCORMActivityData]).then(([storageCMIData, storageCommitData, storageActivityData]) => {
        let scormCMIData = null;
        let scormCommitData = null;
        let scormActivityData = null;
        
        if (storageCMIData && (storageCMIData.length === 2) && (storageCMIData[0] === KeySCORMCMIData) && storageCMIData[1] && JSON.parse(storageCMIData[1])) {
            scormCMIData = JSON.parse(storageCMIData[1]);
            if(scormCMIData[scormId][attempt]){
                delete scormCMIData[scormId][attempt];
                if(!(scormCMIData[scormId] && scormCMIData[scormId].length > 0)) {
                    delete scormCMIData[scormId];
                }
            }
        }
        if (storageCommitData && (storageCommitData.length === 2) && (storageCommitData[0] === KeySCORMCommitData) && storageCommitData[1] && JSON.parse(storageCommitData[1])) {
            scormCommitData = JSON.parse(storageCommitData[1]);
            if (scormCommitData[scormId][attempt]) {
                delete scormCommitData[scormId][attempt];
                if(!(scormCommitData[scormId] && scormCommitData[scormId].length > 0)) {
                    delete scormCommitData[scormId];
                }
            }
        }
        if (storageActivityData && (storageActivityData.length === 2) && (storageActivityData[0] === KeySCORMActivityData) &&  storageActivityData[1] && JSON.parse(storageActivityData[1])) {
            scormActivityData = JSON.parse(storageActivityData[1]);
            if (scormActivityData[scormId]) {
                if (scormActivityData[scormId].last.attempt > attempt) {
                    scormActivityData[scormId].start.attempt = attempt + 1;
                } else {
                    delete scormActivityData[scormId]
                }
            } 
        }
        const newCMI = scormCMIData && scormCMIData.length > 0 ? JSON.stringify(scormCMIData) : null;
        const newCommits = scormCommitData && scormCommitData.length > 0 ? JSON.stringify(scormCommitData) : null;
        const newActivityData = scormActivityData && scormActivityData.length > 0 ? JSON.stringify(scormActivityData) : null;
        return [newCMI, newCommits, newActivityData];
    }).then(([formattedCMIData, formattedCommitData, formattedScormActivity]) => {
        if(formattedCMIData) {
            return AsyncStorage.setItem(KeySCORMCMIData, formattedCMIData).then(() => [formattedCommitData, formattedScormActivity]);
        } else {
            return AsyncStorage.removeItem(KeySCORMCMIData).then(()=> [formattedCommitData, formattedScormActivity]);
        }
    }).then(([savingCommitData, saveScormActivity])=> {
        if(savingCommitData) {
            return AsyncStorage.setItem(KeySCORMCommitData, savingCommitData).then(() => saveScormActivity);
        } else {
            return AsyncStorage.removeItem(KeySCORMCommitData).then(()=> saveScormActivity);
        }
    }).then((savingScormActivity)=> {
        if(savingScormActivity) {
            return AsyncStorage.setItem(KeySCORMActivityData, savingScormActivity);
        } else {
            return AsyncStorage.removeItem(KeySCORMActivityData);
        }
    });
};

const getGradesReport = (scormId: number) => {
    return AsyncStorage.getItem(KeySCORMCMIData).then(storageData => {
        if (storageData && JSON.parse(storageData)) {
            const dataCMIs = JSON.parse(storageData);
            if (dataCMIs[scormId]) {
                const cmiData = dataCMIs[scormId];
                let scoresData = [];
                for (let [attempt, scosData] of Object.entries(cmiData)) {
                    for (let [, cmi] of Object.entries(scosData as any)) {
                        scoresData.push({ attempt: parseInt(attempt), score: parseInt(cmi.core.score.raw), grade: cmi.core.lesson_status});
                    }
                }    
                return scoresData; 
            }
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

export { setSCORMPackageData, getSCORMData, saveSCORMActivityData, getSCORMAttemptData, getSCORMLastActivity, getUnsyncedData, setSyncedScormActivity, getGradesReport, storageClear };