/*

This file is part of Totara Enterprise.
*
Copyright (C) 2020 onwards Totara Learning Solutions LTD
*
Totara Enterprise is provided only to Totara Learning Solutions
LTD’s customers and partners, pursuant to the terms and
conditions of a separate agreement with Totara Learning
Solutions LTD or its affiliate.
*
If you do not have an agreement with Totara Learning Solutions
LTD, you may not access, use, modify, or distribute this software.
Please contact [sales@totaralearning.com] for more information.
*
*/

import { StyleSheet } from "react-native";
import { AppliedTheme } from "@totara/theme/Theme";
import { gutter } from "@totara/theme";

const headerViewWrap = (theme: AppliedTheme) => {
  return {
    ...styles.myLearningHeader,
    color: theme.colorSecondary1,
  };
};

const headerViewTitleWrap = (theme: AppliedTheme) => {
  return {
    ...theme.textH1,
    color: theme.navigationHeaderTintColor,
  };
};
const headerViewSubTitleWrap = (theme: AppliedTheme) => {
  return {
    ...theme.textSmall,
    color: theme.navigationHeaderTintColor,
  };
};

const contentWrap = () => {
    return {
        flex: 1, 
        backgroundColor: "transparent" 
    };
  };

  const spinnerContainer = ()=>{
     return{
        flex: 1,
        justifyContent: "center",
     }
  }

const styles = StyleSheet.create({
  myLearningHeader: {
    flexDirection: "column",
    justifyContent: "space-between",
    paddingHorizontal: gutter,
    paddingVertical: 8,
  },
});

export { headerViewWrap, headerViewTitleWrap, headerViewSubTitleWrap, contentWrap, spinnerContainer };
