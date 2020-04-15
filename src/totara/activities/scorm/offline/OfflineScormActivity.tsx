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
import { ScormBundle, Package, Sco } from "@totara/types/Scorm"
import { Log } from "@totara/lib";
import { saveSCORMActivityData, getSCORMAttemptData } from "./StorageHelper";

type Props = {
    scormBundle: ScormBundle,
    attempt: number,
    scoid?: string,
};

const OfflineScormActivity = ({scormBundle, attempt, scoid}: Props) => {

    const server = useRef<StaticServer>(null);
    const [scormPackageData, setScormPackageData] = useState<Package>(scormBundle.package);
    const [url, setUrl] = useState<string>();
    const [jsCode, setJsCode] = useState<string>();
    
    useEffect(()=>{
        setUpOfflineSCORMPlayer().then(offlineServerPath => {
            if (offlineServerPath && offlineServerPath !== "") {
                return startServer(offlineServerPath);
            } else {
                throw new Error("Cannot fine offline server details.");
            }
        }).then((serverOrigin: string) => {
            setUrl(serverOrigin);
        }).catch(e => {
            Log.debug(e.messageData);
        });
        
       loadSCORMPackageData(scormBundle.package).then(data => {
           setScormPackageData(data);
        }).catch(e => {
            Log.debug(e.messageData);
        });                        
    }, [scormBundle.scorm.id]);

    useEffect(()=> { 
        if(url && scormPackageData) {
            getSCORMAttemptData(scormBundle.scorm.id, attempt).then(cmiData=> {
                if (scormPackageData && scormPackageData.scos && scormPackageData.defaultSco) {
                    const selectedScoId = scoid ? scoid : scormPackageData.defaultSco.id!;
                    const lastActivityCmi = (cmiData && cmiData[selectedScoId]) ? cmiData[selectedScoId] : null;
                    const cmi = buildCMI(scormBundle.scorm.id, scormPackageData.scos, selectedScoId, attempt, scormPackageData.path, scormBundle.scorm.defaultCMI);
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

    const loadSCORMPackageData = (packageData?: Package) => {
        if (packageData && packageData.path) {
            if (packageData.scos && packageData.defaultSco) {
                return Promise.resolve(packageData);
            } else {
                return getSCORMPackageData(`${OfflineSCORMServerRoot}/${packageData.path}`).then(data=> {
                    const tmpPackageData = {...packageData, ...data } as Package;
                    return tmpPackageData;
                });
            }
        } else {
            return Promise.reject("Cannot find offline package data");
        }
    };
    
    const buildCMI = (scormId: string, scos: [Sco], scoId: string, attempt: number, packageLocation: string, defaultCMI: any) => {
        let selectedSCO: Sco | null = null;
        let _def : any = {};
        let _int : any = {};
        let _obj : any = {};
        const defaultsData = JSON.parse(defaultCMI.defaults);
        const interactionsData = JSON.parse(defaultCMI.interactions);
        const objectivesData = JSON.parse(defaultCMI.objectives);

        if (scos) {
            for (let index = 0; index < scos.length; index++) {
                const tmpSCO = scos[index];
                if (scoId && tmpSCO.id === scoId) {
                    selectedSCO = tmpSCO;
                }

                const tmpScoId: string = tmpSCO.id!;

                _def[tmpScoId] = defaultsData[tmpScoId];
                _int[tmpScoId] = interactionsData[tmpScoId];
                _obj[tmpScoId] = objectivesData[tmpScoId];
            }
        }
        
        const _entrysrc = `${packageLocation}/${selectedSCO!.launchSrc}`;
        const _scormdebugging = false;
        const _scormauto = 0;
        const _scormid = scormId;
        const _scoid = selectedSCO!.id;
        const _autocommit = false;
        const _masteryoverride = true;
        const _hidetoc = 1;

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