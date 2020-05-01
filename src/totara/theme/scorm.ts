/**
 * This file is part of Totara Enterprise.
 *
 * Copyright (C) 2020 onwards Totara Learning Solutions LTD
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

import { StyleSheet } from "react-native";

import { gutter } from "./";
import { margins } from "./constants";

const scormSummaryStyles = StyleSheet.create({
  expanded: {
    flex: 1,
    flexDirection: "column",
  },
  sectionBreak: {
    flexDirection: "row",
    paddingTop: margins.marginS,
    paddingBottom: margins.marginS,
    justifyContent: "space-between",
  },
  sectionField: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: margins.marginS,
  },
  attemptContainer: {
    paddingHorizontal: gutter,
    paddingVertical: margins.marginS,
    flexDirection: "column",
    alignItems: "stretch",
  },
});

export { scormSummaryStyles };
