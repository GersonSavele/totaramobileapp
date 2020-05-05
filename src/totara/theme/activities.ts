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
  paddings,
  viewHeight,
  fontSizes,
  fontWeights,
  borderRadius,
} from "@totara/theme/constants";
import { AppliedTheme } from "@totara/theme/Theme";

const sectionDataNotAvailableTitle = (theme: AppliedTheme) => {
  return {
    ...theme.textH3,
    ...styles.sectionTitle,
    color: theme.colorNeutral6,
    flex: 3,
  };
};

const sectionDataNotAvailable = (theme: AppliedTheme) => {
  return {
    ...theme.textH3,
    ...styles.notAvailableText,
    color: theme.colorNeutral6,
    backgroundColor: theme.colorNeutral2,
    flex: 1,
  };
};

const sectionDataAvailableTitle = (theme: AppliedTheme) => {
  return {
    ...theme.textH3,
    ...styles.sectionTitle,
  };
};

const activityContainerWrap = (theme: AppliedTheme) => {
  return {
    ...styles.accordionListWrap,
    backgroundColor: theme.colorAccent,
  };
};

const unLockActivityTextWrap = (theme: AppliedTheme) => {
  return {
    ...styles.bodyName,
    color: theme.colorNeutral8,
    textAlign: "center",
  };
};

const lockActivityTextWrap = (theme: AppliedTheme) => {
  return {
    ...styles.bodyName,
    color: theme.colorNeutral8,
  };
};

const activityBodyWrap = () => {
  return {
    ...styles.activityBodyContainer,
    opacity: 0.25,
  };
};

const styles = StyleSheet.create({
  bodyName: {
    alignSelf: "flex-start",
    fontSize: normalize(fontSizes.fontSizeM),
    fontWeight: fontWeights.fontWeightL,
    justifyContent: "center",
  },
  bodyType: {
    alignSelf: "flex-start",
    flex: 2,
    fontSize: normalize(fontSizes.fontSizeXS),
    fontWeight: fontWeights.fontWeightXL,
  },
  sectionViewWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: normalize(fontSizes.fontSize2XL),
    marginHorizontal: margins.marginL,
    alignItems: "center",
  },
  accordionListWrap: {
    flexDirection: "column",
  },
  activityBodyContainer: {
    height: normalize(fontSizes.fontSize3XL),
    justifyContent: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginHorizontal: normalize(margins.marginL),
  },
  activityContainer: {
    height: viewHeight.activityContainerHeight,
    justifyContent: "center",
    marginHorizontal: margins.marginL,
  },
  notAvailableText: {
    fontWeight: fontWeights.fontWeightL,
    borderRadius: borderRadius.borderRadiusM,
    margin: margins.marginXS,
    fontSize: normalize(fontSizes.fontSizeXS),
    paddingHorizontal: paddings.paddingS,
    textAlign: "center",
  },
  sectionTitle: {
    fontWeight: fontWeights.fontWeight2XL,
    fontSize: normalize(fontSizes.fontSizeL),
  }
});

export {
  styles,
  sectionDataNotAvailableTitle,
  sectionDataNotAvailable,
  sectionDataAvailableTitle,
  activityContainerWrap,
  unLockActivityTextWrap,
  lockActivityTextWrap,
  activityBodyWrap,
};
