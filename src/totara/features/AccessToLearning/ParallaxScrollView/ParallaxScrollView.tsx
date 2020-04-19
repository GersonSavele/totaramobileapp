/**
 * This file is part of Totara Mobile
 *
 * Copyright (C) 2019 onwards Totara Learning Solutions LTD
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @author Tharaka Dushmantha <tharaka.dushmantha@totaralearning.com>
 *
 *
 */

import React, { useState, ReactNode, useContext } from "react";
import {
  Animated,
  Dimensions,
  View,
  StyleSheet,
  LayoutChangeEvent
} from "react-native";
import { ThemeContext, normalize } from "@totara/theme";

type Props = {
  fadeOutForeground?: boolean;
  fadeOutBackground?: boolean;
  onChangeHeaderVisibility: (value: number) => void;
  parallaxHeaderHeight: number | 300;
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
    <View style={[styles.container]} onLayout={e => updateViewDimensions(e)}>
      <Animated.View
        style={[
          styles.backgroundImage,
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
        ]}
      >
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
          style: [styles.scrollView],
          scrollEventThrottle: 10,
          stickyHeaderIndices: [2],
          onScroll: Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
            // if it is added listener, it will be trigger all the event when user scrolling. May be it will be use-full for the future.
            //   { useNativeDriver: true, listener: onScroll }
          )
        },
        <View style={styles.parallaxHeaderContainer}>
          <Animated.View
            style={[
              styles.parallaxHeader,
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
            ]}
          >
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

const styles = StyleSheet.create({
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
    backgroundColor: "transparent"
  }
});

export default ParallaxScrollView;
