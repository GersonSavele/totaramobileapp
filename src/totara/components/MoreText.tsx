import ViewMoreText from 'react-native-view-more-text';
import React, { useContext } from 'react';
import { StyleSheet, Text, View } from "react-native";
import { ThemeContext } from '@totara/theme';

const MoreText = (props: {longText: string}) =>{
    const [theme] = useContext(ThemeContext);
    const renderViewMore = (event: () => void) => {
        return(
            <View style={styles.moreLessContainer}>
                <Text onPress={event} style={{color: theme.colorLink}}>more</Text>
            </View>
        )
    }

    const renderViewLess = (event: () => void) => {
        return(
            <View style={styles.moreLessContainer}>
                <Text style={{color: theme.colorLink}} onPress={event} >less</Text>
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
})


export default MoreText;