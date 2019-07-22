import React from "react";
import { View, Animated, StyleSheet } from "react-native";


const TransparentView = ({children} : Props) =>{
    return (
        <View style={styles.animationViewStyle}>
          <Animated.View style={styles.containerStyle}>
            {children}
          </Animated.View>
        </View>);
}

type Props = {
    children? : any
 }

const styles = StyleSheet.create({
    containerStyle: {
        padding: 5,
        borderRadius: 4,
        position: "absolute",
        right: "5%",
        top: "9%",
        bottom: "8%",
        left: "5%",
        backgroundColor: "#FFF"
    },
    animationViewStyle: {
        flex: 1,
        position: "absolute",
        right: 0,
        top: 0,
        bottom: 0,
        left: 0, 
        backgroundColor: 'rgba(52, 52, 52, 0.8)',
    }
});

export default TransparentView;