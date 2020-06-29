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
import { margins, fontWeights } from "@totara/theme/constants";
import { TotaraTheme } from "@totara/theme/Theme";

const styles = StyleSheet.create({
  rowTitle: {
    ...TotaraTheme.textRegular,
    justifyContent: "center",
    alignSelf: "flex-start"
  },
  sectionView: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 58,
    marginHorizontal: margins.marginL,
    alignItems: "center"
  },
  rowDidSelectContent: {
    flexDirection: "column",
    backgroundColor: TotaraTheme.colorAccent,
    flex: 1
  },
  rowContent: {
    height: 68,
    justifyContent: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginHorizontal: margins.marginL
  },
  rowTextContainer: {
    height: 45,
    justifyContent: "center",
    marginRight: margins.marginL
  },
  sectionNotAvailable: {
    ...TotaraTheme.textRegular,
    color: TotaraTheme.colorLink,
    flex: 1,
    textAlign: "right",
    margin: margins.marginS
  },
  sectionTitle: {
    ...TotaraTheme.textHeadline,
    fontWeight: fontWeights.fontWeightBold,
    flex: 2
  },
  labelContainer: {
    margin: margins.marginL,
    justifyContent: "center"
  },
  labelTextDescription: {
    textAlign: "left",
    ...TotaraTheme.textRegular
  }
});

export default styles;
