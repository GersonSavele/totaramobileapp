import { View } from "react-native"
import { TouchableIcon } from "@totara/components/index";
import React, { useContext } from "react";
import * as Progress from "react-native-progress";
import { ThemeContext } from "@totara/theme"

type ResourceDownloader = {
    downloading: boolean,
    downloadOK?: boolean,
    onDownloadTap?(): void,
    progress: number,
    size?: number
}

const ResourceDownloader = (props: ResourceDownloader) =>{
    const [theme] = useContext(ThemeContext);
    const size = props.size? props.size! : 40;
    return (
        <View style={{height: size, width: size, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            {props.downloading ? <Progress.Circle showsText animated size={size} progress={props.progress/100}
                                                  formatText={() => {
                                                      return `${props.progress.toFixed(0)}%`
                                                  }}/> :
                (
                    props.downloadOK ? <TouchableIcon size={size} icon="cloud-download-alt" color={theme.colorSuccess} disabled={true} /> :
                        <TouchableIcon size={size} icon="cloud-download-alt" disabled={props.downloading} onPress={props.onDownloadTap} />

                )
            }
        </View>
    );
}

export default ResourceDownloader;