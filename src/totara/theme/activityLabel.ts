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
import { normalize } from "@totara/theme";
import { margins } from "@totara/theme/constants";

const textStyles = StyleSheet.create({
  container: {
    margin: margins.marginL,
    justifyContent: "center",
  },
  labelTextName: {
    textAlign: "left",
    fontSize: normalize(17),
    fontWeight: "bold",
    marginBottom: margins.marginS
  },
  labelTextDescription: {
    textAlign: "left",
    fontSize: normalize(17),
    lineHeight:normalize(22)
  },
});

export { textStyles };