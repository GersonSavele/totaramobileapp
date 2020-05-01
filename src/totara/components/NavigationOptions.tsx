import { IconDefinition } from "@fortawesome/fontawesome-common-types";
import { TouchableIcon } from "@totara/components/index";
import React from "react";
import {AppliedTheme} from "@totara/theme/Theme";

type navigationOptionsProps = {
    theme: AppliedTheme,
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
            fontSize: theme.textH4.fontSize,
            opacity: opacity
        },
        title: title,
        headerBackTitle: null,
        headerTintColor: theme.navigationHeaderTintColor,
        headerRight: rightIcon ? <TouchableIcon icon={rightIcon} disabled={false} size={24} color={theme.navigationHeaderTintColor}/> : null
    }
};

export default TotaraNavigationOptions;
