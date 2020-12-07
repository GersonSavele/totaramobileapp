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

import React, { useState, ReactNode } from "react";
import { Animated, View, LayoutChangeEvent, RefreshControl, StyleSheet } from "react-native";
import { TotaraTheme } from "@totara/theme/Theme";
import { deviceScreen } from "@totara/lib/tools";
type ParallaxScrollViewProps = {
  fadeOutForeground?: boolean;
  fadeOutBackground?: boolean;
  onChangeHeaderVisibility: (value: number) => void;
  parallaxHeaderHeight: number;
  renderBackground: () => {};
  titleBar: () => {};
  tabBar: () => {};
  renderContentBackground?: () => {};
  children?: ReactNode;
  onPullToRefresh: () => void;
};
const interpolate = (value: Animated.Value, opts: Animated.InterpolationConfigType) => {
  const x = value.interpolate(opts);
  return x;
};

const scrollY = new Animated.Value(0);

const ParallaxScrollView = ({
  children,
  onChangeHeaderVisibility,
  fadeOutForeground,
  parallaxHeaderHeight,
  renderBackground,
  titleBar,
  tabBar,
  onPullToRefresh
}: ParallaxScrollViewProps) => {
  const [viewHeight, setViewHeight] = useState(deviceScreen.height);
  const [viewWidth, setViewWidth] = useState(deviceScreen.width);

  const updateViewDimensions = (e: LayoutChangeEvent) => {
    const {
      nativeEvent: {
        layout: { width, height }
      }
    } = e;
    if (width !== viewWidth || height !== viewHeight) {
      setViewWidth(width);
      setViewHeight(height);
    }
  };

  const onScrollForHeaderVisibility = (e: any) => {
    const y = e.nativeEvent.contentOffset.y - (parallaxHeaderHeight + 45);
    onChangeHeaderVisibility(y);
  };

  const containerStyles = [{ backgroundColor: TotaraTheme.colorAccent }];

  return (
    <View style={[parallaxScrollViewStyles.container]} onLayout={(e) => updateViewDimensions(e)}>
      <Animated.View
        style={[
          parallaxScrollViewStyles.backgroundImage,
          {
            backgroundColor: TotaraTheme.colorAccent,
            height: parallaxHeaderHeight,
            width: viewWidth,
            opacity: interpolate(scrollY, {
              inputRange: [0, parallaxHeaderHeight * (1 / 2), parallaxHeaderHeight * (3 / 4), parallaxHeaderHeight],
              outputRange: [1, 0.9, 0.9, 0.9],
              extrapolate: "clamp"
            }),
            transform: [
              {
                translateY: interpolate(scrollY, {
                  inputRange: [0, parallaxHeaderHeight],
                  outputRange: [0, 0],
                  extrapolate: "clamp"
                })
              },
              {
                scale: interpolate(scrollY, {
                  inputRange: [-viewHeight, 0],
                  outputRange: [5, 1],
                  extrapolate: "clamp"
                })
              }
            ]
          }
        ]}>
        <View>{renderBackground()}</View>
      </Animated.View>
      {React.cloneElement(
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          onMomentumScrollEnd={onScrollForHeaderVisibility}
          refreshControl={<RefreshControl refreshing={false} onRefresh={onPullToRefresh} />}
        />,
        {
          style: [parallaxScrollViewStyles.scrollView],
          scrollEventThrottle: 10,
          stickyHeaderIndices: [2],
          onScroll: Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
            useNativeDriver: true
          })
        },
        <View style={parallaxScrollViewStyles.parallaxHeaderContainer}>
          <Animated.View
            style={[
              parallaxScrollViewStyles.parallaxHeader,
              {
                height: parallaxHeaderHeight,
                opacity: fadeOutForeground
                  ? interpolate(scrollY, {
                      inputRange: [
                        0,
                        parallaxHeaderHeight * (1 / 2),
                        parallaxHeaderHeight * (3 / 4),
                        parallaxHeaderHeight
                      ],
                      outputRange: [1, 0.3, 0.1, 0],
                      extrapolate: "clamp"
                    })
                  : 1
              }
            ]}>
            <View style={{ height: parallaxHeaderHeight }} />
          </Animated.View>
        </View>,
        <View style={[containerStyles]}>{titleBar()}</View>,
        <View style={[containerStyles]}>{tabBar()}</View>,
        <View style={[containerStyles]}>{children}</View>,
        <View />
      )}
    </View>
  );
};

const parallaxScrollViewStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent"
  },
  parallaxHeaderContainer: {
    backgroundColor: "transparent",
    overflow: "hidden"
  },
  parallaxHeader: {
    backgroundColor: "transparent",
    overflow: "hidden"
  },
  backgroundImage: {
    position: "absolute",
    backgroundColor: "transparent",
    overflow: "hidden",
    top: 0
  },
  scrollView: {
    backgroundColor: "transparent",
    width: deviceScreen.width
  }
});

export default ParallaxScrollView;
