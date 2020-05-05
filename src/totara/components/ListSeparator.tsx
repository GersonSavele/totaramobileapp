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

import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import { ThemeContext } from "@totara/theme";
import { AppliedTheme } from "@totara/theme/Theme";
import { margins } from "@totara/theme/constants";

const ListSeparator = () => {
  const [theme] = useContext(ThemeContext);
  return <View style={activitySeparateView(theme)}></View>;
};

const activitySeparateView = (theme: AppliedTheme) => {
  return {
    ...styles.activityBodySeparator,
    backgroundColor: theme.colorNeutral8,
  };
};

const styles = StyleSheet.create({
  activityBodySeparator: {
    height: 0.5,
    opacity: 0.2,
    marginHorizontal: margins.marginL,
  },
});

export default ListSeparator;
