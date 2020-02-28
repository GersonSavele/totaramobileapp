import React from "react"
import { View } from "react-native"
import { Activity } from "@totara/types";

const OfflineScormActivity = (props: Props) => {
    console.log(props); //just to supress error
    return <View/>;
}

type Props = {
    activity: Activity
}

export default OfflineScormActivity;