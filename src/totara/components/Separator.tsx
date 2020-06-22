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

import React from "react";
import { View, StyleSheet } from "react-native";
import { margins } from "@totara/theme/constants";
import { TotaraTheme } from "@totara/theme/Theme";

const Separator = () => {
  return <View style={styles.listSeparator}></View>;
};

const styles = StyleSheet.create({
  listSeparator: {
    height: 0.5,
    opacity: 0.2,
    marginHorizontal: margins.marginL,
    backgroundColor: TotaraTheme.colorNeutral8
  }
});

export default Separator;
