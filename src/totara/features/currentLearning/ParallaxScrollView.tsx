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
 *
 */

import React, { useState, ReactNode, useContext } from "react";
import { Animated, Dimensions, View, LayoutChangeEvent } from "react-native";
import { ThemeContext, normalize } from "@totara/theme";
import { parallaxScrollViewStyles } from "./currentLearningStyles";

type Props = {
  fadeOutForeground?: boolean;
  fadeOutBackground?: boolean;
  onChangeHeaderVisibility: (value: number) => void;
  parallaxHeaderHeight: number;
  renderBackground: () => {};
  titleBar: () => {};
  tabBar: () => {};
  renderContentBackground?: () => {};
  children?: ReactNode;
};
const interpolate = (
  value: Animated.Value,
  opts: Animated.InterpolationConfigType
) => {
  const x = value.interpolate(opts);
  return x;
};

const window = Dimensions.get("window");
const scrollY = new Animated.Value(0);

const ParallaxScrollView = ({
  children,
  onChangeHeaderVisibility,
  fadeOutForeground,
  parallaxHeaderHeight,
  renderBackground,
  titleBar,
  tabBar
}: Props) => {
  const [viewHeight, setViewHeight] = useState(window.height);
  const [viewWidth, setViewWidth] = useState(window.width);
  const [theme] = useContext(ThemeContext);

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

  const onScroll = (e: LayoutChangeEvent) => {
    const y = e.nativeEvent.contentOffset.y - (p + normalize(40));
    onChangeHeaderVisibility(y);
  };

  const p = parallaxHeaderHeight;
  const containerStyles = [{ backgroundColor: theme.colorAccent }];
  return (
    // Background image scrolling...
    <View
      style={[parallaxScrollViewStyles.container]}
      onLayout={(e) => updateViewDimensions(e)}>
      <Animated.View
        style={[
          parallaxScrollViewStyles.backgroundImage,
          {
            backgroundColor: theme.colorAccent,
            height: parallaxHeaderHeight,
            width: viewWidth,
            opacity: interpolate(scrollY, {
              inputRange: [0, p * (1 / 2), p * (3 / 4), p],
              outputRange: [1, 0.9, 0.9, 0.7],
              extrapolate: "clamp"
            }),
            transform: [
              {
                translateY: interpolate(scrollY, {
                  inputRange: [0, p],
                  outputRange: [0, -(p / 5)],
                  extrapolateLeft: "clamp"
                })
              },
              {
                scale: interpolate(scrollY, {
                  inputRange: [-viewHeight, 1],
                  outputRange: [4, 1],
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
          onScrollEndDrag={onScroll}
          onMomentumScrollEnd={onScroll}
          showsVerticalScrollIndicator={false}
          bounces={false}
        />,
        {
          style: [parallaxScrollViewStyles.scrollView],
          scrollEventThrottle: 10,
          stickyHeaderIndices: [2],
          onScroll: Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )
        },
        <View style={parallaxScrollViewStyles.parallaxHeaderContainer}>
          <Animated.View
            style={[
              parallaxScrollViewStyles.parallaxHeader,
              {
                height: parallaxHeaderHeight,
                opacity: fadeOutForeground
                  ? interpolate(scrollY, {
                      inputRange: [0, p * (1 / 2), p * (3 / 4), p],
                      outputRange: [1, 0.3, 0.1, 0],
                      extrapolate: "clamp"
                    })
                  : 1
              }
            ]}>
            <View style={{ height: parallaxHeaderHeight }}></View>
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

export default ParallaxScrollView;
