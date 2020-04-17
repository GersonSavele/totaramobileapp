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


const ScormDataPre = "@TOTARAMOBILE_SCORM";
const KeyScormPackageData = `${ScormDataPre}_API_DATA`;
const KeyScormCommitData = `${ScormDataPre}_OFFLINE_COMMIT`;
const KeyScormCMIData = `${ScormDataPre}_OFFLINE_CMI`;
const KeyScormActivityData = `${ScormDataPre}_OFFLINE_ACTIVITY`;

const setScormPackageData = (scormId: number, data: any) => {
    return AsyncStorage.getItem(KeyScormPackageData).then(storedData=> {
        let scormData = {scorm: data.scorm, lastsynced: data.lastsynced, scormPackage: data.scormPackage};
        let newData = {[scormId]: scormData}
        if (storedData && JSON.parse(storedData)) {
            const storedScormsData = JSON.parse(storedData);
            newData = {...storedScormsData, ...newData};
        }
        return AsyncStorage.setItem(KeyScormPackageData, JSON.stringify(newData));
    });
};

const getScormPackageData = (scormId: number) => {
    return AsyncStorage.getItem(KeyScormPackageData).then(storedData=> {
        if (storedData && JSON.parse(storedData)) {
            const storedScormsData = JSON.parse(storedData);
            if(storedScormsData[scormId]) {
                return storedScormsData[scormId];
            }
        }
        return undefined;
    });
};

const removeScormPackageData = (scormId: number) => {
    return AsyncStorage.getItem(KeyScormPackageData).then(storageData => {
        if(storageData && JSON.parse(storageData)) {
            let existingData = JSON.parse(storageData);
            if (existingData[scormId]) {
                delete existingData[scormId];
            }
            if (existingData) {
                return existingData;
            }
        }
        return null;
    }).then(newData => {
        if (Object.keys(newData).length === 0 && newData.constructor === Object) {
            return AsyncStorage.removeItem(KeyScormPackageData);
        } else {
            return AsyncStorage.setItem(KeyScormPackageData, JSON.stringify(newData));
        }
    });
};

const getScormData = (scormId: number) => {
    return AsyncStorage.multiGet([KeyScormPackageData, KeyScormCMIData]).then(([dataScormPackage, dataCMIs]) => {
        // let scormData = null;
        let storedScormData = {bundle: undefined, cmis: undefined};
        if(dataScormPackage.length === 2 && dataScormPackage[1] && JSON.parse(dataScormPackage[1])) {
            const scormDataSet = JSON.parse(dataScormPackage[1]);
            if (scormDataSet[scormId]) {
                storedScormData.bundle = scormDataSet[scormId];
            }                 
        }
        if(dataCMIs.length === 2 && dataCMIs[1] && JSON.parse(dataCMIs[1])) {
            const cmiData = JSON.parse(dataCMIs[1]);
            if(cmiData[scormId]) {
                storedScormData.cmis = cmiData[scormId];
            }
        }
        return storedScormData;
    });
};

