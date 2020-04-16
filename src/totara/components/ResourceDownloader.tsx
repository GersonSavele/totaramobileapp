import React, { useContext, useState } from "react";
import { Text, Image, TouchableOpacity, ViewStyle, StyleSheet } from "react-native";
import * as Progress from "react-native-progress";

import { ThemeContext } from "@totara/theme";

type ResourceDownloaderProps = {
    mode: "downloading" | "downloaded" | "none" | undefined,
    onPress?: () => void,
    progress: number,
    size?: number,
    style?: ViewStyle
};

/*
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
*/
const DownloadIcon = {
    solid: require("@resources/images/tabbar/downloads_solid.png"),
    regular: require("@resources/images/tabbar/downloads_regular.png")
};

const ResourceDownloader = ({mode, onPress, progress, size, style}: ResourceDownloaderProps) =>{
    const [theme] = useContext(ThemeContext);
    const [iconSource, setIconSource] = useState(DownloadIcon.regular);
    if (mode === "downloading") {
        // return (
        // <Progress.Circle showsText animated size={size ? size : 40} 
        //     progress={progress/100}
        //     formatText={() => (`${progress.toFixed(0)}%`)}
        // />);

        return (
        <Progress.Circle progress={progress/100}
            size={size}
            unfilledColor={theme.colorNeutral4}
            color={theme.colorLink}
            thickness={3}
            borderWidth={0}
            indeterminate={false}
            formatText={() =>  "X"}
            showsText={true}
            textStyle={{fontSize: theme.textSmall.fontSize, color: theme.textColorDark, fontWeight: "bold"}}
            />);
    } else {
        return (
            <TouchableOpacity onPress={onPress}> 
                <Image source={iconSource} style={[{tintColor: theme.colorLink, width: 24, height: 24 }, style]} resizeMode='contain' />
            </TouchableOpacity>
       );
    }
    
}


export default ResourceDownloader;