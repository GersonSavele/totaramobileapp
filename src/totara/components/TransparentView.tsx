import React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { resizeByScreenSize } from "@totara/theme";
import { ifIphoneX } from 'react-native-iphone-x-helper'

const TransparentView = ({children} : Props) =>{
    return (
        <SafeAreaView style={styles.transparentViewStyle}>
           <View style={styles.containerStyle}>
            {children}
           </View>
        </SafeAreaView>
    );
}

type Props = {
    children? : Element
 }

const styles = StyleSheet.create({
    containerStyle: {
        flex:1,
        padding: 5,
        borderRadius: 4,
        position: "absolute",
        right: resizeByScreenSize(16, 16, 20, 20),
        left: resizeByScreenSize(16, 16,20, 20),
        ...ifIphoneX({
            top: resizeByScreenSize(72, 72, 72, 72),
            bottom: resizeByScreenSize(72, 72, 72, 72),
        }, {
            top: resizeByScreenSize(32, 32, 32, 32),
            bottom: resizeByScreenSize(32, 32, 32, 32),
        }),
        backgroundColor: "#FFF"
    },
    transparentViewStyle: {
        flex: 1,
        position: "absolute",
        right: 0,
        top: 0,
        bottom: 0,
        left: 0, 
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    }
});

export default TransparentView;