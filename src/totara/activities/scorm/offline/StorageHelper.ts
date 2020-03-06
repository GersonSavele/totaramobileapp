import AsyncStorage from '@react-native-community/async-storage';
import { OfflineScormPackage } from "@totara/types/Scorm"

const getSCORMAttemptData = async (scormId: string, scoId: string, attempt: number) => {
  console.log("getSCORMAttemptData data......");
  console.log(`scormId: ${scormId}`);
  console.log(`scoId: ${scoId}`);

  const keyCMI = getSCORMCMIDataKey(scormId, scoId, attempt);
  const keyCommit = getSCORMCommitDataKey(scormId, scoId, attempt);
  const cmiPromise = storageGet(keyCMI);
  const commitsPromise = storageGet(keyCommit);

  return Promise.all([cmiPromise, commitsPromise]).then(
    ([cmiData, commitsData]) => {
      return {
        cmi: cmiData,
        commits: commitsData
      };
    }
  );
};


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

const buildCMI = (scormData: any, selectedSCOId: string, _attempt: number) => {
    let selectedSCO = null;
    let _def : any = {};
    let _int : any = {};
    let _obj : any = {};

    //TODO: need to be integrated
    const studentId = 'kamala', studentName = 'Tennakoon, Kamala';

    if (scormData.offline_package_data.scos) {
        for (let index = 0; index < scormData.offline_package_data.scos.length; index++) {
            const tmpSCO = scormData.offline_package_data.scos[index];
            if (selectedSCOId && tmpSCO.scoId === selectedSCOId) {
                selectedSCO = tmpSCO;
            }

            const scoId = tmpSCO.scoId as string;

            _def[scoId] = buildSCODefinition(studentId, studentName);
            _int[scoId] = "";
            _obj[scoId] = "";
        }
    }

    const _entrysrc = selectedSCO.launchSrc;
    const _scormdebugging = false; //TODO - apply correct value
    const _scormauto = 0; //TODO - apply correct value
    const _scormid = scormData.id;
    const _scoid = selectedSCO.scoId;
    const _autocommit = false; //TODO - apply correct value
    const _masteryoverride = true; //TODO - apply correct value
    const _hidetoc = 1; //TODO - apply correct value

    return {
        entrysrc: _entrysrc,
        def: _def,
        obj: _obj,
        int: _int,
        scormdebugging: _scormdebugging,
        scormauto: _scormauto,
        scormid:_scormid,
        scoid: _scoid,
        attempt: _attempt,
        autocommit: _autocommit,
        masteryoverride: _masteryoverride,
        hidetoc: _hidetoc
    };
}


const buildSCODefinition = (studentId: string, studentName: string) =>{

    //TODO: MOVE THESE PROPERTIES TO PARAMETERS AS NECESSARY
    const credit = 'credit', entry = 'ab-initio',
        lessonMode = 'normal', launchData = '', masteryScore = '', maxTimeAllowed = '', timeLimitAction = '', totalTime = "00:00:00",
        lessonLocation = '', lessonStatus = '', raw = '', max = '', min = '', exit = '',
        suspendData = '', comments = '', language = '', audio = '0', speed = '0', text = '0';

    const _def = {
        "cmi.core.student_id": studentId,
        "cmi.core.student_name": studentName,
        "cmi.core.credit": credit,
        "cmi.core.entry": entry,
        "cmi.core.lesson_mode": lessonMode,
        "cmi.launch_data": launchData,
        "cmi.student_data.mastery_score": masteryScore,
        "cmi.student_data.max_time_allowed": maxTimeAllowed,
        "cmi.student_data.time_limit_action": timeLimitAction,
        "cmi.core.total_time": totalTime,
        "cmi.core.lesson_location": lessonLocation,
        "cmi.core.lesson_status": lessonStatus,
        "cmi.core.score.raw": raw,
        "cmi.core.score.max": max,
        "cmi.core.score.min": min,
        "cmi.core.exit": exit,
        "cmi.suspend_data": suspendData,
        "cmi.comments": comments,
        "cmi.student_preference.language": language,
        "cmi.student_preference.audio": audio,
        "cmi.student_preference.speed": speed,
        "cmi.student_preference.text": text,
    }
    return _def;
}

//SAVING
const getSCORMCommitDataKey = (scormId: string, scoId: string, attempt: number) => `OFFLINECOMMIT_${scormId}_${scoId}_${attempt}`
const getSCORMCMIDataKey = (scormId: string, scoId: string, attempt: number) => `OFFLINECMI_${scormId}_${scoId}_${attempt}`
const saveSCORMData = async(commitData: any) => {
    console.log('saveData: ', commitData);
    const keyCMIData = getSCORMCMIDataKey(commitData.data.scormid, commitData.data.scoid, commitData.data.attempt);
    await storageSet(keyCMIData, commitData.data.cmi);

    let data = commitData.data.data;
    // read old commits and append to array
    const keyCommitData = getSCORMCommitDataKey(commitData.data.scormid, commitData.data.scoId, commitData.data.attempt)
    const commits = await storageGet(keyCommitData);
    if (commits) {
        commits.push(data);
        await storageSet(keyCommitData, commits);
    } else {
        await storageSet(keyCommitData, [data]);
    }

    return setLastAttemptFormScorm(commitData.data.scormid, commitData.data.attempt);
};
const setLastAttemptFormScorm = (scormId: string, newAttempt: any) => storageSet(`${scormId}_last_attempt`, newAttempt);



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
