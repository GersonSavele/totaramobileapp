import React, { useEffect, useState } from "react"
import { View, Text, Button } from "react-native"
import { Activity } from "@totara/types";

// @ts-ignore //TODO: THERE'S NO TYPED FOR REACT-NATIVE-STATIC-SERVER https://github.com/futurepress/react-native-static-server/issues/67
import StaticServer from 'react-native-static-server';
import OfflineSCORMPlayer from "@totara/activities/scorm/components/OfflineSCORMPlayer"
import { initializeSCORMWebplayer } from "@totara/activities/scorm/offline/SCORMFileHandler"
import { OfflineScormPackage } from "@totara/types/Scorm"


type Props = {
    storedPackageData: OfflineScormPackage
}


const OfflineScormActivity = (props: Props) => {

    //COPY SERVER FILES
    //EXTRACT THE ZIP FILE
    //PREPARE DATA AND JSCODE
    //START THE SERVER

    console.log(props);


    const serverPort = 7777;
    const [serverRootPath, setServerRootPath] = useState<string>();
    const [scormFilesPath, setScormFilesPath] = useState<string>();
    const [jsCode, setJsCode] = useState<string>();
    const [url, setUrl] = useState<string>();

    const [server, setServer] = useState<StaticServer>();
    const [serverRunning, setServerRunning] = useState<boolean>();

    useEffect(()=>{

        initializeSCORMWebplayer().then(()=>{
            setServerRootPath('/PATH/');
        }).catch((error)=>{
            console.log(error);
        })
    }, [props.storedPackageData.scorm.id]);




    //ONCE WE GOT scormFilesPath, LOAD THE JSCODE
    useEffect(()=>{
        const loadJsCode = async() =>{
            return new Promise<string>(resolve =>
                setTimeout(() => resolve("JSCODE LOADED"), 1000)
            );
        }

        if(scormFilesPath && !jsCode){
            loadJsCode().then((_jsCode: string)=>{
                setJsCode(_jsCode);
            })
        }

    }, [scormFilesPath]);

    //ONCE WE GOT serverRootPath, INITIALIZES SERVER
    useEffect(()=>{
        if(serverRootPath && !server){
            const _server = new StaticServer(serverPort, serverRootPath, {keepAlive: true, localOnly: true});
            setServer(_server);
            startServer();
        }
    }, [serverRootPath]);

    //ONCE WE GOT serverRootPath, jsCode and server
    useEffect(()=>{
        if(serverRootPath && jsCode && server){
            startServer();
        }
    }, [serverRootPath, jsCode, server]);









    const stopServer = ()=> {
        if (!server) return;

        server.stop();
        setServerRunning(false);
        console.log('server has stopped');
    }

    const startServer = ()=> {
        if (!server) return;

        server.start().then((url: string) => {
            setUrl(url);
            setServerRunning(true);
            console.log('server is running');
        });
    }
























    //EVERTHING IS PERFECT!  HAPPY END

    const onExitPlayerHandler = () => {
        console.log('player exited');
    }

    const onPlayerMessageHandler = (messageData: string) => {
        console.log('onPlayerMessageHandler data: ')
        console.log(messageData);
    }


    if(!serverRootPath && !scormFilesPath) return <View><Text>loading scorm files....</Text></View>
    if(!server) return <View><Text>loading server....</Text></View>

    console.log(url);
    console.log(jsCode);
    console.log(serverRootPath);
    console.log(scormFilesPath);

    return <OfflineSCORMPlayer url={url!} injectScript={jsCode} onExitHandler={onExitPlayerHandler} onMessageHandler={onPlayerMessageHandler}/>
}

export default OfflineScormActivity;