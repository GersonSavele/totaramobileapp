import React from "react";
import {Image, View, Text, StyleSheet} from "react-native";

const notificationsSolid = require("@resources/images/tabbar/notifications_solid.png");
const notificationsRegular = require("@resources/images/tabbar/notifications_solid.png");

type notificationBellProps = {
    active: boolean,
    tintColor: string,
    counting: number
}

const NotificationBell = (props: notificationBellProps) => {
    return <View style={styles.container}>
        <View style={styles.icon}>
            <Image
                source={props.active ? notificationsSolid : notificationsRegular}
                style={{tintColor: props.tintColor, width: 24, height: 24}}
                resizeMode='contain'/>
        </View>
        {props.counting > 0 && (
            <View style={styles.counting}>
                <View style={styles.countingCircle}>
                    <Text numberOfLines={1} style={{...styles.countingNumber}}>{props.counting > 99 ? '99+' : props.counting}</Text>
                </View>
            </View>
        )
        }
    </View>;
};


const styles = StyleSheet.create({
    container:{
        width: 36,
    },
    icon:{
        minWidth: 24
    },
    counting:{
        width: '100%',
        position: 'absolute',
        alignItems: 'flex-end',
        justifyContent: 'flex-end'
    },
    countingCircle: {
        paddingLeft: 4,
        paddingRight: 4,
        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16/2,
        flex: 1,
    },
    countingNumber: {
        color: 'white',
        fontSize: 12
    }
});

export default NotificationBell;
