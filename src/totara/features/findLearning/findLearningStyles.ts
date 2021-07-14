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
import { TotaraTheme } from "@totara/theme/Theme";
import { StyleSheet } from "react-native";

export const findLearningStyles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    marginBottom: margins.marginS
  },
  headerWrapper: {
    paddingHorizontal: paddings.paddingXL,
    marginTop: margins.margin2XL
  },
  header: {
    ...TotaraTheme.textH2
  },
  searchBarContainer: {
    paddingBottom: 0,
    paddingTop: paddings.paddingL
  },
  searchBar: {
    backgroundColor: TotaraTheme.colorNeutral3,
    marginLeft: 0,
    paddingHorizontal: paddings.paddingL,
    ...TotaraTheme.textRegular,
    lineHeight: TotaraTheme.textRegular.fontSize
  },
  clearSearch: {
    marginLeft: 0,
    marginRight: 0
  },
  result: {
    ...TotaraTheme.textHeadline,
    padding: paddings.paddingXL
  },
  listWrapper: {
    paddingHorizontal: paddings.paddingL
  }
});
