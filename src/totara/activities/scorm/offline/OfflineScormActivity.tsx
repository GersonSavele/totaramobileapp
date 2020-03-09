import React, { useEffect, useState } from "react"
import { View, Text } from "react-native"

// @ts-ignore //TODO: THERE'S NO TYPED FOR REACT-NATIVE-STATIC-SERVER https://github.com/futurepress/react-native-static-server/issues/67
import StaticServer from 'react-native-static-server';
import OfflineSCORMPlayer from "@totara/activities/scorm/components/OfflineSCORMPlayer";
import { initializeSCORMWebplayer, isSCORMPlayerInitialized } from "@totara/activities/scorm/offline/SCORMFileHandler";
import { getScormPackageData } from "@totara/activities/scorm/offline/PackageProcessor"
import { OfflineScormPackage, ScormPackageData, Sco } from "@totara/types/Scorm"
import { config } from "@totara/lib";
import { saveSCORMData, getSCORMAttemptData } from "./StorageHelper";


type Props = {
    storedPackageData: OfflineScormPackage
}


const OfflineScormActivity = (props: Props) => {

    console.log(props);
    
    const [isWebPlayerInitialized, setIsWebPlayerInitialized] = useState<boolean>();
    const [server, setServer] = useState<StaticServer>();
    const [url, setUrl] = useState<string>();
    // const [cmi, setCMI] = useState<any>();
    const [jsCode, setJsCode] = useState<string>();
    const [scormPackageData, setScormPackageData] = useState<ScormPackageData>(props.storedPackageData.offlinePackageData);
    
    
    useEffect(()=>{
        if(!isWebPlayerInitialized) {
            isSCORMPlayerInitialized().then((isInit) => {
                if(!isInit) {
                    initializeSCORMWebplayer().then(()=> {
                        setIsWebPlayerInitialized(true);
                    })
                } else {
                    setIsWebPlayerInitialized(true);
                }
            })
        }
        if(props.storedPackageData.offlinePackageData && props.storedPackageData.offlinePackageData.packageLocation) {
            loadSCORMPackageData(props.storedPackageData.offlinePackageData);
        } 
        
    }, [props.storedPackageData.scorm.id]);

    useEffect(()=> { 
        // TODO - need to pass attempt
        getSCORMAttemptData(props.storedPackageData.scorm.id, 1).then(cmiData=> {
            console.log("saved cmi: ", cmiData);
            if (scormPackageData && scormPackageData.scos && scormPackageData.defaultSco) {
                // TODO - need to pass attempt
                const cmi = buildCMI(props.storedPackageData.scorm.id, scormPackageData.scos, scormPackageData.defaultSco.id!, 1, scormPackageData.packageLocation);
                setJsCode(scormDataIntoJsInitCode(cmi, null));
            }
        });
    }, [scormPackageData])

    useEffect(()=>{
        console.log('isWebPlayerInitialized: ', isWebPlayerInitialized);
        if(isWebPlayerInitialized) {
            startServer();
        }
    }, [isWebPlayerInitialized]);

    useEffect(()=>{
        if(!server){
            const _server = new StaticServer(config.portOfflineScormPlayer, config.rootOfflineScormPlayer, {keepAlive: true, localOnly: true});
            setServer(_server);
            startServer();
        }
    }, [server]);

    

    //ONCE WE GOT scormFilesPath, LOAD THE JSCODE
    // useEffect(()=>{
    //     const loadJsCode = async() =>{
    //         return new Promise<string>(resolve =>
    //             setTimeout(() => resolve("JSCODE LOADED"), 1000)
    //         );
    //     }

    //     if(scormFilesPath && !jsCode){
    //         loadJsCode().then((_jsCode: string)=>{
    //             setJsCode(_jsCode);
    //         })
    //     }

    // }, [scormFilesPath]);


    


    //ONCE WE GOT serverRootPath, jsCode and server
    // useEffect(()=>{
    //     if(serverRootPath && jsCode && server){
    //         startServer();
    //     }
    // }, [serverRootPath, jsCode, server]);









    // const stopServer = ()=> {
    //     if (!server) return;

    //     server.stop();
    //     setServerRunning(false);
    //     console.log('server has stopped');
    // }

    const startServer = ()=> {
        if (!server) return;

        server.start().then((url: string) => {
            setUrl(url);
        });
    }























    const onExitPlayerHandler = () => {
        console.log('player exited');
    };

    const onPlayerMessageHandler = (messageData: JSON) => {
        console.log('onPlayerMessageHandler data: ');
        if (messageData["tmsevent"] && messageData["tmsevent"] === "SCORMCOMMIT" && messageData["data"]) {
            console.log("data saving.....");
            saveSCORMData(messageData["data"]);
        }
        
        
    };

    const loadSCORMPackageData = (packageData: ScormPackageData) => {
        if (packageData.scos && packageData.defaultSco) {
            setScormPackageData(packageData)
        } else {
            getScormPackageData(config.rootOfflineScormPlayer, packageData.packageLocation).then(data=> {
                // console.log('>>>>>>>>>>>>>>>>>>> data: ', data);
                const tmpPackageData = {...packageData, ...data } as ScormPackageData
                setScormPackageData(tmpPackageData);
            });
        }
    };

    // if(!serverRootPath && !scormFilesPath) return <View><Text>loading scorm files....</Text></View>
    

const buildCMI = (scormId: string, scos: [Sco], scoId: string, attempt: number, packageLocation: string) => {
    let selectedSCO: Sco | null = null;
    let _def : any = {};
    let _int : any = {};
    let _obj : any = {};

    //TODO: need to be integrated
    const studentId = 'kamala', studentName = 'Tennakoon, Kamala';

    if (scos) {
        for (let index = 0; index < scos.length; index++) {
            const tmpSCO = scos[index];
            if (scoId && tmpSCO.id === scoId) {
                selectedSCO = tmpSCO;
            }

            const tmpScoId: string = tmpSCO.id!;

            _def[tmpScoId] = buildSCODefinition(studentId, studentName);
            _int[tmpScoId] = "";
            _obj[tmpScoId] = "";
        }
    }

    const _entrysrc = `${packageLocation}/${selectedSCO!.launchSrc}`;
    const _scormdebugging = false; //TODO - apply correct value
    const _scormauto = 0; //TODO - apply correct value
    const _scormid = scormId;
    const _scoid = selectedSCO!.id;
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
        attempt: attempt,
        autocommit: _autocommit,
        masteryoverride: _masteryoverride,
        hidetoc: _hidetoc
    };
}


const buildSCODefinition = (studentId: string, studentName: string) => { 

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
      '{onInjectScormData(' +
      _entrysrc +
      ', ' +
      _def +
      ', ' +
      _cmiobj +
      ', ' +
      _cmiint +
      ', ' +
      _scormdebugging +
      ', ' +
      _scormauto +
      ', ' +
      _scormid +
      ', ' +
      _scoid +
      ', ' +
      _attempt +
      ', ' +
      _autocommit +
      ', ' +
      _masteryoverride +
      ', ' +
      _hidetoc +
      ', ' +
       "'" + JSON.stringify(cmi) + "'" +
      ')}'
    );
  };


    //EVERYTHING IS PERFECT!
    console.log(url);
    console.log(jsCode);
    // console.log(serverRootPath);
    // console.log(scormFilesPath);

    return (
        <>
        { url && <OfflineSCORMPlayer url={url} injectScript={jsCode} onExitHandler={onExitPlayerHandler} onMessageHandler={onPlayerMessageHandler}/>}
        </>
    )
    
}

export default OfflineScormActivity;