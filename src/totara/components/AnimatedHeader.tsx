import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { fontSizes, paddings } from "@totara/theme/constants";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { Extrapolate, interpolate } from "react-native-reanimated";
import { useSafeArea } from "react-native-safe-area-view";

const TOPNAVI_H = 50;
const TOPNAVI_OFFSET = 250;

const AnimatedHeader = ({ title, subTitle, scrollValue, leftAction }: { title: string, subTitle: string, scrollValue: any, leftAction: any }) => {
    const safeArea = useSafeArea();
    const isFloating = !!scrollValue;

    const transparentToOpaqueInterpolate = interpolate(scrollValue, {
        inputRange: [TOPNAVI_OFFSET, TOPNAVI_OFFSET + 50],
        outputRange: [0, 1],
        extrapolate: Extrapolate.CLAMP,
    });


    const opaqueToTransparentInterpolate = interpolate(scrollValue, {
        inputRange: [TOPNAVI_OFFSET, TOPNAVI_OFFSET + 50],
        outputRange: [1, 0],
        extrapolate: Extrapolate.CLAMP,
    });

    return <>
        <Animated.View style={{
            paddingTop: safeArea.top,
            marginBottom: isFloating ? -TOPNAVI_H - safeArea.top : 0,
            height: TOPNAVI_H + safeArea.top,
            backgroundColor: Animated.color(255, 255, 255, transparentToOpaqueInterpolate),
            opacity: 1,
            zIndex: 200,
            flexDirection: 'row'
        }}>
            <TouchableOpacity onPress={leftAction} style={{ width: 40, paddingLeft: 10, alignContent: 'center', justifyContent: 'center' }}>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Animated.View style={{ opacity: transparentToOpaqueInterpolate, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', position: 'absolute' }}>
                        <FontAwesomeIcon icon="chevron-left" color={"black"} />
                    </Animated.View>
                    <Animated.View style={{ opacity: opaqueToTransparentInterpolate, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', position: 'absolute' }}>
                        <FontAwesomeIcon icon="chevron-left" color={"white"} />
                    </Animated.View>
                </View>
            </TouchableOpacity>
            <Animated.View style={{ flex: 1, opacity: transparentToOpaqueInterpolate }}>
                <Text style={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: fontSizes.fontSizeM,
                }}>{title}</Text>
                <Text style={{
                    textAlign: 'center',
                    fontSize: fontSizes.fontSizeS,
                    paddingTop: paddings.paddingS
                }}>{subTitle}</Text>
            </Animated.View>
            <View style={{ width: 40 }}
            ></View>
        </Animated.View>
    </>
}

export default AnimatedHeader;