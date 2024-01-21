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

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { translate } from "@totara/locale";
import { fontSizes, fontWeights, paddings } from "@totara/theme/constants";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Platform } from "react-native";
import Animated, { Extrapolation, interpolate, interpolateColor, useAnimatedStyle } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const STATUSBAR_HEIGHT = 50;
const TOPNAVI_OFFSET = 250;
const ACTION_WIDTH = 40;
const HEIGHT = TOPNAVI_OFFSET + STATUSBAR_HEIGHT;

type AnimatedHeaderProps = { title: string; subTitle?: string; scrollValue?: any; leftAction: any };

const getIcon = () => (Platform.OS === "ios" ? "chevron-left" : "arrow-left");

const AnimatedHeader = ({ title, subTitle, scrollValue = {}, leftAction }: AnimatedHeaderProps) => {
  const safeArea = useSafeAreaInsets();
  const isFloating = !!scrollValue;
  const [dark, setDark] = useState(false);

  // TODO: migrate this code to new API OR assess remove this
  // useCode(() => {
  //   return call([scrollValue], (values) => {
  //     const [value] = values;
  //     setDark(TOPNAVI_OFFSET < value);
  //   });
  // }, [scrollValue]);

  const transparentToWhiteInterpolate = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        scrollValue.value,
        [TOPNAVI_OFFSET, TOPNAVI_OFFSET + STATUSBAR_HEIGHT],
        ["transparent", "white"]
      )
    };
  });

  const transparentToOpaqueInterpolate = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollValue.value, [TOPNAVI_OFFSET, TOPNAVI_OFFSET + STATUSBAR_HEIGHT], [0, 1], {
        extrapolateRight: Extrapolation.CLAMP
      })
    };
  });

  const animatedStyle2 = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollValue.value, [TOPNAVI_OFFSET, TOPNAVI_OFFSET + STATUSBAR_HEIGHT], [1, 0], {
        extrapolateRight: Extrapolation.CLAMP
      })
    };
  });

  return (
    <>
      <Animated.View
        testID={"animated-header-container"}
        style={[
          {
            paddingTop: safeArea.top,
            marginBottom: isFloating ? -STATUSBAR_HEIGHT - safeArea.top : 0,
            height: STATUSBAR_HEIGHT + safeArea.top,
            opacity: 1,
            zIndex: 200,
            flexDirection: "row"
          },
          transparentToWhiteInterpolate
        ]}>
        <TouchableOpacity
          accessibilityLabel={translate("general.accessibility_go_back")}
          accessibilityRole={"button"}
          testID={"animated-header-backbutton"}
          onPress={leftAction}
          style={styles.leftAction}>
          <Animated.View
            testID={"animated-header-backbutton-black"}
            style={[styles.backIcon, transparentToOpaqueInterpolate]}>
            <FontAwesomeIcon icon={getIcon()} color={"black"} />
          </Animated.View>
          <Animated.View testID={"animated-header-backbutton-white"} style={[styles.backIcon, animatedStyle2]}>
            <FontAwesomeIcon icon={getIcon()} color={"white"} />
          </Animated.View>
        </TouchableOpacity>

        <Animated.View testID={"animated-header-title-container"} style={[{ flex: 1 }, transparentToOpaqueInterpolate]}>
          <Text numberOfLines={1} testID={"animated-header-title"} style={styles.title}>
            {title}
          </Text>
          {subTitle && (
            <Text testID={"animated-header-subtitle"} style={styles.subTitle}>
              {subTitle}
            </Text>
          )}
        </Animated.View>
        <View style={{ width: ACTION_WIDTH }}></View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  leftAction: {
    width: ACTION_WIDTH,
    paddingLeft: paddings.paddingL,
    alignContent: "center",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center"
  },
  title: {
    textAlign: "center",
    fontWeight: fontWeights.fontWeightBold,
    fontSize: fontSizes.fontSizeM
  },
  subTitle: {
    textAlign: "center",
    fontSize: fontSizes.fontSizeS,
    paddingTop: paddings.paddingS
  },
  backIcon: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    position: "absolute"
  }
});

export { AnimatedHeader, HEIGHT };
