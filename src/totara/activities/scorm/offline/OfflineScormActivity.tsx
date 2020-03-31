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
import React, { useEffect, useState, useRef } from "react"
import { Text } from "react-native"
// @ts-ignore //TODO: THERE'S NO TYPED FOR REACT-NATIVE-STATIC-SERVER https://github.com/futurepress/react-native-static-server/issues/67
import StaticServer from "react-native-static-server";

import OfflineSCORMPlayer from "@totara/activities/scorm/components/OfflineSCORMPlayer";
import { initializeSCORMWebplayer, isSCORMPlayerInitialized, OfflineSCORMServerRoot } from "@totara/activities/scorm/offline/SCORMFileHandler";
import { getSCORMPackageData } from "@totara/activities/scorm/offline"
import { OfflineScormPackage, ScormPackage, Sco } from "@totara/types/Scorm"
import { Log } from "@totara/lib";
import { saveSCORMActivityData, getSCORMAttemptData } from "./StorageHelper";

type Props = {
    storedPackageData: OfflineScormPackage,
    attempt: number,
    scoid?: string,
}

const OfflineScormActivity = (props: Props) => {

    const server = useRef<StaticServer>(null);
    const [scormPackageData, setScormPackageData] = useState<ScormPackage>(props.storedPackageData.package);
    const [url, setUrl] = useState<string>();
    const [jsCode, setJsCode] = useState<string>();
    
    useEffect(()=>{
        setUpOfflineSCORMPlayer().then(offlineServerPath => {
            if (offlineServerPath) {
                startServer(offlineServerPath)
                .then((serverOrigin: string) => setUrl(serverOrigin));
            } else {
                Log.debug("Cannot fine offline server details.");
            }
        }).catch(e => {
            Log.debug(e.messageData);
        })
        
       loadSCORMPackageData(props.storedPackageData.package).then(data => {
           setScormPackageData(data);
        }).catch(e => {
            Log.debug(e.messageData);
        });                        
    }, [props.storedPackageData.scorm.id]);

    useEffect(()=> { 
        if(url && scormPackageData) {
            // TODO - need to pass attem
            getSCORMAttemptData(props.storedPackageData.scorm.id, props.attempt).then(cmiData=> {
                if (scormPackageData && scormPackageData.scos && scormPackageData.defaultSco) {
                    // TODO - need to pass attempt
                    const selectedScoId = props.scoid ? props.scoid : scormPackageData.defaultSco.id!;
                    const lastActivityCmi = (cmiData && cmiData[selectedScoId]) ? cmiData[selectedScoId] : null;
                    const cmi = buildCMI(props.storedPackageData.scorm.id, scormPackageData.scos, selectedScoId, props.attempt, scormPackageData.path);
                    setJsCode(scormDataIntoJsInitCode(cmi, lastActivityCmi));
                }
            });
        }
    }, [scormPackageData, url])

    const stopServer = ()=> {
        if (server && server.current) {
            server.current!.stop();
            server.current = null;
        }
        setUrl(undefined);
    }

    const startServer = (path: string) => {
        if (server && server.current) {
            server.current.stop();
            server.current = null;
        }
        server.current = new StaticServer(0, path, {keepAlive: true, localOnly: true});
        return server.current.start();
    }

    const onExitPlayerHandler = () => {
        stopServer();
    };

    const setUpOfflineSCORMPlayer = () => {
        const _serverPath = OfflineSCORMServerRoot;
        return isSCORMPlayerInitialized().then((isInit) => {
            if (isInit) {
                return _serverPath;
            } else {
                return initializeSCORMWebplayer().then(()=> {
                    return _serverPath;
                });
            }
        })
    };

    const onPlayerMessageHandler = (messageData: any) => {
        if (messageData.tmsevent && messageData.tmsevent === "SCORMCOMMIT" && messageData.result) {
            saveSCORMActivityData(messageData.result).then(()=> {
            });
        }      
    };

    const loadSCORMPackageData = (packageData?: ScormPackage) => {
        if (packageData && packageData.path) {
            if (packageData.scos && packageData.defaultSco) {
                return Promise.resolve(packageData);
            } else {
                return getSCORMPackageData(`${OfflineSCORMServerRoot}/${packageData.path}`).then(data=> {
                    const tmpPackageData = {...packageData, ...data } as ScormPackage
                    return tmpPackageData;
                });
            }
        } else {
            return Promise.reject("Cannot find offline package data");
        }
    };
    
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
    };
    
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
    
    return (<>
        { url && <OfflineSCORMPlayer url={url} injectScript={jsCode} onExitHandler={onExitPlayerHandler} onMessageHandler={onPlayerMessageHandler}/>}
        { !url && <Text>Player loading......</Text>}
        </>);
        
}

export default OfflineScormActivity;