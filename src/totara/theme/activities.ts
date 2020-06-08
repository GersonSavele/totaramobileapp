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
import {
  margins,
  viewHeight,
  fontSizes,
  fontWeights
} from "@totara/theme/constants";
import { TotaraTheme } from "@totara/theme/Theme";

const sectionNotAvailable = () => {
  return {
    ...styles.notAvailableText,
    color: TotaraTheme.colorLink
  };
};

const sectionTitle = () => {
  return {
    ...styles.sectionTitle
  };
};

const rowContainer = () => {
  return {
    ...styles.accordionListWrap,
    backgroundColor: TotaraTheme.colorAccent
  };
};

const rowText = () => {
  return {
    ...styles.bodyName,
    color: TotaraTheme.colorNeutral8
  };
};

const rowInnerViewContainer = () => {
  return {
    ...styles.rowInnerContainer,
    opacity: 0.25
  };
};

const styles = StyleSheet.create({
  bodyName: {
    alignSelf: "flex-start",
    fontSize: normalize(fontSizes.fontSizeM),
    fontWeight: fontWeights.fontWeightL,
    justifyContent: "center"
  },
  bodyType: {
    alignSelf: "flex-start",
    flex: 2,
    fontSize: normalize(fontSizes.fontSizeXS),
    fontWeight: fontWeights.fontWeightXL
  },
  sectionViewWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: normalize(fontSizes.fontSize2XL),
    marginHorizontal: margins.marginL,
    alignItems: "center"
  },
  accordionListWrap: {
    flexDirection: "column"
  },
  rowInnerContainer: {
    height: normalize(fontSizes.fontSize3XL),
    justifyContent: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginHorizontal: normalize(margins.marginL)
  },
  rowContainer: {
    height: viewHeight.activityContainerHeight,
    justifyContent: "center",
    marginRight: margins.marginL
  },
  notAvailableText: {
    fontSize: normalize(fontSizes.fontSizeM),
    textAlign: "right",
    margin: margins.marginS,
    flex: 1
  },
  sectionTitle: {
    fontWeight: fontWeights.fontWeight2XL,
    fontSize: normalize(fontSizes.fontSizeL),
    flex: 2
  }
});

export {
  styles,
  sectionNotAvailable,
  sectionTitle,
  rowContainer,
  rowText,
  rowInnerViewContainer
};
