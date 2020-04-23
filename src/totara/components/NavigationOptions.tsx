import { IconDefinition } from "@fortawesome/fontawesome-common-types";
import { normalize } from "@totara/theme";
import { TouchableIcon } from "@totara/components/index";
import {Theme} from "@totara/types";
import React from "react";

type navigationOptionsProps = {
    theme: Theme,
    title? : string,
    backTitle? : string,
    rightIcon? : IconDefinition | string,
    opacity? : number
}

const TotaraNavigationOptions = (props: navigationOptionsProps) => ({
    headerStyle: {
        borderBottomWidth: 0,
        backgroundColor: props.theme.colorSecondary1,
        shadowOpacity: 0,
        elevation: 0
    },
    headerTitleStyle: {
        color: props.theme.navigationHeaderTintColor,
        fontSize: normalize(20),
        opacity: props.opacity
    },
    title: props.title,
    headerBackTitle: null,
    headerTintColor: props.theme.navigationHeaderTintColor,
    headerRight: props.rightIcon ? <TouchableIcon icon={props.rightIcon} disabled={false} size={24} color={props.theme.navigationHeaderTintColor}/> : null
});

export default TotaraNavigationOptions;
