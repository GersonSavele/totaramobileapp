/**
 * This file is part of Totara Enterprise.
 *
 * Copyright (C) 2020 onwards Totara Learning Solutions LTD
 *
 * Totara Enterprise is provided only to Totara Learning Solutions
 * LTD’s customers and partners, pursuant to the terms and
 * conditions of a separate agreement with Totara Learning
 * Solutions LTD or its affiliate.
 *
 * If you do not have an agreement with Totara Learning Solutions
 * LTD, you may not access, use, modify, or distribute this software.
 * Please contact [sales@totaralearning.com] for more information.
 */

import React, { useContext } from "react";
import { Image, TouchableOpacity, ImageStyle } from "react-native";
import * as Progress from "react-native-progress";

import { ThemeContext, gutter } from "@totara/theme";
import { ResourceState } from "@totara/types/Resource";
import { TotaraTheme } from "@totara/theme/Theme";
import { TEST_IDS_RESOURCE } from "@totara/lib/testIds";

type ResourceDownloaderProps = {
  resourceState?: ResourceState;
  onPress?: () => void;
  progress: number;
  size?: number;
  style?: ImageStyle;
  testID?: string;
  accessibilityLabel?: string;
};

const DownloadIcon = {
  solid: require("@resources/icons/tabbar/downloads_solid.png"),
  regular: require("@resources/icons/tabbar/downloads_regular.png")
};

const ResourceDownloaderComponent = ({ resourceState, progress, size }: ResourceDownloaderProps) => {
  const [theme] = useContext(ThemeContext);
  if (resourceState === ResourceState.Downloading) {
    return (
      <Progress.Circle
        testID={TEST_IDS_RESOURCE.DOWNLOADING}
        progress={progress / 100}
        size={size}
        unfilledColor={theme.colorNeutral4}
        color={theme.colorLink}
        thickness={2}
        borderWidth={0}
        indeterminate={false}
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
    const iconColor = resourceState === ResourceState.Completed ? TotaraTheme.colorNeutral3 : TotaraTheme.colorLink;
    const imageTestId =
      resourceState === ResourceState.Completed ? TEST_IDS_RESOURCE.DOWNLOADED : TEST_IDS_RESOURCE.DOWNLOAD;

    return (
      <Image
        testID={imageTestId}
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
  style,
  testID,
  accessibilityLabel = ""
}: ResourceDownloaderProps) => {
  return (
    <TouchableOpacity
      testID={testID}
      onPress={() => {
        onPress && onPress();
      }}
      accessibilityLabel={accessibilityLabel}
      disabled={!onPress}
      style={[{ padding: gutter, alignSelf: "center" }, style]}>
      <ResourceDownloaderComponent resourceState={resourceState} size={size} progress={progress} />
    </TouchableOpacity>
  );
};

export default ResourceDownloader;
