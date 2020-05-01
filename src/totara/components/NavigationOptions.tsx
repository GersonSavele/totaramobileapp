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

const TotaraNavigationOptions = ({theme, opacity, title, rightIcon} : navigationOptionsProps) => {
    return {
        headerStyle: {
            borderBottomWidth: 0,
            backgroundColor: theme.colorSecondary1,
            shadowOpacity: 0,
            elevation: 0
        },
        headerTitleStyle: {
            color: theme.navigationHeaderTintColor,
            fontSize: normalize(20),
            opacity: opacity
        },
        title: title,
        headerBackTitle: null,
        headerTintColor: theme.navigationHeaderTintColor,
        headerRight: rightIcon ? <TouchableIcon icon={rightIcon} disabled={false} size={24} color={theme.navigationHeaderTintColor}/> : null
    }
};

export default TotaraNavigationOptions;
