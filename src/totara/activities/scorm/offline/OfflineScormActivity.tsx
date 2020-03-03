import React, { useEffect, useState } from "react"
import { View, Text, Button } from "react-native"
import { Activity } from "@totara/types";

// @ts-ignore //TODO: THERE'S NO TYPED FOR REACT-NATIVE-STATIC-SERVER https://github.com/futurepress/react-native-static-server/issues/67
import StaticServer from 'react-native-static-server';

const OfflineScormActivity = (props: Props) => {
    const serverPort = 7777;
    const [serverRootPath, setServerRootPath] = useState<string>();
    const [scormFilesPath, setScormFilesPath] = useState<string>();
    const [jsCode, setJsCode] = useState<string>();
    const [url, setUrl] = useState<string>();

    const [server, setServer] = useState<StaticServer>();
    const [serverRunning, setServerRunning] = useState<boolean>();




    useEffect(()=>{
        const copyServerRootPath = async() =>{
            return new Promise<string>(resolve =>
                setTimeout(() => resolve("PATH/TO/SERVER/ROOT"), 1000)
            );
        }

        const setupScormData = async() =>{
            return new Promise<string>(resolve =>
                setTimeout(() => resolve("PATH/TO/EXTRACTED/FILES"), 1000)
            );
        }

        Promise.all([copyServerRootPath(), setupScormData()]).then(result=>{
           const [_serverRootPath, _scormFilesPath] = result;
           setServerRootPath(_serverRootPath);
           setScormFilesPath(_scormFilesPath);
        });
    }, [props.activity.id]);





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














    if(!serverRootPath && !scormFilesPath) return <View><Text>loading scorm files....</Text></View>

    if(!server) return <View><Text>loading server....</Text></View>

    console.log(url);
    console.log(jsCode);
    console.log(serverRootPath);
    console.log(scormFilesPath);

    return <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <Text>Server is {serverRunning? 'running ' : 'not running'}</Text>
        <Button onPress={serverRunning ? stopServer: startServer} title={serverRunning ? 'Stop': 'Start'}/>

        {url && <Text>URL is {url} and jscode is {jsCode} now we can load the player</Text>}
    </View>;
}

type Props = {
    activity: Activity
}

export default OfflineScormActivity;