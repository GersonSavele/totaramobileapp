import { UserProfile } from "@totara/types"
import { NavigationParams } from "react-navigation"
import React, { useContext, useEffect, useState } from "react"
import ResourceManager, { ResourceObserver } from "@totara/core/ResourceManager/ResourceManager";
import { ListRenderItemInfo, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { gutter, ThemeContext } from "@totara/theme";
import { IResource, ResourceState } from "@totara/core/ResourceManager/Resource"
import { TouchableIcon } from "@totara/components"
import ResourceDownloader from "@totara/components/ResourceDownloader";
import { SwipeListView } from 'react-native-swipe-list-view';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"

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
    const [resources, setResources] = useState<IResource[]>([]);

    const onDownloadFileUpdated : ResourceObserver = (received) => {
        if(received.state === ResourceState.Deleted){
            const filter = downloadManager.snapshot.filter(x=>x.id !== received.id);
            setResources(filter);
        }
        else{
            const _resources = downloadManager.snapshot;
            const idx = _resources.findIndex(res=>res.id === received.id);
            _resources[idx] = received;
            setResources(_resources);
        }
    };

    useEffect(()=>{
        downloadManager.attach(onDownloadFileUpdated);
        setResources(downloadManager.snapshot);
        return () =>{
            downloadManager.detach(onDownloadFileUpdated)
        }
    }, [downloadManager]);

    const fileSize = (res: IResource) =>{
        return res.sizeInBytes/1024 < 1000 ? `${Math.round((res.sizeInBytes/1024))} Kb` : `${(res.sizeInBytes/1024/1024).toFixed(2)} Mb`
    }

    const onDeleteItemTap = (id: string) =>{
        ResourceManager.getInstance().delete(id);
    };

    return <SwipeListView
        data={resources}
        disableRightSwipe
        renderItem={ (data: ListRenderItemInfo<IResource>) => (
            <View key={data.item.id} style={[styles.item, {backgroundColor: theme.colorNeutral1}]}>
                <View style={{display: 'flex', width: '100%', flexDirection: 'row'}}>
                    <View style={{display: 'flex', flex: 3, flexDirection: 'column', justifyContent:'center'}}>
                        <Text>{data.item.name}</Text>
                        <Text style={{color: theme.colorNeutral5}}>{`${fileSize(data.item)}`}</Text>
                    </View>
                    <View style={{display: 'flex', flex: 3, alignItems:'flex-end', justifyContent:'center'}}>
                        <ResourceDownloader size={25} progress={data.item.percentCompleted ? data.item.percentCompleted! : 0} mode={data.item.state}/>
                    </View>
                    <View style={{display: 'flex', flex: 1, justifyContent:'flex-end', alignContent:'center'}}>
                        <TouchableIcon size={25} icon={"caret-right"} disabled={true} />
                    </View>
                </View>
                <View style={{
                    backgroundColor: theme.colorNeutral6,
                    width: '100%',
                    height: 1
                }}/>
            </View>
        )}
        renderHiddenItem={ (data) => (
            <View style={[styles.rowBack, {backgroundColor: theme.colorNeutral2}]}>
                <TouchableHighlight style={styles.backButtonDelete} onPress={()=>onDeleteItemTap(data.item.id)} underlayColor={theme.colorNeutral3}>
                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                        <View style={[styles.circle, {backgroundColor: theme.colorAlert}]}>
                            <FontAwesomeIcon size={20} color={theme.colorNeutral2} icon={"trash-alt"} />
                        </View>
                        <Text style={{color: theme.colorAlert}}>Remove</Text>
                    </View>
                </TouchableHighlight>
            </View>
        )}
        rightOpenValue={-75}
    />
};


const styles = StyleSheet.create({
    item:{
        paddingLeft: gutter,
        paddingTop: gutter
    },
    rowBack: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    backButtonDelete: {
        alignItems: 'center',
        bottom: 0,
        top: 0,
        right: 0,
        width: 75,
        justifyContent: 'center',
        position: 'absolute',
    },
    circle: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50/2
    }
});

export default  Downloads;