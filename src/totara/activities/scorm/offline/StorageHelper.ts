import AsyncStorage from '@react-native-community/async-storage';
import { OfflineScormPackage } from "@totara/types/Scorm"




const loadScormData = async (scormId: string, attemptMode: string, scoId: string, attempt: number) => {
    console.log('loading scorm data......');
    console.log(`scormId: ${scormId}`);
    console.log(`attemptMode: ${attemptMode}`);
    console.log(`scoId: ${scoId}`);
    console.log(`attempt: ${attempt}`);  //TODO: IS ATTEMP REALLY NECESSARY?


    return Promise.all([getSCORMPackageData(scormId), getLastAttemptForScorm(scormId)]).then(([defaultScormData, lastAttempt]) => {
        let scormCmi: { } | null = null;
        let offlineDefaultSco = null;
        let offlineAttempt = lastAttempt ? parseInt(lastAttempt) : 0;

        if (attemptMode === 'normal') { //TODO: MAKE THIS A TYPE?
            if (offlineAttempt === 0 ) {
                // alert("There is not previous attempt, new attempt is starting.");
                offlineAttempt = offlineAttempt + 1;
            }
        } else {
            offlineAttempt = offlineAttempt + 1;
        }

        if (defaultScormData) {
            offlineDefaultSco = defaultScormData.offline_package_data.default;
            //const offlineScos = defaultScormData.offline_package_data.scos;
            scormCmi = buildCMI(defaultScormData, offlineDefaultSco.scoId, offlineAttempt);
        }

        console.log('offlineAttempt: ', offlineAttempt);
        const tmpScoId = scoId ? scoId : offlineDefaultSco.scoId;
        const keyCMI = getSCORMCMIDataKey(scormId, tmpScoId, offlineAttempt)
        const keyCommit = getSCORMCommitDataKey(scormId, tmpScoId, offlineAttempt)
        const cmiPromise =  storageGet(keyCMI);
        const commitsPromise = storageGet(keyCommit);

        return Promise.all([cmiPromise, commitsPromise]).then(
            ([cmiData, commitsData]) => {
                if (cmiData == null) {
                    return {default: scormCmi};
                } else {
                    return  {
                        default: scormCmi,
                        cmi: cmiData,
                        commits: commitsData
                    }
                }
            });
    });
};
const getLastAttemptForScorm = (scormId: string) => storageGet(`${scormId}_last_attempt`);


//SAVING
// const getSCORMCommitDataKey = (scormId: string, scoId: string, attempt: number) => `OFFLINECOMMIT_${scormId}_${scoId}_${attempt}`
// const getSCORMCMIDataKey = (scormId: string, scoId: string, attempt: number) => `OFFLINECMI_${scormId}_${scoId}_${attempt}`
const getSCORMCommitDataKey = (scormId: string, attempt: number) => `OFFLINECOMMIT_${scormId}_${attempt}`
const getSCORMCMIDataKey = (scormId: string, attempt: number) => `OFFLINECMI_${scormId}_${attempt}`
const saveSCORMData = async(commitData: any) => {
    console.log('saveData: ', commitData);
    // const keyCMIData = getSCORMCMIDataKey(commitData.data.scormid, commitData.data.scoid, commitData.data.attempt);
    const keyCMIData = getSCORMCMIDataKey(commitData.data.scormid, commitData.data.attempt);
    await storageSet(keyCMIData, commitData.cmi);

    let data = commitData.data;
    // read old commits and append to array
    // const keyCommitData = getSCORMCommitDataKey(commitData.scormid, commitData.scoId, commitData.attempt)
    const keyCommitData = getSCORMCommitDataKey(commitData.scormid, commitData.attempt)
    const commits = await storageGet(keyCommitData);
    if (commits) {
        commits.push(data);
        await storageSet(keyCommitData, commits);
    } else {
        await storageSet(keyCommitData, [data]);
    }

    return setLastAttemptFormScorm(commitData.scormid, commitData.attempt);
};

const setLastAttemptFormScorm = (scormId: string, newAttempt: any) => storageSet(`OFFLINELAST_ATTEMPT_${scormId}`, newAttempt);

const getSCORMAttemptData = async (scormId: string, attempt: number) => {
    const keyCMIData = getSCORMCMIDataKey(scormId, attempt);
    return storageGet(keyCMIData);
};


//STORAGE RELATED
const storageSet = (key: string, value: any) => {
    if (value) {
        return AsyncStorage.setItem(key, JSON.stringify(value));
    } else {
        throw Error('value not set');
    }
};

const storageGet = async (key: string) => {
    const result = await AsyncStorage.getItem(key);
    return JSON.parse(result!);
};

//EXTERNAL STORAGE RELATED
const storageGetList = async (keys: string[]) => {
    return AsyncStorage.multiGet(keys);
};

const storageClear = async () => {
    const asyncStorageKeys = await AsyncStorage.getAllKeys();
    if (asyncStorageKeys.length > 0) {
        console.log('cleaning AsyncStorage');
        return AsyncStorage.clear();
    }
};

const getSCORMPackageDataKey = (scormId: string) => (`SCORM_${scormId}`);

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


export { setSCORMPackageData, getSCORMPackageData, saveSCORMData, getSCORMAttemptData }
