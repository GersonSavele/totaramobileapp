import React, { useContext } from "react";
import { Image, TouchableOpacity, ImageStyle } from "react-native";
import * as Progress from "react-native-progress";

import { ThemeContext, gutter } from "@totara/theme";
import { ResourceState } from "@totara/types/Resource";
import { TotaraTheme } from "@totara/theme/Theme";

type ResourceDownloaderProps = {
  resourceState?: ResourceState;
  onPress?: () => void;
  progress: number;
  size?: number;
  style?: ImageStyle;
};

const DownloadIcon = {
  solid: require("@resources/images/tabbar/downloads_solid.png"),
  regular: require("@resources/images/tabbar/downloads_regular.png")
};

const ResourceDownloaderComponent = ({
  resourceState,
  progress,
  size
}: ResourceDownloaderProps) => {
  const [theme] = useContext(ThemeContext);
  if (resourceState === ResourceState.Downloading) {
    return (
      <Progress.Circle
        progress={progress / 100}
        size={size}
        unfilledColor={theme.colorNeutral4}
        color={theme.colorLink}
        thickness={2}
        borderWidth={0}
        indeterminate={false}
        formatText={() => progress.toFixed(0)}
        showsText={true}
        textStyle={{
          fontSize: theme.textSmall.fontSize,
          lineHeight: theme.textSmall.fontSize,
          color: theme.textColorDark,
          fontWeight: "bold",
          textAlign: "center"
        }}
      />
    );
  } else {
    const iconColor =
      resourceState === ResourceState.Completed
        ? TotaraTheme.colorNeutral3
        : TotaraTheme.colorLink;

    return (
      <Image
        source={DownloadIcon.solid}
        style={[{ tintColor: iconColor, height: size, width: size }]}
        resizeMode="contain"
      />
    );
  }
};

const ResourceDownloader = ({
  resourceState,
  onPress,
  progress,
  size,
  style
}: ResourceDownloaderProps) => {
  return (
    <TouchableOpacity
      onPress={() => {
        onPress && onPress();
      }}
      disabled={!onPress}
      style={[{ padding: gutter, alignSelf: "center" }, style]}>
      <ResourceDownloaderComponent
        resourceState={resourceState}
        size={size}
        progress={progress}
      />
    </TouchableOpacity>
  );
};

export default ResourceDownloader;
