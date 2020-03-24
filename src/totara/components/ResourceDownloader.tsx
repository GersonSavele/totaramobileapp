import { View } from "react-native"
import { TouchableIcon } from "@totara/components/index"
import { faCloudDownloadAlt } from "@fortawesome/free-solid-svg-icons"
import React from "react";
import * as Progress from "react-native-progress";

type ResourceDownloader = {
    downloading: boolean,
    downloadOK?: boolean,
    onDownloadTap?(): void,
    progress: number,
    size?: number
}

const ResourceDownloader = (props: ResourceDownloader) =>{
    const size = props.size? props.size! : 40;
    return (
        <View style={{height: size, width: size, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            {props.downloading ? <Progress.Circle showsText animated size={size} progress={props.progress/100}
                                                  formatText={() => {
                                                      return `${props.progress.toFixed(0)}%`
                                                  }}/> :
                (
                    props.downloadOK ? <TouchableIcon size={size} icon={faCloudDownloadAlt} color={'green'} disabled={true} /> :
                        <TouchableIcon size={size} icon={faCloudDownloadAlt} disabled={props.downloading} onPress={props.onDownloadTap} />

                )
            }
        </View>
    );
}

export default ResourceDownloader;