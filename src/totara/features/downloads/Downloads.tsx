import { UserProfile } from "@totara/types"
import { NavigationParams } from "react-navigation"
import React, { useContext, useEffect, useState } from "react"
import ResourceManager, { ResourceObserver } from "@totara/core/ResourceManager/ResourceManager";
import { StyleSheet, Text, View } from "react-native";
import { gutter, ThemeContext } from "@totara/theme";
import { IResource, ResourceState } from "@totara/core/ResourceManager/Resource"
import { faCaretRight } from "@fortawesome/free-solid-svg-icons"
import { TouchableIcon } from "@totara/components"
import ResourceDownloader from "@totara/components/ResourceDownloader"
import { TotaraTheme } from "@totara/theme/Theme"

type DownloadsTabsProps = {
    profile: UserProfile;
    navigation: NavigationParams;
};

const Downloads = (props: DownloadsTabsProps) => {
    const [theme] = useContext(ThemeContext);

    useEffect(() => {
        // TODO: We should remove following line from inside of useEffect once they update their library
        props.navigation.setParams({ title: "Downloads" });
    }, []);

    const [downloadManager] = useState<ResourceManager>(ResourceManager.getInstance());
    const [resources, setResources] = useState<IResource[]>(ResourceManager.getInstance().snapshot);
    const onDownloadFileUpdated : ResourceObserver = (received) => {
        // console.log(received);
        const idx = resources.findIndex(res=>res.id === received.id);
        resources[idx] = received;
        setResources([...resources]);
    }

    useEffect(()=>{
        downloadManager.attach(onDownloadFileUpdated);
        return () =>{
            downloadManager.detach(onDownloadFileUpdated)
        }
    }, [downloadManager]);

    return <View>
        {
            resources.map((res: IResource)=>{
                const fileSize = res.sizeInBytes/1024 < 1000 ? `${Math.round((res.sizeInBytes/1024))} Kb` : `${(res.sizeInBytes/1024/1024).toFixed(2)} Mb`
                return <View key={res.id} style={styles.item}>
                    <View style={{display: 'flex', width: '100%', flexDirection: 'row'}}>
                        <View style={{display: 'flex', flex: 3, flexDirection: 'column', justifyContent:'center'}}>
                            <Text>{res.name}</Text>
                            <Text style={{color: theme.colorNeutral5}}>{`${fileSize}`}</Text>
                        </View>
                        <View style={{display: 'flex', flex: 3, alignItems:'flex-end', justifyContent:'center'}}>
                            <ResourceDownloader size={25} downloading={false} progress={res.percentCompleted ? res.percentCompleted! : 0} downloadOK={res.state === ResourceState.Completed}/>
                        </View>
                        <View style={{display: 'flex', flex: 1, justifyContent:'flex-end', alignContent:'center'}}>
                            <TouchableIcon size={25} icon={faCaretRight} disabled={true} />
                        </View>
                    </View>
                    <View style={{
                        backgroundColor: theme.colorNeutral6,
                        width: '100%',
                        height: 1
                    }}/>
                </View>
            })
        }
    </View>
}

const styles = StyleSheet.create({
    item:{
        width: '100%',
        padding: gutter
    }
});

export default  Downloads;