import ViewMoreText from 'react-native-view-more-text';
import React from 'react';
import { StyleSheet, Text, View } from "react-native";

const MoreText = (props: {longText: string}) =>{
    const renderViewMore = (event: () => void) => {
        return(
            <View style={styles.moreLessContainer}>
                <Text onPress={event} style={styles.moreLess}>more</Text>
            </View>
        )
    }

    const renderViewLess = (event: () => void) => {
        return(
            <View style={styles.moreLessContainer}>
                <Text style={styles.moreLess} onPress={event} >less</Text>
            </View>
        )
    }

    return(
        <ViewMoreText
            numberOfLines={5}
            renderViewMore={renderViewMore}
            renderViewLess={renderViewLess}
            textStyle={{textAlign: 'justify'}} >
            <Text>
                {props.longText}
            </Text>
        </ViewMoreText>
    )
}


const styles = StyleSheet.create({
    moreLessContainer: {
        display: 'flex', width: '100%', alignItems:"flex-end"
    },

    moreLess: {
        color: 'blue'
    }
})


export default MoreText;