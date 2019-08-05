import React from "react";
import { View, StyleSheet } from "react-native";

const ModalContainer = ({children} : Props) =>{
    return (
        <View style = {styles.subContainerStyle}>
             <View style = {styles.wrapContainerStyle}>
                {children}
            </View>
        </View>
    );
}

type Props = {
    children? : Element
 }

const styles = StyleSheet.create({
    subContainerStyle: {
        flex: 1,
        flexDirection:"column",
        marginTop: "17%",
        marginLeft: "5%",
        marginRight: "5%",
        marginBottom:"17%",
        alignItems: 'center',
        justifyContent: 'center', 
        paddingHorizontal: 16,
        },
    wrapContainerStyle : {
        position: 'absolute',
        alignItems:"center"
    }
});

export default ModalContainer;