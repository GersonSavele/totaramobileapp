import React, { useContext } from "react";
import { Image, TouchableOpacity, ImageStyle } from "react-native";
import * as Progress from "react-native-progress";

import { ThemeContext } from "@totara/theme";
import { ResourceState } from "@totara/core/ResourceManager/Resource";

type ResourceDownloaderProps = {
    mode?: ResourceState
    onPress?: () => void,
    progress: number,
    size?: number,
    style?: ImageStyle
};

const DownloadIcon = {
    solid: require("@resources/images/tabbar/downloads_solid.png"),
    regular: require("@resources/images/tabbar/downloads_regular.png")
};

const RosourceDownloaderComponent = ({mode, progress, size, style}: ResourceDownloaderProps) => {
    const [theme] = useContext(ThemeContext);
    if (mode === ResourceState.Downloading) {
        return (
        <Progress.Circle progress={progress/100}
            size={size}
            unfilledColor={theme.colorNeutral4}
            color={theme.colorLink}
            thickness={2}
            borderWidth={0}
            indeterminate={false}
            formatText={() =>  ""}
            showsText={true}
            textStyle={{fontSize: theme.textSmall.fontSize, lineHeight: theme.textSmall.fontSize, color: theme.textColorDark, fontWeight: "bold", textAlign: "center"}}
            />);
    } else {
        const iconSource = mode === ResourceState.Completed ? DownloadIcon.solid : DownloadIcon.regular;
        return <Image source={iconSource} style={[{tintColor: theme.colorLink, height: size}, style]} resizeMode='contain' />;
    }  
};

const ResourceDownloader = ({mode, onPress, progress, size, style}: ResourceDownloaderProps) =>{
    return (
    <TouchableOpacity onPress={()=> {onPress && onPress()}} disabled={!onPress}>
        <RosourceDownloaderComponent mode={mode} size={size} style={style} progress={progress} />
    </TouchableOpacity>
    );
};

export default ResourceDownloader;