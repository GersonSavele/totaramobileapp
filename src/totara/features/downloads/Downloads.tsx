import React /*, { useEffect, useState }*/ from "react"
import { View, Text } from "react-native"
// import DownloadManager, {
//     DownloadableFile,
//     DownloadableFileState,
//     DownloadManagerObserver
// } from "@totara/core/DownloadManager/DownloadManager"
import { UserProfile } from "@totara/types"
import { NavigationParams } from "react-navigation";
// import { faCloudDownloadAlt, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
// import { ProgressCircle, TouchableIcon } from "@totara/components";


type DownloadsTabsProps = {
    profile: UserProfile;
    navigation: NavigationParams;
};

const Downloads = (props: DownloadsTabsProps) => {
    // const url = 'http://mirror.filearena.net/pub/speed/SpeedTest_32MB.dat?_ga=2.215647135.942130395.1584504578-1212100665.1584504578';
    // const [downloadManager] = useState<DownloadManager>(DownloadManager.getInstance);
    // const [files, setFiles] = useState<DownloadableFile[]>([
    //     {id: '1', percentCompleted : 0, url: url, state: DownloadableFileState.Added},
    //     {id: '2', percentCompleted : 0, url: url, state: DownloadableFileState.Added},
    //     {id: '3', percentCompleted : 0, url: url, state: DownloadableFileState.Added},
    //     {id: '4', percentCompleted : 0, url: url, state: DownloadableFileState.Added}
    // ]);
    //
    // useEffect(() => {
    //     // TODO: We should remove following line from inside of useEffect once they update their library
    //     props.navigation.setParams({ title: "Downloads" });
    // }, []);
    //
    // const onDownloadFileUpdated : DownloadManagerObserver = (downloadFile) => {
    //     // console.log(downloadFile);
    //     const idx = files.findIndex(x=>x.id === downloadFile.id);
    //     files[idx] = downloadFile;
    //     setFiles([...files]);
    // }
    //
    // useEffect(()=>{
    //     downloadManager.attach(onDownloadFileUpdated);
    //     return () =>{
    //         downloadManager.detach(onDownloadFileUpdated)
    //     }
    // }, [downloadManager]);
    //
    // const onDownloadPress = (id: string)=> {
    //     const file = files.filter(x => x.id === id)[0];
    //     downloadManager.download(file.id, file.url, file.hash);
    // }
    //
    // return (
    //     <View style={{alignContent: 'center'}}>
    //         <View style={{alignContent: 'center', alignItems: 'center'}}>
    //             {files!.map((downloadableFile)=>{
    //                return (
    //                    <View key={downloadableFile.id} style={{margin: 10}}>
    //                        {(downloadableFile.state === DownloadableFileState.Added) &&
    //                             <TouchableIcon disabled={false} size={30} icon={faCloudDownloadAlt} onPress={() => {
    //                                onDownloadPress(downloadableFile.id);
    //                            }}/>}
    //                        {(downloadableFile.state === DownloadableFileState.Waiting || downloadableFile.state === DownloadableFileState.Downloading) &&
    //                             <ProgressCircle progress={downloadableFile.percentCompleted} size={45}/>}
    //                        {downloadableFile.state === DownloadableFileState.Errored &&
    //                            <TouchableIcon disabled={false} size={30} icon={faExclamationTriangle} onPress={() => {
    //                                onDownloadPress(downloadableFile.id);
    //                            }}/>
    //                        }
    //                    </View>
    //                )
    //             })}
    //         </View>
    //     </View>
    // )

    return <View><Text>Downloads tab</Text></View>
}

export default  Downloads;