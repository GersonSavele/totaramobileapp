/**
 * This file is part of Totara Enterprise.
 *
 * Copyright (C) 2021 onwards Totara Learning Solutions LTD
 *
 * Totara Enterprise is provided only to Totara Learning Solutions
 * LTD’s customers and partners, pursuant to the terms and
 * conditions of a separate agreement with Totara Learning
 * Solutions LTD or its affiliate.
 *
 * If you do not have an agreement with Totara Learning Solutions
 * LTD, you may not access, use, modify, or distribute this software.
 * Please contact [sales@totaralearning.com] for more information.
 */

import { margins, paddings } from "@totara/theme/constants";
import { StyleSheet } from "react-native";

export const findLearningStyles = StyleSheet.create({
  tileWrapper: {
    justifyContent: "center",
    alignItems: "center",
    margin: margins.marginS,
    height: 100,
    flexDirection: "row",
    padding: paddings.paddingS,
    flex: 0.5
  },
  itemTitle: {
    textAlign: "center",
    flex: 1
  }
});