const saveScormActivityData = (data: any) => {
    return AsyncStorage.multiGet([KeyScormCMIData, KeyScormCommitData, KeyScormActivityData]).then(([storageCMIData, storageCommitData, storageActivity]) => {
        let scormCMIData = {[data.scormid] : {[data.attempt]: {[data.scoid]: data.cmi}}};
        let scormCommitData = {[data.scormid] : {[data.attempt]: {[data.scoid]: [data.commit]}}};
        const activityInfo = {attempt: parseInt(data.attempt), scoid: data.scoid};
        let scormActivityData = {[data.scormid] : {last: activityInfo, start: activityInfo}};
        
        if (storageCMIData && (storageCMIData.length === 2) && (storageCMIData[0] === KeyScormCMIData) && storageCMIData[1] && JSON.parse(storageCMIData[1])) {
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
        if (storageCommitData && (storageCommitData.length === 2) && (storageCommitData[0] === KeyScormCommitData) && storageCommitData[1] && JSON.parse(storageCommitData[1])) {
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
        if (storageActivity && (storageActivity.length === 2) && (storageActivity[0] === KeyScormActivityData) &&  storageActivity[1] && JSON.parse(storageActivity[1])) {
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
        return AsyncStorage.multiSet([[KeyScormCMIData, formattedCMIData], [KeyScormCommitData, formattedCommitData], [KeyScormActivityData, formattedScormActivity]]);
    });
};

const getScormAttemptData = async (scormId: number, attempt: number) => {
    return AsyncStorage.getItem(KeyScormCMIData).then(data => {
        if (data && JSON.parse(data)) {
            const storedAttemptData = JSON.parse(data);
            if (storedAttemptData[scormId] && storedAttemptData[scormId][attempt]) {
                return JSON.parse(data)[scormId][attempt];
            }
        }
        return null;
    });
};

const getAllCommits = () => {
    return AsyncStorage.getItem(KeyScormCommitData).then((storedCommitsData) => {
        if (storedCommitsData && JSON.parse(storedCommitsData)) {
            const commitsData = JSON.parse(storedCommitsData);
            return commitsData;
        } else {
            return undefined;
        }
    });
};

const clearCommit = (scormId: number, attempt: number) => {
    return AsyncStorage.multiGet([KeyScormCommitData, KeyScormCMIData]).then(([storageCommitsData, storageCMIData]) => {
        let existingData = {commits: undefined, cmis: undefined}
        if (storageCommitsData && (storageCommitsData.length === 2) && (storageCommitsData[0] === KeyScormCommitData) && storageCommitsData[1] && JSON.parse(storageCMIData[1])) {
            existingData.commits = JSON.parse(storageCommitsData[1]);
        }
        if (storageCMIData && (storageCMIData.length === 2) && (storageCMIData[0] === KeyScormCMIData) && storageCMIData[1] && JSON.parse(storageCMIData[1])) {
            existingData.cmis =  JSON.parse(storageCMIData[1]);
        }
        return existingData
    }).then(storedata => {
        let updatedData = {commits: storedata.commits, cmis: storedata.cmis};
        if (updatedData.commits) {
            if(updatedData.commits![scormId] && updatedData.commits![scormId][attempt]) {
                delete updatedData.commits![scormId][attempt];
                if (Object.keys(updatedData.commits![scormId]).length === 0) {
                    delete updatedData.commits![scormId]
                }
                if (Object.keys(updatedData.commits!).length === 0) {
                    updatedData.commits = undefined;
                }
            }
        }

        if (updatedData.cmis) {
            if(updatedData.cmis![scormId] && updatedData.cmis![scormId][attempt]) {
                delete updatedData.cmis![scormId][attempt];
                if (Object.keys(updatedData.cmis![scormId]).length === 0) {
                    delete updatedData.cmis![scormId]
                }
                if (Object.keys(updatedData.cmis!).length === 0) {
                    updatedData.cmis = undefined;
                }
            }
        }
        return updatedData
    }).then(updatedData => {
        if (updatedData.commits) {
            return AsyncStorage.setItem(KeyScormCommitData, JSON.stringify(updatedData.commits)).then(()=> updatedData.cmis);
        } else {
            return AsyncStorage.removeItem(KeyScormCommitData).then(()=> updatedData.cmis);
        }
    }).then(updatedCmis => {
        if (updatedCmis) {
            return AsyncStorage.setItem(KeyScormCMIData, JSON.stringify(updatedCmis));
        } else {
            return AsyncStorage.removeItem(KeyScormCMIData);
        }
    });
};

const getLastAttemptScore = (scormId: number) => {
    return AsyncStorage.getItem(KeyScormActivityData).then(storedActivityData => {
        if(storedActivityData && JSON.parse(storedActivityData)) {
            const storedActivitiesData = JSON.parse(storedActivityData);
            if (storedActivitiesData[scormId] && storedActivitiesData[scormId].last && storedActivitiesData[scormId].last.attempt) {
                return storedActivitiesData[scormId].last.attempt
            } 
        }
        return null;
    }).then(lastAttempt=> {
        if(lastAttempt) {
            return AsyncStorage.getItem(KeyScormCMIData).then(storageData => {
                if (storageData && JSON.parse(storageData)) {
                    const dataCMIs = JSON.parse(storageData);
                    if (dataCMIs[scormId]) {
                        const cmiData = dataCMIs[scormId];
                        if(cmiData[lastAttempt]) {
                            let grade = "passed";
                            let score = "0%";
                            const scosData = cmiData[lastAttempt];
                             
                            for (let [, cmi] of Object.entries(scosData as any)) {
                                const maxScore = parseInt(cmi.core.score.max) ? parseInt(cmi.core.score.max) : 100;
                                const minScore = parseInt(cmi.core.score.min) ? parseInt(cmi.core.score.min) : 0;
                                const rowScore = parseInt(cmi.core.score.raw) ? parseInt(cmi.core.score.raw) : 0;
                                
                                const scoScorePercent = (rowScore / ( maxScore - minScore)) * 100;
                                score = `${scoScorePercent}%`;
                            }
                            return {score: score, grade: grade};
                        }
                    }
                } 
                return null;
            });
        } else {
            return null;
        }
    });
};


export { getScormPackageData, setScormPackageData, getScormData, saveScormActivityData, getScormAttemptData, getAllCommits, clearCommit, getLastAttemptScore, removeScormPackageData };