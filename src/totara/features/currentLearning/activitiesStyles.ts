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
import { normalize } from "@totara/theme";
import {
  margins,
  viewHeight,
  fontSizes,
  fontWeights
} from "@totara/theme/constants";
import { TotaraTheme } from "@totara/theme/Theme";

const styles = StyleSheet.create({
  rowTitle: {
    alignSelf: "flex-start",
    fontSize: normalize(fontSizes.fontSizeM),
    fontWeight: fontWeights.fontWeightL,
    justifyContent: "center",
    color: TotaraTheme.colorNeutral8
  },
  sectionView: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: viewHeight.activitySectionHeight,
    marginHorizontal: margins.marginL,
    alignItems: "center"
  },
  rowDidSelectContent: {
    flexDirection: "column",
    backgroundColor: TotaraTheme.colorAccent,
    flex: 1
  },
  rowContent: {
    height: normalize(fontSizes.fontSize3XL),
    justifyContent: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginHorizontal: normalize(margins.marginL)
  },
  rowTextContainer: {
    height: viewHeight.activityContainerHeight,
    justifyContent: "center",
    marginRight: margins.marginL
  },
  sectionNotAvailable: {
    fontSize: normalize(fontSizes.fontSizeM),
    textAlign: "right",
    margin: margins.marginS,
    flex: 1,
    color: TotaraTheme.colorLink
  },
  sectionTitle: {
    fontWeight: fontWeights.fontWeight2XL,
    fontSize: normalize(fontSizes.fontSizeL),
    flex: 2
  },
  labelContainer: {
    margin: margins.marginL,
    justifyContent: "center"
  },
  labelTextDescription: {
    textAlign: "left",
    fontSize: normalize(17)
  }
});

export default styles;
