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
 *
 */
import { StyleSheet } from "react-native";
import { spacedFlexRow } from "@totara/lib/styles/base";
import { TotaraTheme } from "@totara/theme/Theme";
import { margins } from "@totara/theme/constants";

const courseDetailsStyle = StyleSheet.create({
  expandContentWrap: {
    margin: margins.marginL,
    ...spacedFlexRow
  },
  expandTextWrap: {
    ...TotaraTheme.textMedium
  },
  scrollView: {
    flex: 1,
    backgroundColor: TotaraTheme.colorNeutral2
  }
});

export default courseDetailsStyle;
