import { View } from "react-native"
import { ProgressCircle, TouchableIcon } from "@totara/components/index"
import { faCloud, faCloudDownloadAlt } from "@fortawesome/free-solid-svg-icons"
import React from "react";

type ResourceDownloader = {
    downloading: boolean,
    downloadOK?: boolean,
    onDownloadTap(): void,
    progress: number,
}

const ResourceDownloader = (props: ResourceDownloader) =>{

    return (
        <View>
            {props.downloading ? <ProgressCircle indeterminate size={35} progress={props.progress}/>

                :

                (
                    props.downloadOK ?
                        <TouchableIcon size={35} icon={faCloud} disabled={true} />
                        :
                        <TouchableIcon size={35} icon={faCloudDownloadAlt} disabled={props.downloading} onPress={props.onDownloadTap} />

                )
            }
        </View>
    );
}

export default ResourceDownloader;