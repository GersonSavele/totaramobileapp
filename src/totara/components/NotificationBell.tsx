import React from "react";
import {Image, View, Text, StyleSheet} from "react-native";
import {tabBar} from "@totara/theme/constants";

const notificationsSolid = require("@resources/images/tabbar/notifications_solid.png");
const notificationsRegular = require("@resources/images/tabbar/notifications_solid.png");

type notificationBellProps = {
    active: boolean,
    tintColor: string,
    counting: number
}

const NotificationBell = ({active, tintColor, counting}: notificationBellProps) => {
    return <View style={styles.container}>
        <View>
            <Image
                source={active ? notificationsSolid : notificationsRegular}
                style={[styles.icon, {tintColor: tintColor}]}
                resizeMode='contain'/>
        </View>
        {counting > 0 && (
            <View style={styles.counting}>
                <View style={styles.countingCircle}>
                    <Text numberOfLines={1} style={{...styles.countingNumber}}>{counting > 99 ? '99+' : counting}</Text>
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
        width: tabBar.icon.width,
        height: tabBar.icon.height
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
