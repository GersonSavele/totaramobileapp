import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { fontSizes, fontWeights, paddings } from "@totara/theme/constants";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, StatusBar } from "react-native";
import Animated, { Extrapolate, interpolate, call, useCode } from "react-native-reanimated";
import { useSafeArea } from "react-native-safe-area-view";

const TOPNAVI_H = 50;
const TOPNAVI_OFFSET = 250;

const AnimatedHeader = ({ title, subTitle, scrollValue, leftAction }: { title: string, subTitle?: string, scrollValue?: any, leftAction: any }) => {
    const safeArea = useSafeArea();
    const isFloating = !!scrollValue;
    const [dark, setDark] = useState(false);

    useCode(() => {
        return call([scrollValue], (values) => {
            const [value] = values;
            setDark((TOPNAVI_OFFSET) < value);
        })
    }, [scrollValue])

    const transparentToOpaqueInterpolate = interpolate(scrollValue, {
        inputRange: [TOPNAVI_OFFSET, TOPNAVI_OFFSET + TOPNAVI_H],
        outputRange: [0, 1],
        extrapolate: Extrapolate.CLAMP,
    });

    const opaqueToTransparentInterpolate = interpolate(scrollValue, {
        inputRange: [TOPNAVI_OFFSET, TOPNAVI_OFFSET + TOPNAVI_H],
        outputRange: [1, 0],
        extrapolate: Extrapolate.CLAMP,
    });

    return <>
        <StatusBar translucent backgroundColor={"translucent"} barStyle={dark ? "dark-content" : "light-content"} />
        <Animated.View style={{
            paddingTop: safeArea.top,
            marginBottom: isFloating ? -TOPNAVI_H - safeArea.top : 0,
            height: TOPNAVI_H + safeArea.top,
            backgroundColor: Animated.color(255, 255, 255, transparentToOpaqueInterpolate),
            opacity: 1,
            zIndex: 200,
            flexDirection: 'row'
        }}>
            <TouchableOpacity onPress={leftAction} style={styles.leftAction}>
                <Animated.View style={[styles.backIcon, { opacity: transparentToOpaqueInterpolate }]} >
                    <FontAwesomeIcon icon="chevron-left" color={"black"} />
                </Animated.View>
                <Animated.View style={[styles.backIcon, { opacity: opaqueToTransparentInterpolate }]}>
                    <FontAwesomeIcon icon="chevron-left" color={"white"} />
                </Animated.View>
            </TouchableOpacity>

            <Animated.View style={{ flex: 1, opacity: transparentToOpaqueInterpolate }}>
                <Text style={styles.title}>{title}</Text>
                {subTitle && <Text style={styles.subTitle}>{subTitle}</Text>}
            </Animated.View>
            <View style={{ width: 40 }}
            ></View>
        </Animated.View>
    </>
}

const styles = StyleSheet.create({
    leftAction: {
        width: 40, paddingLeft: paddings.paddingL, alignContent: 'center', justifyContent: 'center',
        flexDirection: 'row', alignItems: 'center'
    },
    title: {
        textAlign: 'center',
        fontWeight: fontWeights.fontWeightBold,
        fontSize: fontSizes.fontSizeM,
    },
    subTitle: {
        textAlign: 'center',
        fontSize: fontSizes.fontSizeS,
        paddingTop: paddings.paddingS
    },
    backIcon: {
        justifyContent: 'center', alignItems: 'center', alignSelf: 'center', position: 'absolute'
    }

});

export default AnimatedHeader;